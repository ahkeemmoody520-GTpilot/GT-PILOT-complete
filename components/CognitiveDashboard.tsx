import React, { useState } from 'react';
import { ChevronDownIcon, BrainIcon } from './icons';
import { Revision } from '../types';

// Simplified component to display revision info
const RevisionSnapshot: React.FC<{ revision: Revision }> = ({ revision }) => {
    // A function to extract key info from description
    const getSummary = (desc: string) => {
        const lines = desc.split('\n');
        return lines[0];
    };

    return (
        <div className="p-2 bg-slate-800 rounded-md text-xs flex items-start gap-2">
            {revision.outputPreviewUrl && <img src={revision.outputPreviewUrl} alt="revision snapshot" className="w-10 h-10 object-cover rounded" />}
            <div>
                <p className="font-semibold text-white">{revision.type.replace(/_/g, ' ')} ({revision.version})</p>
                <p className="text-slate-400">{getSummary(revision.description)}</p>
                <p className="text-slate-500">{revision.timestamp}</p>
            </div>
        </div>
    );
};

interface CognitiveDashboardProps {
    revisions: Revision[];
}

const CognitiveDashboard: React.FC<CognitiveDashboardProps> = ({ revisions }) => {
    const [isOpen, setIsOpen] = useState(true);
    
    // Filter for relevant cognitive revisions
    const cognitiveRevisions = revisions.filter(r => 
        ['INTENT_PARSED', 'VISUAL_GENERATION', 'IMAGE_TO_IMAGE_PARSING', 'PRE_RENDER_AUDIT', 'FIDELITY_MISMATCH'].includes(r.type)
    ).slice(-5).reverse(); // Get latest 5

    const latestEnhancements = [...revisions].reverse().find(r => r.enhancements)?.enhancements || [];

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-800/70"
            >
                <div className="flex items-center gap-3">
                    <BrainIcon className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-lg font-bold text-white">Cognitive Analysis Panel</h2>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Real-time Cognitive Trace</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {cognitiveRevisions.length > 0 ? cognitiveRevisions.map(r => (
                                    <RevisionSnapshot key={r.id} revision={r} />
                                )) : (
                                    <p className="text-slate-500 text-sm">No cognitive actions logged yet.</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Enhancement Stack</h3>
                            <ul className="space-y-1 text-sm text-slate-300">
                                {latestEnhancements.length > 0 ? latestEnhancements.map((enh, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="text-cyan-400">✓</span>
                                        <span>{enh}</span>
                                    </li>
                                )) : (
                                    <p className="text-slate-500">No enhancements active.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                     <style>{`
                        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default CognitiveDashboard;
