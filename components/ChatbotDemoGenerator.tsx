"use client";

import { useChat, type UIMessage } from '@ai-sdk/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Globe, ScanSearch, CheckCircle2, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type DemoState = 'input' | 'scanning' | 'chat';

export default function ChatbotDemoGenerator() {
    // ----------------------------------------------------------------------
    // State
    // ----------------------------------------------------------------------
    const [demoState, setDemoState] = useState<DemoState>('input');

    // Form State
    const [url, setUrl] = useState('');
    const [companyName, setCompanyName] = useState('');

    // Analysis State
    const [scrapedContext, setScrapedContext] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatus, setScanStatus] = useState('Initializing scanner...');

    // Coordination State
    const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);



    // ----------------------------------------------------------------------
    // Handlers
    // ----------------------------------------------------------------------

    const handleStartDemo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !companyName) return;

        // Reset states
        setDemoState('scanning');
        setIsAnalysisComplete(false);
        setIsAnimationComplete(false);
        setScrapedContext('');

        // Start animation (visual only)
        simulateScan();

        // Start data fetch
        try {
            console.log("Starting analysis for:", url);
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            if (data.success) {
                console.log("Analysis success, context length:", data.data.length);
                setScrapedContext(data.data);
            } else {
                console.error("Analysis failed:", data.error);
                setScrapedContext(`Company: ${companyName}\nURL: ${url}\n(Note: Automated scanning failed, so I will rely on general knowledge.)`);
            }
        } catch (err) {
            console.error(err);
            setScrapedContext(`Company: ${companyName}\nURL: ${url}`);
        } finally {
            setIsAnalysisComplete(true);
        }
    };

    // Fake progress bar animation for UX
    const simulateScan = () => {
        setScanProgress(0);
        setScanStatus("Connecting to website...");

        setTimeout(() => { setScanProgress(25); setScanStatus("Analyzing page structure..."); }, 1000);
        setTimeout(() => { setScanProgress(50); setScanStatus("Extracting brand voice..."); }, 2500);
        setTimeout(() => { setScanProgress(75); setScanStatus("Building knowledge base..."); }, 4000);
        setTimeout(() => {
            setScanProgress(100);
            setScanStatus("Ready!");
            // Mark animation as done
            setTimeout(() => {
                setIsAnimationComplete(true);
            }, 800);
        }, 5500);
    };

    // Watch for both completion states
    useEffect(() => {
        if (demoState === 'scanning' && isAnalysisComplete && isAnimationComplete) {
            setDemoState('chat');
        }
    }, [demoState, isAnalysisComplete, isAnimationComplete]);




    // ----------------------------------------------------------------------
    // Render: Input Step
    // ----------------------------------------------------------------------
    if (demoState === 'input') {
        return (
            <div className="w-full max-w-2xl mx-auto bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                        <ScanSearch size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Build Your Custom Bot</h2>
                    <p className="text-slate-400">Enter your website URL, and our AI will instantly train itself to become your customer support agent.</p>
                </div>

                <form onSubmit={handleStartDemo} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-600"
                            placeholder="e.g. Acme Corp"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Website URL</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                required
                                type="text"
                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-600"
                                placeholder="example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/25 transition-all flex items-center justify-center gap-2 group"
                    >
                        Generate Demo Agent <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // Render: Scanning Step
    // ----------------------------------------------------------------------
    if (demoState === 'scanning') {
        return (
            <div className="w-full max-w-2xl mx-auto bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-12 relative flex flex-col items-center justify-center text-center h-[500px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>

                <div className="mb-8 relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
                        <Loader2 size={48} className="text-brand-primary animate-spin" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{scanProgress}%</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Training AI Agent...</h3>
                <p className="text-slate-400 mb-8 animate-pulse">{scanStatus}</p>

                <div className="w-full max-w-sm bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-brand-primary transition-all duration-500 ease-out"
                        style={{ width: `${scanProgress}%` }}
                    ></div>
                </div>

                <div className="mt-8 space-y-2 text-sm text-slate-500 text-left w-full max-w-xs mx-auto">
                    <div className={cn("flex items-center gap-2", scanProgress > 10 ? "text-green-400" : "opacity-30")}>
                        <CheckCircle2 size={16} /> Connecting to {url}...
                    </div>
                    <div className={cn("flex items-center gap-2", scanProgress > 40 ? "text-green-400" : "opacity-30")}>
                        <CheckCircle2 size={16} /> Analyzing content...
                    </div>
                    <div className={cn("flex items-center gap-2", scanProgress > 70 ? "text-green-400" : "opacity-30")}>
                        <CheckCircle2 size={16} /> Optimizing responses...
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // Render: Chat Step (Active Session)
    // ----------------------------------------------------------------------
    if (demoState === 'chat') {
        return (
            <DemoChatInterface
                companyName={companyName}
                url={url}
                context={scrapedContext}
                onRestart={() => {
                    setDemoState('input');
                    setUrl('');
                    setCompanyName('');
                    setScrapedContext('');
                }}
            />
        );
    }

    return null; // Should not happen
}

// ----------------------------------------------------------------------
// Sub-Component: Active Chat Interface
// ----------------------------------------------------------------------

interface DemoChatInterfaceProps {
    companyName: string;
    url: string;
    context: string;
    onRestart: () => void;
}

function DemoChatInterface({ companyName, url, context, onRestart }: DemoChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');

    // Debug log to confirm context receipt
    useEffect(() => {
        console.log("DemoChatInterface mounted. Context length:", context?.length);
    }, [context]);

    const { messages, sendMessage, status } = useChat({
        // @ts-ignore
        api: '/api/chat/demo',
        initialMessages: context ? [
            {
                id: 'context-injection',
                role: 'user',
                content: `Here is the context about my company. Please study it carefully and act as a customer support agent based ONLY on this information:\n\n${context}`
            },
            {
                id: 'context-ack',
                role: 'assistant',
                content: `Understood. I have processed the context about ${companyName}. I will act as a professional support agent for this company, using the provided information to answer questions. I will not mention I am an AI unless necessary.`
            }
        ] : []
    });

    const isLoading = status === 'submitted' || status === 'streaming';

    // Filter out the "system" injection messages from the UI
    const visibleMessages = messages.filter(m => m.id !== 'context-injection' && m.id !== 'context-ack');

    // Scroll to bottom without moving the whole page
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        await sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
        setInput('');
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative fade-in">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-brand-secondary"></div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{companyName} Support Agent</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Trained on {url}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onRestart}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                    Start Over
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[#0a0a1a]">

                {/* Initial Welcome Bubble (Fake) */}
                <div className="flex gap-4 max-w-[85%] mr-auto flex-row">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex flex-shrink-0 items-center justify-center mt-1">
                        <Bot size={16} />
                    </div>
                    <div className="p-4 rounded-2xl text-sm leading-relaxed bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm shadow-sm">
                        <div className="prose prose-invert prose-sm max-w-none break-words">
                            <p>Hello! I've studied <strong>{url}</strong> and am ready to answer questions about <strong>{companyName}</strong>. What would you like to know?</p>
                        </div>
                    </div>
                </div>

                {visibleMessages.map((m: UIMessage) => (
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
                            <span className="text-xs text-slate-500">Consulting knowledge base...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10 bg-surface-dark">
                <div className="relative flex items-center gap-2">
                    <input
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary/50 transition-all font-medium"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Ask about ${companyName}...`}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
