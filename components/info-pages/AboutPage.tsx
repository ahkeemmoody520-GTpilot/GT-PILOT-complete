import React from 'react';
import { PhotoIcon } from '../icons';

const AboutPage: React.FC = () => {
    return (
        <div className="p-4 md:p-8 text-white animate-fade-in">
            <div className="max-w-6xl mx-auto text-center">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        👋 Welcome to GT Pilot
                    </h1>
                    <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
                        This system was built to adapt, evolve, and execute with precision. GT’s cognition stack includes layout parsing, lens simulation, and sandbox rendering.
                    </p>
                </header>
                
                <section className="mb-12">
                    <div className="relative inline-block">
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative w-full max-w-2xl aspect-video bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center p-4">
                            <PhotoIcon className="w-24 h-24 text-slate-600" />
                            <span className="text-slate-600 font-semibold">Hero Image Placeholder</span>
                        </div>
                    </div>
                </section>
                
                <div className="w-full h-px bg-cyan-400/30 my-12 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_theme(colors.cyan.400)]"></div>
                </div>

                <footer className="text-sm text-slate-500 font-mono">
                    Version v65.2 | Sandbox-Driven | Gemini Enhanced
                </footer>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AboutPage;