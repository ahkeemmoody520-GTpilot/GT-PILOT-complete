import React from 'react';
import { CheckCircleIcon } from './icons';

interface ThinkingIndicatorProps {
    text?: string;
    isComplete?: boolean;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ text = "Thinking...", isComplete = false }) => {
    if (isComplete) {
        return (
            <div className="flex items-center space-x-2 p-2">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm text-slate-300">Processing complete.</span>
            </div>
        );
    }
    
    return (
        <div className="flex items-center space-x-3 p-2">
            <span className="text-sm text-slate-300">{text}</span>
            <div className="flex items-end justify-center space-x-1.5 h-8">
                <span className="dot dot1 w-2.5 h-2.5 bg-cyan-400 rounded-full"></span>
                <span className="dot dot2 w-2.5 h-2.5 bg-cyan-400 rounded-full"></span>
                <span className="dot dot3 w-2.5 h-2.5 bg-cyan-400 rounded-full"></span>
            </div>
            <style>{`
                @keyframes bounce-glow {
                    0%, 100% { 
                        transform: translateY(0);
                        background-color: theme(colors.cyan.400);
                        box-shadow: 0 0 5px theme(colors.cyan.400);
                        filter: blur(0);
                    }
                    50% { 
                        transform: translateY(-12px); 
                        background-color: theme(colors.cyan.300);
                        box-shadow: 0 0 20px theme(colors.cyan.300);
                        filter: blur(1px);
                    }
                }
                .dot {
                    animation: bounce-glow 1.4s infinite ease-in-out;
                }
                .dot1 { animation-delay: -0.28s; }
                .dot2 { animation-delay: -0.14s; }
            `}</style>
        </div>
    );
};

export default ThinkingIndicator;