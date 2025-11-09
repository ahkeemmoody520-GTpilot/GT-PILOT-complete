import React from 'react';
import { XIcon } from './icons';
import { Revision } from '../types';

interface VisualTrackerPanelProps {
    isOpen: boolean;
    onClose: () => void;
    revisions: Revision[];
}

const RevisionItem: React.FC<{ revision: Revision }> = ({ revision }) => {
    const hasSnapshots = revision.previewUrl || revision.outputPreviewUrl;

    const renderDescription = (desc: string) => {
        const lines = desc.split('\n');
        
        const confirmationLine = lines.find(line => line.toLowerCase().includes('1:1 image-to-image confirmation'));
        const mainPoints = lines.filter(line => !line.toLowerCase().includes('1:1 image-to-image confirmation'));

        return (
            <div>
                 <p className="text-sm text-slate-100 font-semibold">{mainPoints[0]}</p>
                 <ul className="mt-2 space-y-1.5 text-sm text-slate-300 leading-relaxed">
                    {mainPoints.slice(1).map((line, index) => {
                         const trimmedLine = line.trim();
                         if (!trimmedLine.startsWith('-')) return null;
                         return <li key={index}>{trimmedLine.substring(1).trim()}</li>
                    })}
                </ul>
                {confirmationLine && (
                    <p className="mt-3 pt-3 border-t border-slate-700/50 font-semibold italic text-green-400/90 text-sm">
                        {confirmationLine}
                    </p>
                )}
            </div>
        );
    };

    const hasSideBySide = revision.previewUrl && (revision.outputPreviewUrl || revision.intentScreenshotUrl);
    const secondImageUrl = revision.outputPreviewUrl || revision.intentScreenshotUrl;
    const secondImageLabel = revision.outputPreviewUrl ? "Snapshot B" : "Intent Screenshot";


    return (
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">{revision.timestamp}</p>
            {hasSnapshots && (
                <div className={`grid ${hasSideBySide ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-3`}>
                    {revision.previewUrl && (
                        <div className="text-center">
                            <img src={revision.previewUrl} alt="Snapshot A" className="w-full aspect-square rounded-md object-contain border border-slate-700 bg-black" />
                            <p className="text-xs font-mono text-slate-500 mt-1">Snapshot A</p>
                        </div>
                    )}
                    {secondImageUrl && (
                        <div className="text-center">
                            <img src={secondImageUrl} alt={secondImageLabel} className="w-full aspect-square rounded-md object-contain border border-slate-700 bg-black" />
                            <p className="text-xs font-mono text-slate-500 mt-1">{secondImageLabel}</p>
                        </div>
                    )}
                </div>
            )}
            {renderDescription(revision.description)}
        </div>
    );
};

const VisualTrackerPanel: React.FC<VisualTrackerPanelProps> = ({ isOpen, onClose, revisions }) => {
    const visualRevisions = revisions
        .filter(r => ['FIDELITY_AUDIT', 'VISUAL_ANCHOR_LOCKED', 'IMAGE_TO_IMAGE_PARSING'].includes(r.type))
        .slice()
        .reverse();

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                        <h2 className="text-lg font-bold text-cyan-400">Visual Asset Tracker (Reskamp)</h2>
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-grow">
                        {visualRevisions.length > 0 ? (
                            <div className="space-y-4">
                                {visualRevisions.map(rev => (
                                    <RevisionItem key={rev.id} revision={rev} />
                                ))}
                            </div>
                        ) : (
                             <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                                <XIcon className="w-12 h-12 mb-2" />
                                <h3 className="text-lg font-semibold text-slate-400">No Uploads Tracked</h3>
                                <p className="text-sm">Upload an image in the chat to begin tracking visual assets.</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VisualTrackerPanel;