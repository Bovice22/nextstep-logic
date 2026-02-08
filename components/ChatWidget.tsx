'use client';

import { useChat, type Message } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-8 sm:right-8">
            {/* Chat Window */}
            <div
                className={cn(
                    "mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[calc(100vh-120px)] rounded-2xl border border-white/10 bg-[#0f0f23]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 origin-bottom-right overflow-hidden flex flex-col",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-10 pointer-events-none hidden"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">NextStep Assistant</h3>
                            <p className="text-xs text-slate-400">Ask us anything!</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 mt-8 text-sm px-4">
                            <p>Hello! I'm your AI assistant.</p>
                            <p className="mt-2">How can I help you automate your business today?</p>
                        </div>
                    )}

                    {messages.map((m: Message) => (
                        <div
                            key={m.id}
                            className={cn(
                                "flex gap-3 text-sm",
                                m.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center",
                                    m.role === 'user'
                                        ? "bg-white/10 text-white"
                                        : "bg-primary/20 text-primary"
                                )}
                            >
                                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div
                                className={cn(
                                    "p-3 rounded-2xl max-w-[80%]",
                                    m.role === 'user'
                                        ? "bg-primary text-white rounded-tr-sm"
                                        : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm"
                                )}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex flex-shrink-0 items-center justify-center">
                                <Bot size={14} />
                            </div>
                            <div className="bg-white/5 text-slate-200 border border-white/10 rounded-2xl rounded-tl-sm p-3 flex items-center">
                                <Loader2 size={16} className="animate-spin text-slate-400" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/20">
                    <div className="relative">
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-600">Powered by NextStep Logic AI</p>
                    </div>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full shadow-[0_0_30px_rgba(56,56,250,0.4)] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95",
                    isOpen ? "bg-slate-700 rotate-90" : "bg-primary animate-bounce-subtle"
                )}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
