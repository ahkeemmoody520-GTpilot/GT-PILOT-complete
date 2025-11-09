import React from 'react';
import { FolderIcon, ListBulletIcon, UploadIcon, CropIcon, PlayIcon, TerminalIcon, CheckCircleIcon } from './icons';

const InfoCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-cyan-400">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 leading-relaxed">{children}</p>
    </div>
);

const WorkflowStep: React.FC<{ icon: React.ReactNode, title: string, description: string, isLast?: boolean }> = ({ icon, title, description, isLast }) => (
    <div className="relative flex items-start gap-4">
        {!isLast && <div className="absolute left-5 top-10 w-px h-full bg-slate-700"></div>}
        <div className="relative z-10 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-cyan-400">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    </div>
);

const SolutionsPage: React.FC = () => {
    return (
        <div className="p-4 md:p-8 text-white animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">GT Pilot Solutions</h1>
                    <p className="mt-2 text-lg text-slate-400">A modular strategist for UI/UX design and execution.</p>
                    <div className="mt-6 w-24 h-0.5 bg-cyan-400 mx-auto rounded-full"></div>
                </header>
                
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-cyan-400 border-b-2 border-slate-700 pb-2">Core Workflow</h2>
                        <WorkflowStep icon={<UploadIcon className="w-5 h-5"/>} title="1. Upload" description="Start by uploading a mockup, screenshot, or project file into the Image Sandbox or Chat." />
                        <WorkflowStep icon={<CropIcon className="w-5 h-5"/>} title="2. Snapshot" description="GT Pilot performs a cognitive analysis, creating a detailed breakdown and logging a visual revision." />
                        <WorkflowStep icon={<PlayIcon className="w-5 h-5"/>} title="3. Render" description="Activate a render to transform the visual mockup into live, responsive HTML in the sandbox." />
                        <WorkflowStep icon={<TerminalIcon className="w-5 h-5"/>} title="4. Track" description="Monitor every action via the dual trackers and review detailed logs in the Revision Center." />
                        <WorkflowStep icon={<CheckCircleIcon className="w-5 h-5"/>} title="5. Audit" description="Confirm revisions and audit the entire project lifecycle, ensuring full transparency and control." isLast={true} />
                    </div>

                    <div className="space-y-6">
                         <h2 className="text-2xl font-bold text-cyan-400 border-b-2 border-slate-700 pb-2">Dual Tracker System</h2>
                        <InfoCard icon={<ListBulletIcon className="w-6 h-6"/>} title="Visual Revision Tracker">
                            This tracker (bullet list icon) increments for every visual change, including image uploads, AI-generated images, and sandbox renders. It provides a granular history of all creative assets.
                        </InfoCard>
                         <InfoCard icon={<FolderIcon className="w-6 h-6"/>} title="Full-Process Execution Tracker">
                            This tracker (folder icon) increments only when a full render cycle is completed—from visual mockup to injected HTML. It tracks finalized, executable milestones in your project.
                        </InfoCard>
                    </div>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold text-cyan-400 text-center mb-4">Mission Statement</h2>
                    <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 text-center">
                        <p className="text-lg text-slate-300 italic leading-loose">
                            "GT Pilot operates as a modular strategist, designed to deconstruct creative vision into executable components. Our architecture prioritizes cognitive analysis, transparent revision tracking, and high-fidelity execution to transform abstract ideas into tangible, interactive experiences. We are not just a tool; we are a co-pilot in the design and development lifecycle."
                        </p>
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

export default SolutionsPage;