import React, { useState, useEffect } from 'react';
import { RefreshIcon, CheckCircleIcon, BrainIcon } from './icons';

const RENDER_TRACE_TASKS = [
    "Locking Snapshot A as hero source...",
    "Sourcing architectural realism visual...",
    "Sourcing human realism visual...",
    "Sourcing wildlife realism visual...",
    "Rendering header with logo and menu...",
    "Stacking 3 vertical cards...",
    "Enforcing layout separation and render purity...",
    "Finalizing HTML with full fidelity..."
];

interface Task {
    name: string;
    status: 'pending' | 'active' | 'completed';
    startTime: Date | null;
    endTime: Date | null;
}

// Directive v70.9.8: Use ⟳ icon for active tasks. RefreshIcon is appropriate.
const ActiveTaskIcon = () => (
    <div className="w-5 h-5 flex items-center justify-center">
        <RefreshIcon className="w-4 h-4 text-cyan-400 animate-spin" />
    </div>
);

// Directive v70.9.8: Use ✅ icon for completed tasks. CheckCircleIcon is appropriate.
const CompletedTaskIcon = () => (
     <div className="w-5 h-5 flex items-center justify-center">
        <CheckCircleIcon className="w-4 h-4 text-green-400" />
    </div>
);

// Directive v70.9.8: Implement real-time clock sync.
const LiveTimestamp: React.FC<{ startTime: Date | null, endTime: Date | null, status: Task['status'] }> = ({ startTime, endTime, status }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        if (status === 'active') {
            const timer = setInterval(() => setNow(new Date()), 1000); // Updates every second
            return () => clearInterval(timer);
        }
    }, [status]);

    if (!startTime) return <span className="w-44 text-right"></span>;

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });

    const finalTime = endTime ? formatTime(endTime) : formatTime(now);

    return (
        <span className="w-44 text-right">
            {formatTime(startTime)} → {status === 'completed' || status === 'active' ? finalTime : '...'}
        </span>
    );
};

