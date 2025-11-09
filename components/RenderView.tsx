import React from 'react';
import { CheckCircleIcon, XIcon } from './icons';

interface RenderViewProps {
    htmlContent: string;
    isAwaitingConfirmation: boolean;
    onAccept: () => void;
    onReject: () => void;
}

const RenderView: React.FC<RenderViewProps> = ({ htmlContent, isAwaitingConfirmation, onAccept, onReject }) => {
    return (
        <div className="flex flex-col h-full p-4 md:p-8 text-white relative">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Sandbox Render</h2>
            <div className="flex-grow bg-white rounded-2xl overflow-hidden relative">
                <iframe
                    srcDoc={htmlContent}
                    title="Rendered HTML"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                />
                {isAwaitingConfirmation && (
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md p-4 border-t border-slate-700 flex items-center justify-center gap-4 animate-fade-in z-10">
                        <p className="text-lg font-semibold text-white">Confirm Render Fidelity:</p>
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
                )}
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default RenderView;