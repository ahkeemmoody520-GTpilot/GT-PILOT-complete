import React from 'react';
import { XIcon } from './icons';

interface SystemTallyBarProps {
    tally: {
        total: number;
        verified: number;
        flagged: number;
        missing: number;
        lastScan: string;
    };
    geminiModules: number;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const SystemTallyBar: React.FC<SystemTallyBarProps> = ({ tally, geminiModules, isCollapsed, onToggleCollapse }) => {
    return (
        <div className="relative">
            <div 
                onClick={isCollapsed ? onToggleCollapse : undefined}
                className={`bg-blue-900/50 backdrop-blur-sm border-t border-blue-500/50 p-3 rounded-lg text-xs font-mono text-slate-300 transition-colors ${isCollapsed ? 'cursor-pointer hover:bg-blue-900/70' : ''}`}
                title={isCollapsed ? "Click to expand system options" : ""}
            >
                <div className="flex justify-between items-center flex-wrap gap-x-4 gap-y-1">
                    <span>Total: <span className="text-white font-semibold">{tally.total}</span></span>
                    <span>Verified: <span className="text-green-400 font-semibold">{tally.verified}</span></span>
                    <span>Flagged: <span className="text-yellow-400 font-semibold">{tally.flagged}</span></span>
                    <span>Missing: <span className="text-red-500 font-semibold">{tally.missing}</span></span>
                    <span>Gemini: <span className="text-white font-semibold">{geminiModules}</span></span>
                </div>
                <div className="text-right text-slate-500 mt-1">
                    Last Scan: {tally.lastScan}
                </div>
                
                {!isCollapsed && (
                     <button
                        onClick={onToggleCollapse}
                        className="absolute bottom-3 left-3 p-1.5 bg-slate-700/50 text-slate-400 rounded-full hover:bg-slate-600 hover:text-white transition-colors group"
                        aria-label="Collapse system options"
                    >
                        <XIcon className="w-4 h-4" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Collapse system options
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SystemTallyBar;