import React from 'react';
import { XIcon, WarningIcon } from './icons';

interface ClearConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ClearConfirmationModal: React.FC<ClearConfirmationModalProps> = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div 
                className="bg-slate-900 rounded-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale border border-red-500/30 shadow-2xl shadow-red-500/20"
            >
                <div className="relative p-6">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <WarningIcon className="w-8 h-8 text-red-400" />
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Clear Session Confirmation
                        </h2>
                        <p className="text-slate-400">
                            Are you sure you want to clear all logs, revisions, and messages? This action is irreversible.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        <button 
                            onClick={onCancel}
                            className="px-6 py-2.5 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
                        >
                            Confirm Clear
                        </button>
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

export default ClearConfirmationModal;
