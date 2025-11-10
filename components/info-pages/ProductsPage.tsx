import React from 'react';
import { PhotoIcon } from '../icons';

const ProductCard: React.FC<{ title: string; category: string }> = ({ title, category }) => (
    <div className="flex-shrink-0 w-64 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center group transition-all duration-300 hover:border-cyan-400/50 hover:scale-105">
        <div className="w-full h-32 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
            <PhotoIcon className="w-12 h-12 text-slate-500" />
        </div>
        <h4 className="font-bold text-white truncate">{title}</h4>
        <p className="text-xs text-cyan-400 mb-2">{category}</p>
        <p className="text-sm text-slate-400">Optimized for sandbox fidelity</p>
    </div>
);

const ProductsPage: React.FC = () => {
    return (
        <div className="p-4 md:p-8 text-white animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        🔥 Explore GT Pilot Presets
                    </h1>
                    <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
                        Browse enhancement-ready modules, HTML presets, and application templates.
                    </p>
                </header>

                <div className="w-full h-px bg-cyan-400/30 my-12 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_theme(colors.cyan.400)]"></div>
                </div>

                <section>
                    <div className="flex space-x-6 overflow-x-auto p-4 scrollbar-hide whitespace-nowrap">
                        <ProductCard title="Landing Page Template" category="HTML Presets" />
                        <ProductCard title="Dashboard UI Kit" category="HTML Presets" />
                        <ProductCard title="Voice Interaction Module" category="Application Modules" />
                        <ProductCard title="Image Analysis Service" category="Application Modules" />
                        <ProductCard title="Cinematic Lens Stack" category="Enhancement Packs" />
                        <ProductCard title="Neon Glow Effects" category="Enhancement Packs" />
                        <ProductCard title="Data Visualization Pack" category="Enhancement Packs" />
                    </div>
                </section>
                 <div className="w-full h-px bg-cyan-400/30 my-12"></div>
                 <div className="text-center text-slate-400 p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
                     <h3 className="text-2xl font-bold text-white mb-4">Message Box Placeholder</h3>
                     <p>Further details and interactive demos will be available here.</p>
                 </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ProductsPage;