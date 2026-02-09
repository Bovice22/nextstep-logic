"use client";

import { useChat, type UIMessage } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function EmbeddedChat() {
    const [input, setInput] = useState('');
    const { messages, sendMessage, status, error, regenerate } = useChat();

    // Add welcome message on mount
    useEffect(() => {
        if (messages.length === 0) {
            // we can't easily "inject" a message into useChat state without sending it or using local state override
            // easier pattern: just render the welcome message conditionally or appending it as a system message if supported
            // BUT, useChat's check for empty messages is useful. 
            // Let's just render the welcome message as a fake message in the UI if list is empty
        }
    }, [messages.length]);

    const isLoading = status === 'submitted' || status === 'streaming';
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        await sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
        setInput('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const suggestions = [
        "How does the booking system work?",
        "What is your pricing model?",
        "Can you integrate with my calendar?",
        "Do you offer white-labeling?"
    ];

    const handleSuggestionClick = (text: string) => {
        setInput(text);
        // Optional: auto-send or let user send
        // sendMessage({ role: 'user', parts: [{ type: 'text', text }] }); 
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-brand-secondary"></div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">NextStep Logic AI Demo</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online & Ready to Help
                        </p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <Sparkles size={12} className="text-yellow-400" />
                    Powered by Google Gemini
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[#0a0a1a]">
                {messages.length === 0 && (
                    <div className="flex gap-4 max-w-[85%] mr-auto flex-row">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex flex-shrink-0 items-center justify-center mt-1">
                            <Bot size={16} />
                        </div>
                        <div className="p-4 rounded-2xl text-sm leading-relaxed bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm shadow-sm">
                            <div className="prose prose-invert prose-sm max-w-none break-words">
                                <p>Hi there! I'm the NextStep AI demo. Ask me about our services, pricing, or how we can automate your business logic.</p>
                            </div>
                        </div>
                    </div>
                )}
                {messages.map((m: UIMessage) => (
                    <div
                        key={m.id}
                        className={cn(
                            "flex gap-4 max-w-[85%]",
                            m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                        )}
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center mt-1",
                                m.role === 'user'
                                    ? "bg-white/10 text-white"
                                    : "bg-brand-primary/20 text-brand-primary"
                            )}
                        >
                            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div
                            className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed",
                                m.role === 'user'
                                    ? "bg-brand-primary text-white rounded-tr-sm shadow-md"
                                    : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm shadow-sm"
                            )}
                        >
                            {m.parts.filter(p => p.type === 'text').map((p, i) => (
                                <div key={i} className="prose prose-invert prose-sm max-w-none break-words">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {p.text}
                                    </ReactMarkdown>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-4 max-w-[85%] mr-auto">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex flex-shrink-0 items-center justify-center mt-1">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white/5 text-slate-200 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-slate-400" />
                            <span className="text-xs text-slate-500">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
                <div className="px-6 py-2 bg-[#0a0a1a] flex gap-2 overflow-x-auto no-scrollbar pb-4">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSuggestionClick(s)}
                            className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:text-white hover:border-brand-primary/50 transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-surface-dark">
                <div className="relative flex items-center gap-2">
                    <input
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary/50 transition-all font-medium"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type a message to test the AI..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="text-center mt-3 flex items-center justify-center gap-2">
                    <p className="text-[10px] text-slate-500">
                        This is a live demo connected to our production AI model.
                    </p>
                </div>
            </form>
        </div>
    );
}
