import React from 'react';
import { XIcon } from './icons';

interface ProvisionCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <span className="text-slate-300">{label}</span>
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-cyan-500' : 'bg-slate-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const ProvisionCenter: React.FC<ProvisionCenterProps> = ({ isOpen, onClose }) => {
    const [toggles, setToggles] = React.useState({
        streaming: true,
        autosnap: false,
        revisionSync: false,
    });
    
    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({...prev, [key]: !prev[key]}));
    };
    
    const installedModules = [
        { name: 'Image Sandbox', version: 'v58.1' },
        { name: 'Streaming Sandbox', version: 'v58.1' },
        { name: 'Chat Module', version: 'v1.0' },
        { name: 'Terminal Cognition', version: 'v1.0' },
        { name: 'Provision Center', version: 'v1.0' },
    ];

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div className={`fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} style={{ maxHeight: '80vh' }}>
                 <div className="flex flex-col h-full">
                     {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                        <h2 className="text-lg font-bold text-cyan-400">Provision Center</h2>
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Installed Modules */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Installed Modules</h3>
                                <div className="space-y-3">
                                    {installedModules.map(module => (
                                        <div key={module.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                            <span className="text-slate-300">{module.name}</span>
                                            <span className="font-mono text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{module.version}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Feature Toggles */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Feature Toggles</h3>
                                <div className="space-y-4 p-3 bg-slate-800/50 rounded-lg">
                                    <ToggleSwitch label="Streaming" enabled={toggles.streaming} onToggle={() => handleToggle('streaming')} />
                                    <ToggleSwitch label="Autosnap" enabled={toggles.autosnap} onToggle={() => handleToggle('autosnap')} />
                                    <ToggleSwitch label="Revision Sync" enabled={toggles.revisionSync} onToggle={() => handleToggle('revisionSync')} />
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Upgrades</h3>
                                    <div className="p-3 bg-slate-800/50 rounded-lg text-slate-400 text-center">
                                        All modules are up to date.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProvisionCenter;
