import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PhotoIcon, XIcon, MicIcon, CollapseIcon, CheckCircleIcon } from './icons';

// Add interfaces for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    onspeechstart: () => void;
    start: () => void;
    stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
}

interface SpeechRecognitionResult {
    readonly [index: number]: SpeechRecognitionAlternative;
    readonly length: number;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
}

// Augment the Window interface to include SpeechRecognition constructors.
declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

interface SandboxChatPanelProps {
    addLog: (message: string) => void;
    onSend: (input: string, uploadedImage: { b64: string, mimeType: string } | null) => void;
    isLoading: boolean;
    renderedHtml: string | null;
    sourceImageUrl: string | null;
    isAwaitingConfirmation: boolean;
    onAccept: () => void;
    onReject: () => void;
}

const SandboxChatPanel: React.FC<SandboxChatPanelProps> = ({ addLog, onSend, isLoading, renderedHtml, sourceImageUrl, isAwaitingConfirmation, onAccept, onReject }) => {
    const [input, setInput] = useState('');
    const [uploadedImage, setUploadedImage] = useState<{ b64: string, mimeType: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showFidelityPreview, setShowFidelityPreview] = useState(false);

    // New state and refs for microphone
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const silenceTimeoutRef = useRef<number | null>(null);

    // Setup speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => (prev ? prev + ' ' : '') + transcript);
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                setMicError("No speech detected. Timed out.");
            } else if (event.error === 'not-allowed') {
                setMicError("Microphone access denied.");
            } else {
                setMicError("Voice input error.");
            }
        };

        recognition.onend = () => {
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
            setIsListening(false);
        };
        
        recognition.onspeechstart = () => {
             if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
                silenceTimeoutRef.current = null;
            }
        };

        recognitionRef.current = recognition;

        return () => {
             if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleMicClick = () => {
        const recognition = recognitionRef.current;
        if (!recognition) {
            setMicError("Voice input is not supported on this browser.");
            return;
        };

        if (isListening) {
            recognition.stop();
        } else {
            setMicError(null);
            setIsListening(true);
            try {
                recognition.start();
                silenceTimeoutRef.current = window.setTimeout(() => {
                    if(recognitionRef.current) {
                        recognitionRef.current.stop();
                    }
                }, 10000);
            } catch (e) {
                console.error("Error starting speech recognition:", e);
                setMicError("Could not start microphone.");
                setIsListening(false);
            }
        }
    };

    const handleSendClick = () => {
        if (!isLoading) {
            onSend(input, uploadedImage);
            setInput('');
            setUploadedImage(null);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const base64String = await blobToBase64(file);
            setUploadedImage({ b64: base64String, mimeType: file.type });
        }
        if(event.target) event.target.value = '';
    };

    return (
        <div className="h-full w-full flex flex-col bg-slate-800 text-white">
            <div 
                className="flex-grow overflow-hidden relative"
                onMouseEnter={() => setShowFidelityPreview(true)}
                onMouseLeave={() => setShowFidelityPreview(false)}
            >
                 {renderedHtml ? (
                    <div className="w-full h-full bg-white">
                        <iframe
                            srcDoc={renderedHtml}
                            title="Sandbox Render"
                            className="w-full h-full border-0"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                ) : (
                    <div className="h-full p-4 flex items-center justify-center bg-white">
                        <div className="text-center text-slate-500 max-w-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Sandbox Inactive</h3>
                            <p>Generate and confirm a render to activate this panel for real-time HTML refinement.</p>
                        </div>
                    </div>
                )}
                {showFidelityPreview && sourceImageUrl && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-none transition-opacity duration-300 animate-fade-in-preview">
                        <div className="p-2 bg-slate-900/50 rounded-lg border border-cyan-400">
                             <img src={sourceImageUrl} alt="Fidelity Preview" className="max-w-md max-h-[40vh] object-contain rounded" />
                             <p className="text-center text-xs text-cyan-400 font-mono mt-2">Fidelity Preview</p>
                        </div>
                    </div>
                )}
            </div>
            {isAwaitingConfirmation ? (
                <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-800 flex items-center justify-center gap-4">
                    <p className="text-md font-semibold text-white hidden sm:block">Confirm Render Fidelity:</p>
                    <button 
                        onClick={onAccept} 
                        className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Accept & Lock
                    </button>
                    <button 
                        onClick={onReject} 
                        className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2"
                    >
                         <XIcon className="w-5 h-5" />
                        Reject (Mismatch)
                    </button>
                </div>
            ) : (
                <div className="flex-shrink-0 p-2 sm:p-4 border-t border-slate-700 bg-slate-800">
                     <div className="bg-slate-900 border border-slate-600 rounded-lg p-2 flex flex-col">
                        {uploadedImage && (
                            <div className="relative self-start w-16 h-16 mb-2 ml-2">
                                <img src={uploadedImage.b64} className="w-full h-full object-cover rounded" alt="upload preview" />
                                <button onClick={() => setUploadedImage(null)} className="absolute -top-2 -right-2 bg-slate-600 rounded-full p-1 text-white hover:bg-slate-500"><XIcon className="w-4 h-4" /></button>
                            </div>
                        )}
                        <div className="flex items-end w-full">
                            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Refine your project..." className="flex-grow bg-transparent resize-none focus:outline-none text-white placeholder-slate-400 p-2" rows={2} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendClick(); } }} disabled={isLoading} />
                            <div className="flex items-center gap-2 ml-2 self-end">
                                <button
                                    onClick={handleMicClick}
                                    title={isListening ? "Stop listening" : "Start voice input"}
                                    className={`p-2 transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                                    disabled={!recognitionRef.current || isLoading}
                                >
                                    <MicIcon className="w-6 h-6" />
                                    {isListening && <span className="absolute inset-0 rounded-full bg-cyan-400/50 animate-ping"></span>}
                                </button>
                                <button onClick={handleUploadClick} className="p-2 text-slate-400 hover:text-white transition-colors" title="Upload Image"><PhotoIcon className="w-6 h-6" /></button>
                                <button onClick={handleSendClick} disabled={isLoading || (!input.trim() && !uploadedImage)} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">Send</button>
                            </div>
                        </div>
                         <div className="flex justify-between items-center text-xs text-slate-500 pr-2 pt-1 h-4">
                            <span className="text-red-400">{micError}</span>
                            <span>{input.length} / 1000</span>
                         </div>
                    </div>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <style>{`
                @keyframes fade-in-preview {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-preview {
                    animation: fade-in-preview 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SandboxChatPanel;
