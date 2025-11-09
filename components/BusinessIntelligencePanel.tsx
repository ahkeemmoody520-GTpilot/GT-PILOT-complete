import React from 'react';

const ProgressBar: React.FC<{ progress: number, label: string }> = ({ progress, label }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-300">{label}</span>
            <span className="text-xs font-mono text-cyan-400">{progress}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);

const BusinessIntelligencePanel: React.FC = () => {
    const funnelData = [
        { source: 'LinkedIn', signups: 1240, tier: 'Pro' },
        { source: 'Instagram', signups: 880, tier: 'Free' },
        { source: 'Reddit', signups: 650, tier: 'Elite' },
        { source: 'Direct', signups: 430, tier: 'Pro' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Source Intelligence */}
            <div>
                <h3 className="text-base font-semibold text-slate-300 mb-3">User Source Intelligence</h3>
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="p-3 font-medium text-slate-300">Source</th>
                                <th className="p-3 font-medium text-slate-300 text-center">Signups</th>
                                <th className="p-3 font-medium text-slate-300 text-center">Top Tier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {funnelData.map(item => (
                                <tr key={item.source}>
                                    <td className="p-3 text-white">{item.source}</td>
                                    <td className="p-3 text-slate-300 text-center font-mono">{item.signups}</td>
                                    <td className="p-3 text-slate-300 text-center"><span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/10 text-cyan-400">{item.tier}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Revenue & Upsell Tracking */}
            <div>
                 <h3 className="text-base font-semibold text-slate-300 mb-3">Revenue & Upsell Tracking</h3>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
                    <ProgressBar progress={35} label="Progress to $500K Goal" />
                    <div className="flex justify-between text-center pt-3">
                        <div>
                            <p className="text-xs text-slate-400">Current MRR</p>
                            <p className="font-bold text-lg text-white">$175,000</p>
                        </div>
                         <div>
                            <p className="text-xs text-slate-400">Avg. ARPU</p>
                            <p className="font-bold text-lg text-white">$41.50</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessIntelligencePanel;
