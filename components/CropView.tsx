import React, { useState, useEffect } from 'react';
import { XIcon, CropIcon, BrainIcon, RefreshIcon, CheckCircleIcon } from './icons';
import { cropImageWithGT } from '../services/gt-services';

interface CropViewProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmCrop: (croppedImageUrl: string) => void;
    imageUrl: string | null;
}

const Loader: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
        <div className="w-8 h-8 border-4 border-t-cyan-400 border-slate-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-white">{text}</p>
    </div>
);

const CropView: React.FC<CropViewProps> = ({ isOpen, onClose, onConfirmCrop, imageUrl }) => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && imageUrl) {
            setCurrentImage(imageUrl);
        } else {
            // Reset when closed
            setCurrentImage(null);
            setIsLoading(false);
        }
    }, [isOpen, imageUrl]);

    const handleAutoCrop = async () => {
        if (!imageUrl) return;
        setIsLoading(true);
        try {
            const croppedUrl = await cropImageWithGT(imageUrl);
            setCurrentImage(croppedUrl);
        } catch (error) {
            console.error("Auto-crop failed:", error);
            // Optionally show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setCurrentImage(imageUrl);
    };

    const handleConfirm = () => {
        if (currentImage) {
            onConfirmCrop(currentImage);
        }
    };

    if (!isOpen || !imageUrl) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-5xl h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-2 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Crop & Refine Visual</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Image Display */}
                <div className="flex-grow w-full flex items-center justify-center min-h-0 relative">
                    {isLoading && <Loader text="GT is performing an intelligent crop..." />}
                    {currentImage && (
                        <div className="w-full aspect-video bg-black rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700">
                             <img src={currentImage} alt="Crop preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                {/* Separator */}
                <div className="w-full my-4 h-px bg-slate-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-line-scan"></div>
                </div>

                {/* Menu */}
                <div className="flex-shrink-0 w-full flex items-center justify-center gap-4 pb-4">
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" disabled>
                        <CropIcon className="w-6 h-6" />
                        <span className="text-xs">Manual Crop</span>
                        <span className="text-[10px] text-slate-500">(Coming Soon)</span>
                    </button>
                    <button onClick={handleAutoCrop} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50">
                        <BrainIcon className="w-6 h-6" />
                        <span className="text-xs">Auto-Intelligent Crop</span>
                    </button>
                    <button onClick={handleReset} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50">
                        <RefreshIcon className="w-6 h-6" />
                        <span className="text-xs">Reset to Original</span>
                    </button>
                    <div className="w-px h-12 bg-slate-700 mx-4"></div>
                    <button onClick={onClose} className="px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5"/>
                        Confirm Crop
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

                @keyframes line-scan {
                    0% { transform: translateX(-100%); opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0.5; }
                }
                .animate-line-scan {
                    animation: line-scan 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default CropView;
