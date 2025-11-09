import React, { useState } from 'react';
import { XIcon, KeyIcon, PlusIcon, TrashIcon, CheckCircleIcon } from './icons';

interface ConnectionsPresetsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const presets = [
    { id: 1, name: 'Cyberpunk Cityscape', description: 'Neon-drenched streets and towering skyscrapers.', imageUrl: 'https://images.pexels.com/photos/2129796/pexels-photo-2129796.jpeg?auto=compress&cs=tinysrgb&w=160&h=90&dpr=1' },
    { id: 2, name: 'Enchanted Forest', description: 'Mystical woods with glowing flora and creatures.', imageUrl: 'https://images.pexels.com/photos/3782786/pexels-photo-3782786.jpeg?auto=compress&cs=tinysrgb&w=160&h=90&dpr=1' },
    { id: 3, name: 'Steampunk Workshop', description: 'A space filled with gears, gadgets, and brass contraptions.', imageUrl: 'https://images.pexels.com/photos/833045/pexels-photo-833045.jpeg?auto=compress&cs=tinysrgb&w=160&h=90&dpr=1' },
    { id: 4, name: 'Cosmic Nebula', description: 'Vibrant clouds of gas and dust in the vastness of space.', imageUrl: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=160&h=90&dpr=1' },
    { id: 5, name: 'Ancient Ruins', description: 'Crumbling temples overgrown with jungle vines.', imageUrl: 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=160&h=90&dpr=1' },
];

const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-cyan-500' : 'bg-slate-600'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


const ConnectionsPresetsPanel: React.FC<ConnectionsPresetsPanelProps> = ({ isOpen, onClose }) => {
    return (
        <div className={`fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`} style={{ height: '70vh' }}>
                <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-lg font-bold text-cyan-400">Connections & Presets</h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    {/* API Keys */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">API Key Management</h3>
                        <div className="mt-3 space-y-2">
                             <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <KeyIcon className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <p className="text-slate-200 font-medium">Main Project Key</p>
                                        <p className="font-mono text-xs text-slate-400">sk-....a1b2</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-2 text-sm text-green-400"><CheckCircleIcon className="w-5 h-5"/> Active</span>
                                    <button className="text-xs text-slate-400 hover:text-white">Edit</button>
                                    <button className="text-slate-400 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600 text-slate-300">
                                <PlusIcon className="w-5 h-5" /> Add New Key
                            </button>
                        </div>
                    </div>

                    {/* Webhooks */}
                     <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Webhook Connections</h3>
                         <div className="mt-3 bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">No active webhooks. Add an endpoint to receive events.</p>
                             <div className="flex gap-2 mt-3">
                                 <input type="text" placeholder="https://api.your-domain.com/webhook" className="flex-grow bg-slate-700 border border-slate-600 rounded-md py-1.5 px-3 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none" />
                                 <button className="px-3 py-1.5 bg-cyan-500 text-slate-900 text-sm font-semibold rounded-md hover:bg-cyan-400 transition-colors">Add</button>
                             </div>
                        </div>
                    </div>

                    {/* Presets */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Preset Options</h3>
                        <div className="flex overflow-x-auto space-x-4 pb-3 -ml-2 pl-2">
                            {presets.map(preset => (
                                <div key={preset.id} className="w-52 flex-shrink-0 bg-slate-800/50 rounded-lg overflow-hidden group">
                                    <img src={preset.imageUrl} alt={preset.name} className="w-full h-24 object-cover" />
                                    <div className="p-3">
                                        <h4 className="font-semibold text-slate-200 truncate">{preset.name}</h4>
                                        <p className="text-xs text-slate-400 h-8">{preset.description}</p>
                                        <button className="w-full mt-2 text-sm py-1.5 bg-slate-700 hover:bg-cyan-500 hover:text-slate-900 rounded-md transition-colors font-semibold">Load</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                     <div className="pt-4 border-t border-slate-800">
                        <p className="text-xs text-slate-500 text-center">
                            Terminal panel was previously embedded here. You’re now viewing API keys and presets only.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ConnectionsPresetsPanel;
