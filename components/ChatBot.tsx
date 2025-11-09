import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { PhotoIcon, XIcon, ChevronDownIcon, CheckCircleIcon, ThumbsUpIcon, ThumbsDownIcon, LightBulbIcon, CopyIcon, ShareIcon, ExpandIcon, SpeakerWaveIcon, CropIcon } from './icons';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatBotProps {
  messages: ChatMessage[];
  onSend: (text: string, image: { b64: string, mimeType: string } | null) => void;
  isLoading: boolean;
  onActivateRender: (url: string, userPrompt?: string) => void;
  onViewImage: (url: string, isUserUpload: boolean) => void;
  isRendering: boolean;
  isAwaitingConfirmation: boolean;
  renderProgress: number;
  renderEnhancement: string;
  onFeedback: (messageId: string, feedbackType: 'up' | 'down' | 'idea') => void;
  onDeclineRender: (messageId: string) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const ProgressBar: React.FC<{ progress: number; enhancement: string }> = ({ progress, enhancement }) => {
    return (
        <div className="w-full bg-slate-700/50 rounded-full h-8 p-1 border border-slate-600 backdrop-blur-sm">
            <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full flex items-center justify-between px-3 transition-all duration-500 ease-linear"
                style={{ width: `${progress}%` }}
            >
                <span className="text-sm font-semibold text-white truncate">{enhancement}</span>
                {progress > 10 && <span className="text-sm font-semibold text-white">{Math.round(progress)}%</span>}
            </div>
        </div>
    );
};

const FeedbackControls: React.FC<{ onFeedback: (type: 'up' | 'down' | 'idea') => void }> = ({ onFeedback }) => {
    return (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-600/50">
            <button onClick={() => onFeedback('up')} className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-700/50 rounded-full transition-colors" title="Good response"><ThumbsUpIcon className="w-5 h-5" /></button>
            <button onClick={() => onFeedback('down')} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-full transition-colors" title="Bad response"><ThumbsDownIcon className="w-5 h-5" /></button>
            <button onClick={() => onFeedback('idea')} className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-slate-700/50 rounded-full transition-colors" title="Suggest an idea"><LightBulbIcon className="w-5 h-5" /></button>
            <div className="w-px h-5 bg-slate-600/50 mx-1"></div>
            <button onClick={() => alert('Text-to-speech coming soon!')} className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-full transition-colors" title="Read response aloud"><SpeakerWaveIcon className="w-5 h-5" /></button>
            <button className="p-1.5 text-slate-500 cursor-not-allowed" title="Copy (coming soon)"><CopyIcon className="w-5 h-5" /></button>
            <button className="p-1.5 text-slate-500 cursor-not-allowed" title="Share (coming soon)"><ShareIcon className="w-5 h-5" /></button>
        </div>
    );
};

const FeedbackResponse: React.FC<{ response: ChatMessage['feedbackResponse'] }> = ({ response }) => {
    if (!response) return null;

    if (response.isLoading) {
        return (
            <div className="mt-3 text-sm text-slate-400 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-cyan-400 border-slate-600 rounded-full animate-spin"></div>
                <span>Generating protocol response...</span>
            </div>
        );
    }

    return (
        <div className="mt-4 animate-fade-in">
            <p className="text-sm text-slate-300 mb-2">{response.text}</p>
        </div>
    );
};


const ChatBot: React.FC<ChatBotProps> = ({ messages, onSend, isLoading, onActivateRender, onViewImage, isRendering, isAwaitingConfirmation, renderProgress, renderEnhancement, onFeedback, onDeclineRender }) => {
    const [input, setInput] = useState('');
    const [uploadedImage, setUploadedImage] = useState<{ b64: string, mimeType: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);
    
    const toggleMessageExpansion = (id: string) => {
        setExpandedMessages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSendClick = () => {
        if (isLoading || (!input.trim() && !uploadedImage)) return;
        onSend(input, uploadedImage);
        setInput('');
        setUploadedImage(null);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
             if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file.');
                return;
            }
            try {
                const base64String = await blobToBase64(file);
                setUploadedImage({ b64: base64String, mimeType: file.type });
            } catch (err) {
                 console.error("Error reading file:", err);
                 setError("Could not read the selected file.");
            }
        }
        if(event.target) event.target.value = '';
    };

    return (
        <div className="h-full w-full p-4 md:p-6 lg:p-8 text-white flex flex-col relative">
            <h1 className="text-3xl font-bold text-center mb-4 text-cyan-400">GT Pilot Chat</h1>
            <div
                ref={messagesContainerRef}
                className="flex-grow min-h-0 overflow-y-auto p-4 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50 space-y-4 scroll-smooth shadow-[0_8px_30px_rgb(0,0,0,0.12),_inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
                {messages.map((msg) => {
                    const isExpanded = expandedMessages.has(msg.id);
                    return (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {(() => {
                                switch(msg.type) {
                                    case 'loading':
                                        return (
                                            <div className="max-w-lg p-3 rounded-xl bg-slate-700">
                                                <ThinkingIndicator isComplete={msg.isComplete} />
                                            </div>
                                        );
                                    case 'cognition':
                                    case 'response':
                                    case 'upsell':
                                    case 'visual':
                                    default: // Handles all model messages with feedback logic
                                        const isLong = msg.text && msg.text.length > 350;
                                        
                                        return (
                                            <div className={`max-w-3xl p-3 rounded-xl w-full ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'} ${msg.type === 'upsell' ? 'border border-cyan-500/50 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : ''}`}>
                                                {msg.imageUrl && (
                                                    <div className="mb-2 overflow-hidden rounded-lg aspect-video bg-black/20 group relative cursor-pointer" onClick={() => onViewImage(msg.imageUrl!, msg.role === 'user')} title="Crop & Refine Image">
                                                        <img src={msg.imageUrl} alt="User upload" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                            <CropIcon className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {msg.type === 'visual' && (
                                                    <>
                                                        <p className="whitespace-pre-wrap mb-3">{msg.text}</p>
                                                        {msg.thumbnailUrl && (
                                                            <div className="space-y-3">
                                                                <div 
                                                                    onClick={() => onViewImage(msg.thumbnailUrl!, false)}
                                                                    className="group relative aspect-video cursor-pointer bg-black rounded-lg border-2 border-slate-600 hover:border-cyan-400 transition-colors overflow-hidden"
                                                                    title="View Full Render"
                                                                >
                                                                    <img src={msg.thumbnailUrl} alt="Visual layout preview" className="w-full h-full object-cover"/>
                                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                        <ExpandIcon className="w-8 h-8 text-white" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <button 
                                                                        onClick={() => onActivateRender(msg.thumbnailUrl!, msg.userPrompt)}
                                                                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors text-sm"
                                                                    >
                                                                        Push to HTML Sandbox
                                                                    </button>
                                                                     <button 
                                                                        onClick={() => onDeclineRender(msg.id)}
                                                                        className="flex-1 px-4 py-2 bg-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-500 transition-colors text-sm"
                                                                    >
                                                                        Decline / Hold
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {msg.type === 'cognition' && msg.cognitionData && (
                                                    <>
                                                         <div className="flex justify-between items-start">
                                                            <p className="whitespace-pre-wrap font-semibold flex-grow pr-2">{msg.cognitionData.summary}</p>
                                                            <button onClick={() => toggleMessageExpansion(msg.id)} className="p-1 text-slate-400 hover:text-white rounded-full flex-shrink-0">
                                                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                        {isExpanded && (
                                                            <div className="mt-3 pt-3 border-t border-slate-600/50">
                                                                {msg.cognitionData.detailedBreakdown && (
                                                                    <p className="text-sm text-slate-300 whitespace-pre-wrap mb-3 leading-relaxed">{msg.cognitionData.detailedBreakdown}</p>
                                                                )}
                                                                <h4 className="text-xs font-bold text-slate-400">Enhancement Stack:</h4>
                                                                <ul className="text-xs text-slate-300 list-disc list-inside mt-1 space-y-0.5">
                                                                    {msg.cognitionData.enhancements.map((e, i) => <li key={i}>{e}</li>)}
                                                                </ul>
                                                                <p className="text-xs text-slate-400 italic mt-3">Fidelity Check: {msg.cognitionData.fidelityCheck}</p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {(msg.type !== 'visual' && msg.type !== 'cognition') && (
                                                     <p className={`whitespace-pre-wrap ${msg.role === 'user' ? '' : ''}`}>
                                                        {isLong && !isExpanded ? `${msg.text.substring(0, 350)}...` : msg.text}
                                                    </p>
                                                )}
                                                
                                                {msg.source === 'sandbox' && (
                                                    <div className="mt-2 text-xs text-blue-300/80 font-mono italic flex items-center gap-1.5 pt-2 border-t border-blue-700/50">
                                                        <span>🧠</span>
                                                        <span>Synced from Sandbox Chatbox</span>
                                                    </div>
                                                )}
                                                {isLong && (
                                                    <button onClick={() => toggleMessageExpansion(msg.id)} className="text-cyan-400 text-sm mt-2 hover:underline">
                                                        {isExpanded ? 'Show Less' : 'Show More'}
                                                    </button>
                                                )}
                                                
                                                {msg.role === 'model' && (
                                                    msg.feedback ? (
                                                        <>
                                                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-600/50 text-xs text-slate-400">
                                                                <CheckCircleIcon className="w-4 h-4 text-green-500"/>
                                                                <span>Feedback received. Thank you! GT Protocol Activated.</span>
                                                            </div>
                                                            <FeedbackResponse response={msg.feedbackResponse} />
                                                        </>
                                                    ) : (
                                                        <FeedbackControls onFeedback={(type) => onFeedback(msg.id, type)} />
                                                    )
                                                )}
                                            </div>
                                        );
                                }
                        })()}
                        </div>
                    )
                })}
            </div>
            {error && <p className="text-red-400 text-center mt-2">A communication error occurred. Please check your input and try again.</p>}
            <div className="mt-4">
                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-2 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12),_inset_0_1px_0_rgba(255,255,255,0.05)]">
                    {uploadedImage && (
                        <div className="relative self-start w-20 h-20 mb-2 ml-2">
                            <img src={uploadedImage.b64} className="w-full h-full object-cover rounded" alt="upload preview" />
                            <button
                                onClick={() => setUploadedImage(null)}
                                className="absolute -top-2 -right-2 bg-slate-600 rounded-full p-1 text-white hover:bg-slate-500"
                                aria-label="Remove image"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-end w-full">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask GT Pilot anything..."
                            className="flex-grow bg-transparent resize-none focus:outline-none text-white placeholder-slate-400 p-2"
                            rows={3}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendClick();
                                }
                            }}
                            disabled={isLoading}
                        />
                        <div className="flex items-center gap-2 ml-2 self-end">
                            <button
                                onClick={handleUploadClick}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                title="Upload Image"
                            >
                                <PhotoIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleSendClick}
                                disabled={isLoading || (!input.trim() && !uploadedImage)}
                                className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             {isRendering && (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <ProgressBar progress={renderProgress} enhancement={renderEnhancement} />
                </div>
            )}
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ChatBot;