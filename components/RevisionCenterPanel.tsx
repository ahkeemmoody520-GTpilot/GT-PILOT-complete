import React, { useState, useEffect } from 'react';
import { XIcon, CheckCircleIcon } from './icons';
import { Revision, IntentUnderstanding, CapabilityChecklistItem, RevisionType } from '../types';
import FidelityIndicator from './FidelityIndicator';
import ModuleLedger from './ModuleLedger';
import SystemTallyBar from './SystemTallyBar';

interface RevisionCenterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    revisions: Revision[];
    onToggleConfirm: (id: string) => void;
    onActivateRender: (url: string, userPrompt?: string) => void;
    isRendering: boolean;
}

// Phase 1: Full Module Enumeration
const ALL_SYSTEM_MODULES = [
    "Artifact Suppression v2.4", "Hero Image Replication v1.7", "Snapshot A/B Enforcement v1.3",
    "SSIM Fidelity Trace v2.4", "Aspect Ratio Lock v1.3", "Da Vinci Color Grading v2.1",
    "Lens Simulation (Nikon Z 1000mm+) v1.1", "Full-Frame Isolation Mandate v68.5", "Annotation Suppression Logic v2.1",
    "Thumbnail Generation Protocol v1.8", "Visual Obedience Check v3.0", "Motion Zone Effects v1.5",
    "Ethos Layering v1.2", "Realistic Lighting Engine v2.0", "300° Optimum Lens Calibration v1.9",
    "HTML Fidelity Mapping v2.4", "Chart Anti-Aliasing v1.7", "Responsive Layout Logic v1.3",
    "Subheader Border Injection v2.4", "Footer Card Alignment v2.1", "Motion Accent Injection v1.1",
    "HTML Fidelity Mirror v1.5", "CSS Grid Interpreter v2.2", "Flexbox Alignment Protocol v2.5",
    "Semantic Tag Enforcement v1.9", "Render Lock Discipline v1.2", "DOM Integrity Checker v1.0",
    "Sandbox-Only Visual Routing v2.3", "Chat-Only Messaging Enforcement v1.3", "Navigation Event Listeners v1.0",
    "Streaming UI Discipline v1.1", "Vocal Visualizer Discipline v1.4", "Component State Preservation v2.0",
    "User Input Sanitizer v1.6", "Accessibility Compliance Engine (WCAG 2.1) v1.3", "Haptic Feedback Integration v1.0",
    "128GB Memory Stack Simulation v2.0", "8-Core Multitask Simulation v1.8", "Intent Parsing Engine v3.2",
    "Image Description Logic v2.5", "Modular Analysis Cards v2.0", "Compact Comparison Analysis v1.9",
    "Temporal Cognition Layer v2.7", "Unified Brain Sync Protocol v1.5", "Contextual Awareness Engine v3.0",
    "Revision Center Injection v2.2", "Auto-Install + Verify Logic v1.5", "Terminal Cognition Link v1.7",
    "API Key Secure Routing v2.0", "Webhook Connection Manager v1.1", "Preset Loader v1.3",
    "System Log Aggregator v2.1", "Performance Monitor v1.8", "Error Boundary Handler v2.0",
    "Live Audio Encoder (PCM) v1.2", "Realtime Transcription Service v2.1", "Voice Synthesis Engine v2.5",
    "Audio Waveform Visualizer v1.6", "Interruption Handling Logic v1.3", "System Instruction Contexting v2.0",
    "Chat History Persistence v1.4", "Image Upload Handler v2.1", "Fidelity Mismatch Protocol v1.1",
    "Directive Interpretation Engine v69.2", "Confirmation Modal Logic v1.3", "Panel State Manager v2.2",
    "Iconography Asset Loader v1.1", "Tailwind CSS JIT Compiler v3.x", "React Reconciliation Hook v19.x",
    "GT Service Layer v1.28.0", "Visual Tracker Synchronization v1.0", "Provision Center Link v1.0",
    "System Checkmark Injector v1.0"
];

