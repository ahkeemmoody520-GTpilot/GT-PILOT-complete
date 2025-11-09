import React from 'react';
import { XIcon, WifiIcon, KeyIcon, CheckCircleIcon } from './icons';

interface TerminalPanelProps {
    isOpen: boolean;
    onClose: () => void;
    logs: string[];
    activeModule: string;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ isOpen, onClose, logs, activeModule }) => {
    const logsEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                        <h2 className="text-lg font-bold text-cyan-400">Terminal Cognition</h2>
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto flex-grow flex flex-col">
                        {/* Status Section */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">System Status</h3>
                            <div className="space-y-3 text-slate-300">
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <WifiIcon className="w-5 h-5 text-green-400" />
                                        <span>Terminal Wi-Fi</span>
                                    </div>
                                    <span className="font-mono text-green-400">Connected</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <KeyIcon className="w-5 h-5 text-green-400" />
                                        <span>API Key Routing</span>
                                    </div>
                                    <span className="font-mono text-green-400">Secure</span>
                                </div>
                                 <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-5 h-5 text-cyan-400" />
                                        <span>Active Module</span>
                                    </div>
                                    <span className="font-mono text-cyan-400">{activeModule}</span>
                                </div>
                            </div>
                        </div>

                        {/* Logs Section */}
                        <div className="flex-grow flex flex-col">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Execution Logs</h3>
                            <div className="flex-grow p-3 bg-black/50 rounded-lg font-mono text-sm text-green-400 overflow-y-auto">
                                {logs.map((log, index) => (
                                    <p key={index} className="whitespace-pre-wrap leading-relaxed">{log}</p>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TerminalPanel;
