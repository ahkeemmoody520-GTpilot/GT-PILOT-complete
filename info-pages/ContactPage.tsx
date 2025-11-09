import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="p-4 md:p-8 text-white animate-fade-in">
            <div className="max-w-6xl mx-auto text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/30 opacity-50 blur-3xl"></div>
                <header className="relative mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        📬 Reach GT Pilot
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">
                        For inquiries, enhancements, or sandbox access, contact us at: <a href="mailto:gtpilotcontact7@placeholder.ai" className="text-cyan-400 hover:underline">gtpilotcontact7@placeholder.ai</a>
                    </p>
                </header>

                <section className="relative w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-slate-800/70 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                        />
                        <textarea
                            placeholder="Message"
                            rows={8}
                            className="w-full bg-slate-800/70 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10"
                        >
                            Submit
                        </button>
                    </div>
                </section>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ContactPage;