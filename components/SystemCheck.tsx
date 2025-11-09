import React from 'react';
import { CheckCircleIcon, WarningIcon } from './icons';

interface SystemCheckProps {
    status: 'ok' | 'warning';
    tooltipOverride?: string;
}

const SystemCheck: React.FC<SystemCheckProps> = ({ status, tooltipOverride }) => {
    const isOk = status === 'ok';
    const tooltipText = tooltipOverride || (isOk ? "Verified. Module active and functioning." : "Warning. Module missing or malfunctioning.");
    const icon = isOk 
        ? <span className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}><CheckCircleIcon className="w-4 h-4" /></span> 
        : <WarningIcon className="w-4 h-4 text-yellow-400" />;
    const textColor = isOk ? 'text-cyan-400' : 'text-yellow-400';

    return (
        <div className="relative group flex items-center gap-1.5 flex-shrink-0">
            {icon}
            <span className={`text-xs font-semibold ${textColor}`}>System Check</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-900 border border-slate-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {tooltipText}
            </div>
        </div>
    );
};

export default SystemCheck;