const TaskDetailView: React.FC<{ task: Task }> = ({ task }) => {
    const getProgress = () => {
        switch(task.status) {
            case 'pending': return 0;
            case 'active': return 50; // Simulate in-progress
            case 'completed': return 100;
            default: return 0;
        }
    };
    
    return (
        <div className="p-4 ml-8 my-2 bg-slate-900 rounded-lg border border-slate-700 animate-fade-in-down">
            <h4 className="text-white font-semibold mb-3 text-sm">Task Details: <span className="text-cyan-400">{task.name}</span></h4>
            
            <div className="space-y-3 text-xs">
                <div>
                    <p className="text-slate-400 font-medium">Status</p>
                    <p className="text-white capitalize">{task.status}</p>
                </div>
                
                <div>
                    <p className="text-slate-400 font-medium">Time Tracking</p>
                    <p className="text-white">Started: {task.startTime ? task.startTime.toLocaleTimeString() : 'N/A'}</p>
                    <p className="text-white">Completed: {task.endTime ? task.endTime.toLocaleTimeString() : 'N/A'}</p>
                </div>

                <div>
                    <p className="text-slate-400 font-medium mb-1">Progress</p>
                     <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${getProgress()}%` }}></div>
                    </div>
                </div>

                <div>
                    <p className="text-slate-400 font-medium">Audit Trace</p>
                    <p className="text-slate-500 italic">Audit trace for this task will be available upon completion. This includes sub-step validation and fidelity checks.</p>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};


interface RenderLoaderProps {
    onProgressUpdate: (progress: number, enhancement: string) => void;
}

const RenderLoader: React.FC<RenderLoaderProps> = ({ onProgressUpdate }) => {
    const [tasks, setTasks] = useState<Task[]>(RENDER_TRACE_TASKS.map(name => ({
        name,
        status: 'pending',
        startTime: null,
        endTime: null,
    })));
    const [expandedTask, setExpandedTask] = useState<number | null>(null);

    useEffect(() => {
        onProgressUpdate((1 / RENDER_TRACE_TASKS.length) * 100, RENDER_TRACE_TASKS[0]);
        
        setTasks(currentTasks => {
            const newTasks = [...currentTasks];
            if (newTasks.length > 0) {
                newTasks[0] = { ...newTasks[0], status: 'active', startTime: new Date() };
            }
            return newTasks;
        });

        const interval = setInterval(() => {
            setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.status === 'active');

                if (activeIndex === -1 || activeIndex >= currentTasks.length - 1) {
                    clearInterval(interval);
                    if (activeIndex !== -1) {
                        const newTasks = [...currentTasks];
                        newTasks[activeIndex] = { ...newTasks[activeIndex], status: 'completed', endTime: new Date() };
                        onProgressUpdate(100, "Finalizing...");
                        return newTasks;
                    }
                    return currentTasks;
                }

                const newTasks = [...currentTasks];
                newTasks[activeIndex] = { ...newTasks[activeIndex], status: 'completed', endTime: new Date() };
                const nextIndex = activeIndex + 1;
                newTasks[nextIndex] = { ...newTasks[nextIndex], status: 'active', startTime: new Date() };

                const progress = ((nextIndex + 1) / newTasks.length) * 100;
                onProgressUpdate(progress, newTasks[nextIndex].name);

                return newTasks;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [onProgressUpdate]);
    
    const getOpacityClass = (status: Task['status']) => {
        switch (status) {
            case 'active':
                return 'opacity-100'; // Full opacity for active task
            case 'completed':
                return 'opacity-80'; // 80% opacity for completed tasks
            case 'pending':
                return 'opacity-50'; // Dimmed opacity for pending tasks
            default:
                return 'opacity-50';
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center text-white bg-slate-900/90 backdrop-blur-sm p-4">
            <div 
                className="w-full max-w-2xl bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 space-y-2"
            >
                <div className="flex items-center gap-3 mb-4">
                    <BrainIcon className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Live Render Screen</h2>
                </div>
               {tasks.map((task, index) => {
                   let durationText = '';
                   if (task.endTime && task.startTime) {
                     const durationSeconds = (task.endTime.getTime() - task.startTime.getTime()) / 1000;
                     durationText = `(${durationSeconds.toFixed(1)}s)`;
                   }
                   
                   return (
                       <div key={index}>
                           <div
                               onClick={() => setExpandedTask(expandedTask === index ? null : index)} 
                               className={`flex items-center gap-3 text-sm font-mono p-2 rounded-md transition-all duration-500 cursor-pointer hover:bg-slate-800 ${getOpacityClass(task.status)}`}
                            >
                               {/* Directive v70.9.8: Sequential icon state changes */}
                               {task.status === 'completed' && <CompletedTaskIcon />}
                               {task.status === 'active' && <ActiveTaskIcon />}
                               {task.status === 'pending' && <div className="w-5 h-5 flex items-center justify-center"><div className="w-2 h-2 bg-slate-600 rounded-full"></div></div>}
        
                               <div className="flex-grow text-left text-slate-300 overflow-hidden whitespace-nowrap">
                                   <span className={`transition-opacity duration-300 ${task.status === 'active' ? 'text-white font-semibold' : ''}`}>
                                       {task.name}
                                   </span>
                                   {task.status === 'completed' && durationText && <span className="text-slate-500 ml-2">{durationText}</span>}
                               </div>
                               
                               <div className={`text-slate-500 transition-colors ${task.status !== 'pending' ? 'text-slate-400' : ''}`}>
                                   <LiveTimestamp startTime={task.startTime} endTime={task.endTime} status={task.status} />
                               </div>
                           </div>
                           {expandedTask === index && <TaskDetailView task={task} />}
                       </div>
                   );
               })}
            </div>
        </div>
    );
};

export default RenderLoader;
