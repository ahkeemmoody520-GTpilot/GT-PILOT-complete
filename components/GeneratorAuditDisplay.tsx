import React from 'react';
import ModuleLedger from './ModuleLedger';
import SystemTallyBar from './SystemTallyBar';
import { CheckCircleIcon, WarningIcon } from './icons';

interface GeneratorAuditDisplayProps {
    modules: Array<{ name: string; status: 'ok' | 'warning' }>;
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

const GeneratorAuditDisplay: React.FC<GeneratorAuditDisplayProps> = ({ modules, tally, geminiModules, isCollapsed, onToggleCollapse }) => {
    const isOk = tally.flagged === 0;
    const statusText = isOk ? '100% Operational' : 'Degraded';
    const StatusIcon = isOk ? CheckCircleIcon : WarningIcon;
    const statusColor = isOk ? 'text-green-400' : 'text-yellow-400';

    return (
        <div className="w-full flex flex-col bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 transition-all duration-300">
            {!isCollapsed && (
                <>
                    <h2 className="text-xl font-bold text-white mb-3 flex-shrink-0">Generator Audit</h2>
                    
                    {/* Status Card Summary */}
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 mb-4 flex-shrink-0">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">System Status:</span>
                            <span className={`font-mono font-semibold flex items-center gap-2 ${statusColor}`}>
                                <StatusIcon className="w-5 h-5" /> {statusText}
                            </span>
                        </div>
                         <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                            <span>SSIM Trace:</span>
                            <span>Pass</span>
                        </div>
                    </div>
                    
                    <div className="flex-grow overflow-hidden">
                        <ModuleLedger modules={modules} />
                    </div>
                </>
            )}
            
            <div className={`flex-shrink-0 ${!isCollapsed ? 'mt-4' : ''}`}>
                <SystemTallyBar tally={tally} geminiModules={geminiModules} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
            </div>
        </div>
    );
};

export default GeneratorAuditDisplay;