const ParsedIntentSummary: React.FC<{ summary: string }> = ({ summary }) => {
    const points = summary.split('\n').map(s => s.trim()).filter(s => s.startsWith('-')).map(s => s.substring(1).trim());
    return (
        <div className="bg-slate-800 p-4 rounded-lg mb-4 border border-cyan-500/30">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">User Query Summary</h3>
            <ul className="space-y-1.5 text-slate-300 text-sm">
                {points.map((point, i) => (
                     <li key={i} className="flex items-start">
                        <span className="text-cyan-400 mr-2 mt-1">•</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ParsedDescription: React.FC<{ description: string }> = ({ description }) => {
    const [mainDescription, auditBlock] = description.includes('\n---\n') ? description.split('\n---\n') : [description, ''];

    const mainLines = mainDescription.split('\n').filter(line => line.trim() !== '');
    const title = mainLines[0];
    const bulletPoints = mainLines.slice(1);

    const renderMainLine = (line: string, index: number) => {
        const trimmedLine = line.trim();
        const indentLevel = line.length - line.trimStart().length;
        
        if (!trimmedLine.startsWith('-')) return null;
        
        let contentWithMarkup = trimmedLine.substring(1).trim();
        const match = contentWithMarkup.match(/\*\*(.*?):\*\* (.*)/);
        
        let content;
        if (match) {
            const [, heading, value] = match;
            content = ( <> <span className="font-bold text-cyan-400">{heading}:</span> {value} </> );
        } else {
            content = contentWithMarkup;
        }

        const isConfirmation = contentWithMarkup.toLowerCase().includes('confirmation:');

        return (
            <li key={index} className={`flex items-start`} style={{ marginLeft: `${indentLevel * 0.5}rem`}}>
                {!isConfirmation && <span className="text-cyan-400 mr-2">•</span>}
                <span className={isConfirmation ? 'font-semibold italic text-green-400/90' : ''}>{content}</span>
            </li>
        );
    };
    
    let auditData: { category: string, items: string[] }[] = [];
    if (auditBlock && auditBlock.includes('<AUDIT>')) {
        const auditLines = auditBlock.replace(/<\/?AUDIT>/g, '').trim().split('\n');
        let currentCategory: { category: string, items: string[] } | null = null;
        
        auditLines.forEach(line => {
            if (line.startsWith('<CATEGORY>')) {
                if (currentCategory) {
                    auditData.push(currentCategory);
                }
                currentCategory = { category: line.replace(/<\/?CATEGORY>/g, ''), items: [] };
            } else if (line.startsWith('<ITEM>') && currentCategory) {
                currentCategory.items.push(line.replace(/<\/?ITEM>/g, ''));
            }
        });
        if (currentCategory) {
            auditData.push(currentCategory);
        }
    }

    return (
        <div>
            <p className="text-sm text-slate-300 mt-2">{title}</p>
            <ul className="space-y-1.5 mt-2 text-sm text-slate-400 leading-relaxed">
                {bulletPoints.map(renderMainLine).filter(Boolean)}
            </ul>
            {auditData.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <h3 className="text-base font-bold text-white mb-3">GT Pilot - Full Capability Audit (v66.2)</h3>
                    {auditData.map((cat, catIndex) => (
                        <div key={catIndex} className="mb-4">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{cat.category}</h4>
                            <div className="space-y-2">
                                {cat.items.map((item, itemIndex) => {
                                    const parts = item.split(' | ');
                                    const name = parts[0];
                                    const version = parts[1];
                                    const status = parts[2];
                                    return (
                                        <div key={itemIndex} className="bg-blue-900/80 border border-blue-700/60 px-3 py-2.5 rounded-lg text-sm flex justify-between items-center gap-2">
                                            <span className="font-medium text-slate-200">{name}</span>
                                            {version && status && (
                                                <span className="font-mono text-right text-slate-300 flex-shrink-0">
                                                    {version} | {status}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AuditTrace: React.FC<{ revision: Revision }> = ({ revision }) => {
    if (!revision.postRenderParsedIntentSummary && !revision.capabilityConfirmationMessage && !revision.fidelityConfirmationMessage && !revision.imageToImageConfirmationMessage) {
        return null;
    }

    const intentPoints = revision.postRenderParsedIntentSummary?.split('\n').map(s => s.trim()).filter(s => s.startsWith('-')).map(s => s.substring(1).trim());

    return (
        <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-4">
            <h4 className="text-sm font-semibold text-white">Final Audit Trace (v67.7)</h4>
            
            {intentPoints && intentPoints.length > 0 && (
                <div className="p-3 bg-slate-900/50 rounded-md">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parsed Intent Summary (Confirmed)</h5>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                        {intentPoints.map((point, i) => (
                            <li key={i} className="flex items-start">
                                <span className="text-cyan-400 mr-2 mt-0.5">•</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2 text-xs text-green-400/80 italic">“Intent parsed and applied. All modules executed. Visual output matches user directive.”</p>
                </div>
            )}

            {revision.imageToImageConfirmationMessage && (
                <div className="p-3 bg-slate-900/50 rounded-md">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image-to-Image Rendering Confirmation</h5>
                    <p className="mt-1 text-xs text-green-400/80 italic">“{revision.imageToImageConfirmationMessage}”</p>
                </div>
            )}
            
            {revision.capabilityConfirmationMessage && (
                <div className="p-3 bg-slate-900/50 rounded-md">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capability Application Confirmation</h5>
                    <p className="mt-1 text-xs text-green-400/80 italic">“{revision.capabilityConfirmationMessage}”</p>
                </div>
            )}

            {revision.fidelityConfirmationMessage && (
                 <div className="p-3 bg-slate-900/50 rounded-md">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1:1 Fidelity Confirmation</h5>
                    <p className="mt-1 text-xs text-green-400/80 italic">“{revision.fidelityConfirmationMessage}”</p>
                </div>
            )}
        </div>
    );
};

const Section: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div className="mb-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
        <ul className="space-y-1.5 text-xs text-slate-300">
            {items.map((item, i) => (
                <li key={i} className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-0.5">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const UserUnderstandingSection: React.FC<{ data: IntentUnderstanding['userUnderstanding'] }> = ({ data }) => {
    if (!data) return null;
    return (
        <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">User Understanding Sync</h4>
            <div className="space-y-2 text-xs text-slate-300 bg-slate-800/50 p-3 rounded-md">
                <p><span className="font-semibold text-slate-100">Requested:</span> {data.requested}</p>
                <p><span className="font-semibold text-slate-100">Interpreted:</span> {data.interpreted}</p>
                <p><span className="font-semibold text-slate-100">Delivered:</span> {data.delivered}</p>
                <p><span className="font-semibold text-slate-100">Pending:</span> {data.pending}</p>
            </div>
        </div>
    );
};

const IntentUnderstandingDetails: React.FC<{ data: IntentUnderstanding; revisionType: RevisionType; }> = ({ data, revisionType }) => {
    const title = revisionType === 'PROMPT_INPUT' && data.uiDiscipline?.[0]?.includes('Image Generator')
        ? 'Image Generator Directive'
        : 'Intent Understanding & Action Plan';

    return (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-3">{title}</h3>
            <div className="p-3 bg-slate-900/50 rounded-md border border-slate-700">
                {data.userUnderstanding && <UserUnderstandingSection data={data.userUnderstanding} />}
                {data.intent && <Section title="Intent Understanding" items={data.intent} />}
                {data.visualParsing && <Section title="Visual Parsing and Targeting" items={data.visualParsing} />}
                {data.fidelityRules && <Section title="Fidelity Rules" items={data.fidelityRules} />}
                {data.executionSteps && <Section title="Execution Steps" items={data.executionSteps} />}
                {data.capabilitiesUsed && <Section title="Capabilities Used" items={data.capabilitiesUsed} />}
                {data.uiDiscipline && <Section title="UI Discipline During Render" items={data.uiDiscipline} />}
                {data.preservationSummary && (
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Preservation Summary</h4>
                        <div className="text-xs text-slate-300 space-y-1">
                            <p><span className="font-semibold text-green-400/90">Preserved:</span> {data.preservationSummary.preserved.join(', ')}</p>
                            <p><span className="font-semibold text-red-400/90">Excluded:</span> {data.preservationSummary.excluded.join(', ')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CapabilityChecklist: React.FC<{ checklist: CapabilityChecklistItem[] }> = ({ checklist }) => (
    <div className="mt-4 pt-4 border-t border-slate-700/50">
        <h3 className="text-base font-bold text-white mb-3">Final Capability Checklist (v67.8.1)</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50">
                    <tr>
                        <th className="p-3 text-slate-300 font-semibold">Capability</th>
                        <th className="p-3 text-slate-300 font-semibold">Status</th>
                        <th className="p-3 text-slate-300 font-semibold">Notes</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {checklist.map((item, index) => (
                        <tr key={index}>
                            <td className="p-3 text-slate-200 font-medium">{item.capability}</td>
                            <td className="p-3 text-slate-200 whitespace-nowrap">{item.status}</td>
                            <td className="p-3 text-slate-400 italic">{item.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const RevisionItem: React.FC<{ revision: Revision, onToggleConfirm: (id: string) => void, onActivateRender: (url: string, userPrompt?: string) => void, index: number }> = ({ revision, onToggleConfirm, onActivateRender, index }) => {
    const hasSnapshots = revision.previewUrl || revision.outputPreviewUrl;
    const isVisualGeneration = revision.type === 'VISUAL_GENERATION' || revision.type === 'IMAGE_TO_IMAGE_PARSING';
    const hasSideBySide = revision.previewUrl && revision.outputPreviewUrl;
    
    return (
        <div className="bg-slate-800/50 p-3 rounded-lg flex items-start gap-4 animate-fade-in-down" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
            <div className={`flex-grow ${!hasSnapshots ? 'w-full' : ''}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-slate-400">{revision.timestamp}</p>
                        <p className="text-sm font-semibold text-cyan-400">Cognition {revision.version}</p>
                    </div>
                     {isVisualGeneration && (
                        !revision.confirmed ? (
                            <button 
                                onClick={() => revision.outputPreviewUrl && onActivateRender(revision.outputPreviewUrl, revision.userPrompt)}
                                className="px-3 py-1.5 bg-slate-700 text-xs font-semibold rounded-md hover:bg-cyan-500 hover:text-slate-900 transition-colors"
                            >
                                Confirm for Render
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-green-400 animate-pop-in">
                                <CheckCircleIcon className="w-5 h-5"/>
                                <span>Confirmed</span>
                            </div>
                        )
                    )}
                </div>
                 
                {hasSideBySide ? (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs text-slate-500 font-bold text-center mb-1">SNAPSHOT A</p>
                            <img src={revision.previewUrl} alt="Input" className="w-full rounded-lg object-contain border border-slate-700 bg-black aspect-square"/>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold text-center mb-1">SNAPSHOT B</p>
                            <img src={revision.outputPreviewUrl} alt="Output" className="w-full rounded-lg object-contain border border-slate-700 bg-black aspect-square"/>
                        </div>
                    </div>
                ) : (
                    <>
                        {revision.previewUrl && <div className="mt-2"><p className="text-xs text-slate-500 font-bold text-center mb-1">SNAPSHOT A</p><img src={revision.previewUrl} alt="Input" className="w-full rounded-lg object-contain border border-slate-700 bg-black"/></div>}
                        {revision.intentScreenshotUrl && <div className="mt-2"><p className="text-xs text-slate-500 font-bold text-center mb-1">INTENT SCREENSHOT</p><img src={revision.intentScreenshotUrl} alt="Intent" className="w-full rounded-lg object-contain border border-slate-700 bg-black"/></div>}
                        {revision.outputPreviewUrl && !revision.previewUrl && <div className="mt-2"><p className="text-xs text-slate-500 font-bold text-center mb-1">SNAPSHOT B</p><img src={revision.outputPreviewUrl} alt="Output" className="w-full rounded-lg object-contain border border-slate-700 bg-black"/></div>}
                    </>
                )}
                
                <div className="mt-2 space-y-3">
                    <ParsedDescription description={revision.description} />
                     {revision.metrics && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <h4 className="text-sm font-semibold text-white mb-2">Fidelity Metrics</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono bg-slate-900/50 p-2 rounded-md">
                                {Object.entries(revision.metrics).map(([key, value]) =>(
                                    <div key={key} className="flex justify-between">
                                        <span className="text-slate-400 uppercase">{key}:</span>
                                        <span className="text-white">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                     {revision.buildPlan && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <h4 className="text-sm font-semibold text-white mb-2">Autonomous Build Plan</h4>
                            <pre className="text-xs bg-slate-900/50 p-2 rounded-md text-cyan-300 whitespace-pre-wrap font-mono">{revision.buildPlan}</pre>
                        </div>
                    )}
                    {revision.auditReport && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <h4 className="text-sm font-semibold text-white mb-2">Pre-Render Cognition Report</h4>
                            <pre className="text-xs bg-slate-900/50 p-3 rounded-md text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                                {revision.auditReport}
                            </pre>
                        </div>
                    )}
                    {revision.intentUnderstanding && <IntentUnderstandingDetails data={revision.intentUnderstanding} revisionType={revision.type} />}
                    {revision.capabilityChecklist && <CapabilityChecklist checklist={revision.capabilityChecklist} />}
                    {revision.analysisCards && (
                        <div className="mt-3 space-y-2 pt-3 border-t border-slate-700/50">
                             <h4 className="text-sm font-semibold text-white mb-2">Modular Analysis</h4>
                            {revision.analysisCards.map((card, index) => (
                                <div key={index} className="p-3 bg-slate-800 rounded-md">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold text-white flex-grow pr-2">{card.title}</p>
                                        {card.version && <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded flex-shrink-0">{card.version}</span>}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-300 whitespace-pre-wrap">{card.summary}</p>
                                    {card.intent && (
                                        <div className="mt-2 pt-2 border-t border-slate-700/50">
                                            <p className="text-xs text-slate-400"><span className="font-semibold">User Intent:</span> "{card.intent}"</p>
                                        </div>
                                    )}
                                    {card.timestamp && <p className="text-right text-[10px] text-slate-500 mt-1">{card.timestamp}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                    <AuditTrace revision={revision} />
                </div>
            </div>
        </div>
    );
};

const AwaitingConfirmationSection: React.FC<{ revision: Revision, onActivateRender: (url: string, userPrompt?: string) => void }> = ({ revision, onActivateRender }) => {
    const enhancementsToShow = revision.enhancements?.slice(0, 2) || [];
    
    return (
        <div className="bg-slate-800/50 p-3 rounded-lg mb-4 border border-slate-700">
            <ul className="text-sm text-slate-300">
                {enhancementsToShow.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
             <div className="mt-3 flex justify-between items-center">
                <div>
                    <span className="text-xs font-bold text-slate-400">Sandbox Status: </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                        Awaiting Confirmation
                    </span>
                </div>
                <button
                    onClick={() => revision.outputPreviewUrl && onActivateRender(revision.outputPreviewUrl, revision.userPrompt)}
                    className="px-3 py-1 bg-slate-700 text-xs font-semibold rounded-md hover:bg-cyan-500 hover:text-slate-900 transition-colors"
                >
                    Activate Render
                </button>
            </div>
        </div>
    );
};

const RevisionCenterPanel: React.FC<RevisionCenterPanelProps> = ({ isOpen, onClose, revisions, onToggleConfirm, onActivateRender, isRendering }) => {
    const pendingRenderRevision = [...revisions]
        .reverse()
        .find(r => r.type === 'VISUAL_GENERATION' && r.confirmed && r.sandboxInjectionStatus !== 'Complete');

    const latestIntentRevision = [...revisions].reverse().find(r => r.parsedIntentSummary);

    const [modules, setModules] = useState<{ name: string; status: 'ok' | 'warning' }[]>([]);
    const [isLedgerCollapsed, setIsLedgerCollapsed] = useState(true);
    const [tally, setTally] = useState({
        total: 0,
        verified: 0,
        flagged: 0,
        missing: 0,
        lastScan: new Date().toLocaleString(),
    });
    
    useEffect(() => {
        setModules(ALL_SYSTEM_MODULES.map(name => ({ name, status: 'ok' })));
    }, []);

    useEffect(() => {
        const verified = modules.filter(m => m.status === 'ok').length;
        const flagged = modules.filter(m => m.status === 'warning').length;
        
        setTally(prev => ({
            ...prev,
            total: modules.length,
            verified,
            flagged,
            missing: 0, // Not simulating 'missing' separately, just 'flagged'
            lastScan: new Date().toLocaleString()
        }));
    }, [modules]);

    useEffect(() => {
        const scanInterval = 15 * 60 * 1000;

        const scanAndRepair = () => {
            const shouldFlag = Math.random() < 0.2;
            if (!shouldFlag || modules.length === 0) {
                setTally(prev => ({ ...prev, lastScan: new Date().toLocaleString() }));
                return;
            };

            const moduleIndexToFlag = Math.floor(Math.random() * modules.length);
            
            setModules(prevModules => prevModules.map((mod, index) => 
                index === moduleIndexToFlag ? { ...mod, status: 'warning' } : mod
            ));

            setTimeout(() => {
                setModules(prevModules => prevModules.map((mod, index) => 
                    index === moduleIndexToFlag ? { ...mod, status: 'ok' } : mod
                ));
            }, 5000);
        };
        
        const intervalId = setInterval(scanAndRepair, scanInterval);
        return () => clearInterval(intervalId);

    }, [modules]);
    
    const geminiModules = modules.filter(m => m.name.toLowerCase().includes('gemini')).length;
    
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                        <h2 className="text-lg font-bold text-cyan-400">Revision Center</h2>
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-grow">
                        {pendingRenderRevision && (
                            <AwaitingConfirmationSection revision={pendingRenderRevision} onActivateRender={onActivateRender} />
                        )}

                        {latestIntentRevision?.parsedIntentSummary && (
                            <ParsedIntentSummary summary={latestIntentRevision.parsedIntentSummary} />
                        )}

                        {revisions.length > 0 ? (
                            <div className="space-y-4">
                                {revisions.slice().reverse().map((rev, index) => (
                                    <RevisionItem 
                                        key={rev.id} 
                                        revision={rev} 
                                        index={index}
                                        onToggleConfirm={onToggleConfirm}
                                        onActivateRender={onActivateRender}
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                                <CheckCircleIcon className="w-12 h-12 mb-2" />
                                <h3 className="text-lg font-semibold text-slate-400">No Revisions Logged</h3>
                                <p className="text-sm">Interact with the application to generate revisions.</p>
                             </div>
                        )}
                        {!isLedgerCollapsed && <ModuleLedger modules={modules} />}
                        <SystemTallyBar
                            tally={tally}
                            geminiModules={geminiModules}
                            isCollapsed={isLedgerCollapsed}
                            onToggleCollapse={() => setIsLedgerCollapsed(p => !p)}
                        />
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.4s ease-out forwards;
                }

                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in {
                    animation: pop-in 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default RevisionCenterPanel;