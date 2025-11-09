import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatOverlayProps {
    messages: ChatMessage[];
}

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        setVisible(true);
        // Only auto-hide if it's not a loading message
        if (message.type !== 'loading') {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);

    const alignment = message.role === 'user' ? 'justify-end' : 'justify-start';
    const animation = message.role === 'user' 
        ? (visible ? 'animate-slide-in-right' : 'animate-slide-out-right')
        : (visible ? 'animate-slide-in-left' : 'animate-slide-out-left');

    return (
        <div className={`fixed bottom-28 w-full flex ${alignment} px-4 pointer-events-none z-40`}>
            <div className={`max-w-md p-3 rounded-xl shadow-2xl bg-slate-800/90 backdrop-blur-md text-white ${animation} pointer-events-auto`}>
                {message.type === 'loading' ? (
                    <ThinkingIndicator isComplete={message.isComplete} />
                ) : (
                    <p className="whitespace-pre-wrap font-bold">{message.text}</p>
                )}
            </div>
        </div>
    );
};


const ChatOverlay: React.FC<ChatOverlayProps> = ({ messages }) => {
    const [lastUserMessage, setLastUserMessage] = useState<ChatMessage | null>(null);
    const [lastModelMessage, setLastModelMessage] = useState<ChatMessage | null>(null);
    const [hoveringLeft, setHoveringLeft] = useState(false);
    const [hoveringRight, setHoveringRight] = useState(false);
    const [latestMessage, setLatestMessage] = useState<ChatMessage | null>(null);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            setLatestMessage(lastMsg);

            const finalUserMsg = [...messages].reverse().find(m => m.role === 'user');
            if (finalUserMsg) setLastUserMessage(finalUserMsg);
            
            const finalModelMsg = [...messages].reverse().find(m => m.role === 'model' && m.type !== 'loading');
            if (finalModelMsg) setLastModelMessage(finalModelMsg);
        }
    }, [messages]);

    const renderHoverMessage = (message: ChatMessage | null, isHovering: boolean, side: 'left' | 'right') => {
        if (!message || !isHovering) return null;
        const position = side === 'left' ? 'left-4' : 'right-4';
        return (
             <div className={`fixed bottom-28 ${position} max-w-md p-3 rounded-xl shadow-2xl bg-slate-800/90 backdrop-blur-md text-white animate-fade-in z-40`}>
                 <p className="whitespace-pre-wrap font-bold">{message.text}</p>
            </div>
        );
    };

    return (
        <>
            <div 
                className="fixed top-32 left-0 bottom-0 w-1/4 z-30 pointer-events-none" 
                onMouseEnter={() => setHoveringLeft(true)} 
                onMouseLeave={() => setHoveringLeft(false)}
            />
            <div 
                className="fixed top-32 right-0 bottom-0 w-1/4 z-30 pointer-events-none" 
                onMouseEnter={() => setHoveringRight(true)} 
                onMouseLeave={() => setHoveringRight(false)}
            />

            {latestMessage && <MessageBubble key={latestMessage.id} message={latestMessage} />}

            {renderHoverMessage(lastModelMessage, hoveringLeft, 'left')}
            {renderHoverMessage(lastUserMessage, hoveringRight, 'right')}

            <style>{`
                @keyframes slide-in-left { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slide-out-left { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }
                @keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slide-out-right { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
                .animate-slide-in-left { animation: slide-in-left 0.5s ease-out forwards; }
                .animate-slide-out-left { animation: slide-out-left 0.5s ease-in forwards; }
                .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }
                .animate-slide-out-right { animation: slide-out-right 0.5s ease-in forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </>
    );
};

export default ChatOverlay;