import React from 'react';
import { CheckCircleIcon, WarningIcon } from './icons';

interface InstallIndicatorProps {
    status: 'ok' | 'warning';
    message: string;
    showTooltip: boolean;
    onToggle: () => void;
}

const InstallIndicator: React.FC<InstallIndicatorProps> = ({ status, message, showTooltip, onToggle }) => {
    return (
        <div className="absolute bottom-4 right-4 z-30">
            {/* Tooltip */}
            <div 
                onClick={onToggle}
                className={`absolute bottom-full right-0 mb-3 w-max max-w-xs transform transition-all duration-300 ease-in-out cursor-pointer ${showTooltip ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
            >
                <div className="bg-slate-700/90 backdrop-blur-md border border-slate-600 rounded-lg px-4 py-2 text-sm text-white shadow-lg flex items-center gap-2">
                    {status === 'ok' ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <WarningIcon className="w-5 h-5 text-yellow-400" />}
                    <span>{message}</span>
                </div>
            </div>

            {/* Indicator Button */}
            <button 
                onClick={onToggle}
                className="w-12 h-12 rounded-full bg-blue-900/50 backdrop-blur-sm border-2 border-blue-500/70 flex items-center justify-center relative shadow-lg"
                aria-label="Toggle system status"
            >
                <span className="text-lg font-bold text-blue-300">GT</span>
                <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            </button>
            
            <style>{`
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.4), inset 0 0 5px rgba(59, 130, 246, 0.2); }
                    50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.8), inset 0 0 10px rgba(59, 130, 246, 0.4); }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default InstallIndicator;