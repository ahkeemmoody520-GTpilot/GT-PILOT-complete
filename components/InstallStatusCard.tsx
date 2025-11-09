import React from 'react';
import { CheckCircleIcon, WarningIcon, XIcon } from './icons';

interface InstallStatusCardProps {
    moduleCount: number;
    status: 'ok' | 'warning' | 'error';
    lastScan: string;
    auditResult: 'Pass' | 'Fail';
}

const statusMap = {
    ok: { text: '100% Installed', icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />, color: 'text-green-400' },
    warning: { text: 'Missing Modules', icon: <WarningIcon className="w-5 h-5 text-yellow-400" />, color: 'text-yellow-400' },
    error: { text: 'Critical Failure', icon: <XIcon className="w-5 h-5 text-red-500" />, color: 'text-red-500' },
};

const auditMap = {
    Pass: { text: 'Pass', icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />, color: 'text-green-400' },
    Fail: { text: 'Fail', icon: <XIcon className="w-5 h-5 text-red-500" />, color: 'text-red-500' },
};

const InstallStatusCard: React.FC<InstallStatusCardProps> = ({ moduleCount, status, lastScan, auditResult }) => {
    const currentStatus = statusMap[status];
    const currentAudit = auditMap[auditResult];

    return (
        <div className="mt-4 bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-3">Install Status</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Module Count:</span>
                    <span className="font-mono text-white">{moduleCount} Active</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Install Status:</span>
                    <span className={`font-mono font-semibold flex items-center gap-2 ${currentStatus.color}`}>
                        {currentStatus.icon} {currentStatus.text}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Audit Result:</span>
                    <span className={`font-mono font-semibold flex items-center gap-2 ${currentAudit.color}`}>
                        {currentAudit.icon} {currentAudit.text}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                    <span className="text-slate-400">Last Scan:</span>
                    <span className="font-mono text-slate-400 text-xs">{lastScan}</span>
                </div>
            </div>
        </div>
    );
};

export default InstallStatusCard;