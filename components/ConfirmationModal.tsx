import React from 'react';
import { XIcon } from './icons';

interface ConfirmationModalProps {
    imageUrl: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ imageUrl, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div 
                className="bg-slate-900 rounded-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                    backgroundColor: '#0f172a'
                }}
            >
                <div className="relative p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            HTML-to-Sandbox Render
                        </h2>
                        <button onClick={onCancel} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-black/50 p-2 rounded-lg shadow-lg">
                        <img src={imageUrl} alt="Sandbox preview" className="w-full h-auto object-contain rounded-lg max-h-[40vh]" />
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-white text-xl font-medium">Transform this mockup into a live HTML layout?</p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button 
                                onClick={onConfirm}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
                            >
                                Add HTML to Sandbox
                            </button>
                            <button 
                                onClick={onCancel}
                                className="px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ConfirmationModal;