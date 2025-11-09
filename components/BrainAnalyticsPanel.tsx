// DEPRECATED as of Directive v80.0
// This component's logic has been migrated to the new CognitiveDashboard.tsx and BusinessIntelligencePanel.tsx components.
// This file is no longer in use and is slated for removal.
import React from 'react';

const BrainAnalyticsPanel: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 p-8 rounded-lg text-white">
                This panel has been deprecated and its components moved to the main homepage.
            </div>
        </div>
    );
};

export default BrainAnalyticsPanel;
