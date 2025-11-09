import React from 'react';

interface FidelityIndicatorProps {
  snapshotAUrl: string;
  snapshotBUrl: string;
  summaryText?: string;
}

const FidelityIndicator: React.FC<FidelityIndicatorProps> = ({ snapshotAUrl, snapshotBUrl, summaryText }) => (
    <div className="mt-3 pt-3 border-t border-slate-700/50">
        <h4 className="text-sm font-semibold text-white mb-2">{summaryText || "Fidelity Trace"}</h4>
        <div className="flex items-center justify-around gap-2 p-2 bg-slate-900/50 rounded-lg">
            <div className="text-center">
                <img src={snapshotAUrl} alt="Snapshot A" className="w-16 h-16 rounded-md object-contain border border-slate-600 bg-black" />
                <p className="text-xs font-mono text-slate-500 mt-1">Snapshot A</p>
            </div>
            <div className="text-cyan-400 font-bold text-2xl flex-shrink-0 mx-2">→</div>
            <div className="text-center">
                <img src={snapshotBUrl} alt="Snapshot B" className="w-16 h-16 rounded-md object-contain border border-slate-600 bg-black" />
                <p className="text-xs font-mono text-slate-500 mt-1">Snapshot B</p>
            </div>
        </div>
         <p className="text-center text-xs text-green-400/80 italic mt-2">"Core Fidelity Lock Active"</p>
    </div>
);

export default FidelityIndicator;
