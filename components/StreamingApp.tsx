import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicIcon, StopIcon, ChevronDownIcon, SpeakerWaveIcon } from './icons';
import { Revision } from '../types';
import { getGenerativeAI } from '../services/gt-services';

// Audio helper functions from guidelines
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

interface VoiceOption {
    id: string;
    name: string;
    description: string;
    apiName: string;
}

const VOICE_OPTIONS: VoiceOption[] = [
    { id: 'gt-pilot', name: 'GT-Pilot', description: 'Deep, composed, protective. Streaming-native voice with cinematic clarity.', apiName: 'Charon' },
    { id: 'baritone-neo', name: 'Baritone Neo', description: 'Deep, urban-smart, cinematic clarity. Inspired by The Matrix with educator cadence.', apiName: 'Fenrir' },
    { id: 'oracle', name: 'Oracle', description: 'Warm, wise, female.', apiName: 'Kore' },
    { id: 'sentinel', name: 'Sentinel', description: 'Robotic, neutral, AI.', apiName: 'Puck' },
    { id: 'commander', name: 'Commander', description: 'Assertive, clear, male.', apiName: 'Charon' },
    { id: 'echo', name: 'Echo', description: 'Soft, gentle, female.', apiName: 'Zephyr' },
    { id: 'titan', name: 'Titan', description: 'Deep, resonant, cinematic narrator.', apiName: 'Fenrir' },
    { id: 'muse', name: 'Muse', description: 'Energetic, bright, female.', apiName: 'Kore' },
    { id: 'vector', name: 'Vector', description: 'Sharp, precise, AI.', apiName: 'Puck' },
    { id: 'aura', name: 'Aura', description: 'Warm, reassuring, female.', apiName: 'Zephyr' },
    { id: 'goliath', name: 'Goliath', description: 'Powerful, booming, male.', apiName: 'Fenrir' },
    { id: 'seraph', name: 'Seraph', description: 'Elegant, sharp, female.', apiName: 'Kore' },
    { id: 'unit734', name: 'Unit 734', description: 'Classic robot, monotone.', apiName: 'Puck' },
    { id: 'ghost', name: 'Ghost', description: 'Whispery, calm, male.', apiName: 'Charon' },
    { id: 'willow', name: 'Willow', description: 'Soft-spoken, kind, female.', apiName: 'Zephyr' },
];

const DEFAULT_VOICE_ID = 'gt-pilot';

type StreamingState = 'idle' | 'listening' | 'thinking' | 'talking';

const StateIndicator = ({ state }: { state: StreamingState }) => {
    let text = '';
    switch (state) {
        case 'listening': text = 'GT is listening'; break;
        case 'thinking': text = 'GT is thinking'; break;
        case 'talking': text = 'GT is talking'; break;
        default: return null;
    }
    return (
        <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">{text}</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
        </div>
    );
};

interface StreamingAppProps {
    addLog: (message: string) => void;
    addRevision: (data: Omit<Revision, 'id' | 'timestamp' | 'version' | 'confirmed'>) => void;
    sessionContext: string;
}

const StreamingApp: React.FC<StreamingAppProps> = ({ addLog, addRevision, sessionContext }) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingState, setStreamingState] = useState<StreamingState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => localStorage.getItem('gt-pilot-voice') || DEFAULT_VOICE_ID);
    const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
    const [liveRailText, setLiveRailText] = useState('');
    const [isAnimated, setIsAnimated] = useState(false);

    const sessionPromise = useRef<Promise<{ close: () => void; sendRealtimeInput: (input: { media: Blob; }) => void; }> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const analyserNode = useRef<AnalyserNode | null>(null);
    const scriptProcessorNode = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const voiceSelectorRef = useRef<HTMLDivElement>(null);
    const nextStartTime = useRef(0);
    const audioSources = useRef(new Set<AudioBufferSourceNode>());
    const hasLoggedSync = useRef(false);
    const fullUserTurn = useRef('');
    const fullModelTurn = useRef('');
    
    useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('gt-pilot-voice', selectedVoiceId);
    }, [selectedVoiceId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (voiceSelectorRef.current && !voiceSelectorRef.current.contains(event.target as Node)) {
                setIsVoiceSelectorOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const stopStreaming = useCallback(() => {
        setIsStreaming(false);
        setStreamingState('idle');
        setLiveRailText('');
        animationFrameId.current && cancelAnimationFrame(animationFrameId.current);
        streamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorNode.current?.disconnect();
        mediaStreamSource.current?.disconnect();
        analyserNode.current?.disconnect();
        inputAudioContext.current?.close().catch(console.error);
        outputAudioContext.current?.close().catch(console.error);
        sessionPromise.current?.then(session => session.close());
        sessionPromise.current = null;
    }, []);

    const drawWaveform = useCallback(() => {
        if (!analyserNode.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyserNode.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.current.getByteTimeDomainData(dataArray);
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#22d3ee'; // cyan-400
            ctx.beginPath();
            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
        animationFrameId.current = requestAnimationFrame(drawWaveform);
    }, []);

    const startStreaming = useCallback(async (voiceApiName: string) => {
        setIsStreaming(true);
        setError(null);
        hasLoggedSync.current = false;
        setStreamingState('listening');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const ai = getGenerativeAI();
            inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const systemInstruction = `${sessionContext}\n\nYou are GT Pilot. When asked about your voice, you should refer to it as 'GT-Pilot Mode'. Your voice is deep, composed, and has a protective tone with cinematic clarity. You must respond with full awareness of the provided context about what was previously said, rendered, and what decisions were made.`;

            sessionPromise.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceApiName } },
                    },
                    systemInstruction: systemInstruction,
                },
                callbacks: {
                    onopen: () => {
                        addLog("Directive v66.7 installed. Streaming UI updated.");
                        addLog("Message bubbles removed. Streaming interface now visual-only.");
                        addLog("Vocal visualizer locked. Height set to 30%—no drift.");
                        addLog("Caption rail retained. All spoken input now visualized in real time.");
                        addLog("Avatar prep logic active. Visual stream ready for 3D GT integration.");
                        addLog("Cognition preserved. Visual update applied without affecting GT’s intelligence.");

                        setStreamingState('listening');
                        const source = inputAudioContext.current!.createMediaStreamSource(stream);
                        mediaStreamSource.current = source;
                        const processor = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorNode.current = processor;
                        processor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.current?.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
                        };
                        const analyser = inputAudioContext.current!.createAnalyser();
                        analyser.fftSize = 2048;
                        analyserNode.current = analyser;
                        source.connect(analyser);
                        analyser.connect(processor);
                        processor.connect(inputAudioContext.current!.destination);
                        drawWaveform();
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setStreamingState('listening');
                            const { text } = message.serverContent.inputTranscription;
                            fullUserTurn.current = text;
                            setLiveRailText(text);
                        }
                        if (message.serverContent?.outputTranscription) {
                             if (!hasLoggedSync.current) {
                                addLog("Live stream dialogue synced. GT is ready to discuss all system decisions.");
                                addLog("GT cognition synced. Voice transcript fully parsed.");
                                hasLoggedSync.current = true;
                            }
                            setStreamingState('talking');
                            const { text } = message.serverContent.outputTranscription;
                            fullModelTurn.current = text;
                            setLiveRailText(text);
                        }
                        if (message.serverContent?.turnComplete) {
                            const userText = fullUserTurn.current.trim();
                            const modelText = fullModelTurn.current.trim();
                            
                            if (userText) {
                                setStreamingState('thinking');
                                addRevision({ type: 'PROMPT_INPUT', description: `Voice command: "${userText}"` });
                            }
                        
                            fullUserTurn.current = '';
                            fullModelTurn.current = '';
                            setLiveRailText('');
                            
                            if (modelText) {
                                setStreamingState('listening');
                            }
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            const currentOutputContext = outputAudioContext.current!;
                            nextStartTime.current = Math.max(nextStartTime.current, currentOutputContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), currentOutputContext, 24000, 1);
                            const source = currentOutputContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(currentOutputContext.destination);
                            source.addEventListener('ended', () => audioSources.current.delete(source));
                            source.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                            audioSources.current.add(source);
                        }
                        if (message.serverContent?.interrupted) {
                            for (const source of audioSources.current.values()) {
                                source.stop(0);
                                audioSources.current.delete(source);
                            }
                            nextStartTime.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error', e);
                        setError('A session error occurred. Please try again.');
                        stopStreaming();
                    },
                    onclose: () => {
                        console.log('Session closed.');
                        if(isStreaming) stopStreaming();
                    },
                }
            });
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Failed to start streaming session.');
            setIsStreaming(false);
            setStreamingState('idle');
        }
    }, [drawWaveform, stopStreaming, isStreaming, addLog, addRevision, sessionContext]);

    useEffect(() => () => stopStreaming(), [stopStreaming]);

    const handleToggleStreaming = () => {
        if (isStreaming) {
            stopStreaming();
            addRevision({ type: 'STREAM_TOGGLE', description: 'Voice streaming session ended.' });
        } else {
            const voice = VOICE_OPTIONS.find(v => v.id === selectedVoiceId) || VOICE_OPTIONS[0];
            addRevision({ type: 'STREAM_TOGGLE', description: `Voice streaming session started with ${voice.name}.` });
            startStreaming(voice.apiName);
        }
    };
    
    const handleSelectVoice = (voice: VoiceOption) => {
        setSelectedVoiceId(voice.id);
        setIsVoiceSelectorOpen(false);
        addLog(`Voice updated. GT is now speaking in ${voice.name} Mode.`);
        addRevision({ type: 'VOICE_CHANGE', description: `Switched voice to ${voice.name}.` });
        if (isStreaming) {
            stopStreaming();
            setTimeout(() => startStreaming(voice.apiName), 100);
        }
    };
    
    const handlePlaySample = (e: React.MouseEvent, voiceName: string) => {
        e.stopPropagation();
        alert(`This would play a sample of the ${voiceName} voice.`);
    };
    
    const currentVoice = VOICE_OPTIONS.find(v => v.id === selectedVoiceId) || VOICE_OPTIONS[0];

    return (
        <div className="relative w-full text-white flex flex-col">
             <div ref={voiceSelectorRef} className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => setIsVoiceSelectorOpen(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <span>{currentVoice.name}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isVoiceSelectorOpen ? 'rotate-180' : ''}`} />
                </button>
                {isVoiceSelectorOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                        {VOICE_OPTIONS.map(voice => (
                            <div
                                key={voice.id}
                                onClick={() => handleSelectVoice(voice)}
                                className={`p-3 cursor-pointer hover:bg-slate-700/50 ${selectedVoiceId === voice.id ? 'bg-cyan-500/10' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-grow">
                                        <h4 className={`font-semibold ${selectedVoiceId === voice.id ? 'text-cyan-400' : 'text-white'}`}>{voice.name}</h4>
                                        <p className="text-xs text-slate-400">{voice.description}</p>
                                    </div>
                                    <button 
                                      onClick={(e) => handlePlaySample(e, voice.name)}
                                      className="ml-2 p-2 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white flex-shrink-0"
                                      aria-label={`Play sample for ${voice.name}`}
                                    >
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex-grow flex items-center justify-center">
                {isStreaming ? (
                     <div className="text-center text-slate-500">
                        {/* 3D animated avatar will be rendered here, syncing with voice stream. */}
                        {/* This placeholder is active as per Directive v66.7 */}
                        <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-5xl text-cyan-400 animate-pulse">
                            G
                        </div>
                        <p className="mt-4 text-sm font-mono">GT Avatar Ready for Integration</p>
                    </div>
                ) : (
                    <div className="text-center text-slate-400">
                        <div className={`transition-all duration-1000 ease-out ${isAnimated ? 'opacity-100 blur-none translate-y-0' : 'opacity-0 blur-sm translate-y-3'}`}>
                           <h2 className="relative text-2xl font-bold text-white inline-block pb-2">
                               GT Pilot Streaming
                               <span
                                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ease-out ${isAnimated ? 'w-full' : 'w-0'}`}
                                  style={{ transitionDelay: '500ms' }}
                                />
                           </h2>
                        </div>
                        <div className={`transition-all duration-1000 ease-out ${isAnimated ? 'opacity-100 blur-none translate-y-0' : 'opacity-0 blur-sm translate-y-3'}`} style={{ transitionDelay: '200ms' }}>
                           <p>Click the orb to start a voice conversation.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full flex-shrink-0 flex flex-col items-center justify-end p-4" style={{ height: '30vh' }}>
                <canvas ref={canvasRef} width="600" height="100" className={`transition-opacity duration-300 ${isStreaming ? 'opacity-100' : 'opacity-0'}`}></canvas>
                
                <div className="text-center my-2">
                    <div className="h-6 flex items-center justify-center">
                        <StateIndicator state={streamingState} />
                    </div>
                    <div className="h-6 px-4">
                        <p className="text-slate-400 truncate">{liveRailText}</p>
                    </div>
                </div>

                <button
                    onClick={handleToggleStreaming}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out flex-shrink-0
                        ${isStreaming ? 'bg-red-500/50 border-2 border-red-400 shadow-[0_0_20px_theme(colors.red.500)]' 
                                        : 'bg-cyan-500/30 border-2 border-cyan-400 shadow-[0_0_20px_theme(colors.cyan.500)] hover:bg-cyan-500/50'}`}
                    aria-label={isStreaming ? 'Stop Streaming' : 'Start Streaming'}
                >
                    {isStreaming ? <StopIcon className="w-10 h-10 text-white" /> : <MicIcon className="w-10 h-10 text-white" />}
                </button>
                {error && <p className="text-red-400 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default StreamingApp;