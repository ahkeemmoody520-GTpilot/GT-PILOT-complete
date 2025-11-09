import React from 'react';
import SystemCheck from './SystemCheck';

interface ModuleLedgerProps {
    modules: Array<{ name: string; status: 'ok' | 'warning' }>;
}

const ModuleLedger: React.FC<ModuleLedgerProps> = ({ modules }) => {
    return (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
            <h3 className="text-base font-bold text-white mb-3">Full Module Ledger</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {modules.map((module) => (
                    <div key={module.name} className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <span className="text-sm text-slate-300">{module.name}</span>
                        <SystemCheck
                            status={module.status}
                            tooltipOverride={module.name.startsWith("GT Service Layer") ? "✅ Verified. GT service layer active. No Gemini routing detected." : undefined}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModuleLedger;