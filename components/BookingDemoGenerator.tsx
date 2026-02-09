"use client";

import { useState, useEffect } from 'react';
import { Loader2, Globe, ScanSearch, CheckCircle2, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type DemoState = 'input' | 'scanning' | 'success';

type Industry = {
    id: string;
    name: string;
    icon: string;
};

const INDUSTRIES: Industry[] = [
    { id: 'salon', name: 'Beauty & Salon', icon: 'spa' },
    { id: 'gym', name: 'Fitness & Gym', icon: 'fitness_center' },
    { id: 'consulting', name: 'Professional Services', icon: 'business_center' },
    { id: 'entertainment', name: 'Entertainment & Games', icon: 'sports_esports' },
    { id: 'default', name: 'Other / General', icon: 'category' },
];

export default function BookingDemoGenerator() {
    // ----------------------------------------------------------------------
    // State
    // ----------------------------------------------------------------------
    const [demoState, setDemoState] = useState<DemoState>('input');

    // Form State
    const [url, setUrl] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('entertainment');

    // Analysis State
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
        setScanProgress(0);
        setScanStatus("Connecting to website...");

        // Visual progress timer (reaches 95% and waits)
        const progressInterval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                const increment = prev < 50 ? 5 : (prev < 80 ? 2 : 1);
                return prev + increment;
            });
        }, 800);

        // Dynamic status updates
        const statusTimeouts = [
            setTimeout(() => setScanStatus("Analyzing page structure..."), 2000),
            setTimeout(() => setScanStatus("Extracting brand colors..."), 5000),
            setTimeout(() => setScanStatus("Identifying services..."), 12000),
            setTimeout(() => setScanStatus("Configuring booking rules..."), 20000),
            setTimeout(() => setScanStatus("Finalizing custom dashboard..."), 30000),
        ];

        // Start data fetch (we use the same analyzer to look cool)
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            await res.json();
        } catch (err) {
            console.error(err);
        } finally {
            clearInterval(progressInterval);
            statusTimeouts.forEach(t => clearTimeout(t));
            setScanProgress(100);
            setScanStatus("Ready!");
            setIsAnalysisComplete(true);
            setTimeout(() => setIsAnimationComplete(true), 1500);
        }
    };

    // Watch for completion to move to success state
    useEffect(() => {
        if (demoState === 'scanning' && isAnalysisComplete && isAnimationComplete) {
            setDemoState('success');
        }
    }, [demoState, isAnalysisComplete, isAnimationComplete]);

    const handleLaunchDemo = () => {
        const params = new URLSearchParams({
            demo: 'true',
            name: companyName,
            type: selectedIndustry,
            // Pre-fill some fake contact info for the demo
            c_name: 'Demo User',
            c_email: 'hello@example.com'
        });

        // Use external link to port 3001
        window.open(`http://localhost:3001/book?${params.toString()}`, '_blank');
    };

    // ----------------------------------------------------------------------
    // Render: Input Step
    // ----------------------------------------------------------------------
    if (demoState === 'input') {
        return (
            <div className="w-full max-w-2xl mx-auto bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-pink to-purple-600"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent-pink/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent-pink">
                        <Calendar size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Build Your Custom Booking Page</h2>
                    <p className="text-slate-400">Transform your website into a 24/7 reservation engine. Simply provide your URL and industry.</p>
                </div>

                <form onSubmit={handleStartDemo} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-pink outline-none transition-all placeholder:text-slate-600"
                                placeholder="e.g. Small Nation"
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
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent-pink outline-none transition-all placeholder:text-slate-600"
                                    placeholder="example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Select Your Industry</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {INDUSTRIES.map((industry) => (
                                <button
                                    key={industry.id}
                                    type="button"
                                    onClick={() => setSelectedIndustry(industry.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                                        selectedIndustry === industry.id
                                            ? "bg-accent-pink/10 border-accent-pink text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-2xl">{industry.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">{industry.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent-pink hover:bg-accent-pink/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent-pink/25 transition-all flex items-center justify-center gap-2 group"
                    >
                        Generate Booking Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
            <div className="w-full max-w-2xl mx-auto bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 relative flex flex-col items-center justify-center text-center h-[420px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-pink to-purple-600"></div>

                <div className="mb-8 relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
                        <Loader2 size={48} className="text-accent-pink animate-spin" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{scanProgress}%</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Business Profile...</h3>
                <p className="text-slate-400 mb-8 animate-pulse text-sm h-6">{scanStatus}</p>

                <div className="w-full max-w-sm bg-white/5 rounded-full h-2 overflow-hidden mb-8">
                    <div
                        className="h-full bg-accent-pink transition-all duration-500 ease-out"
                        style={{ width: `${scanProgress}%` }}
                    ></div>
                </div>

                <div className="space-y-3 text-sm text-slate-500 text-left w-full max-w-xs mx-auto bg-black/20 p-6 rounded-2xl border border-white/5">
                    <div className={cn("flex items-center gap-2 transition-colors", scanProgress > 30 ? "text-green-400" : "opacity-30")}>
                        <CheckCircle2 size={16} /> Brand Identity Confirmed
                    </div>
                    <div className={cn("flex items-center gap-2 transition-colors", scanProgress > 60 ? "text-green-400" : "opacity-30")}>
                        <CheckCircle2 size={16} /> Service Logic Mapped
                    </div>
                    <div className={cn("flex items-center gap-2 transition-colors", isAnalysisComplete ? "text-green-400" : "opacity-30")}>
                        <CheckCircle2 size={16} /> Demo Engine Ready
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // Render: Success Step
    // ----------------------------------------------------------------------
    if (demoState === 'success') {
        return (
            <div className="w-full max-w-2xl mx-auto bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-12 relative flex flex-col items-center justify-center text-center h-[420px] fade-in">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-pink to-purple-600"></div>

                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 size={48} />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">Demo Generated!</h3>
                <p className="text-slate-400 mb-10 max-w-md">
                    We've built a custom terminal and booking page for <strong>{companyName}</strong>. Ready to see it in action?
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                        onClick={handleLaunchDemo}
                        className="bg-accent-pink hover:bg-accent-pink/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-accent-pink/25 transition-all flex items-center justify-center gap-2 group"
                    >
                        Launch Live Demo <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                    </button>
                    <button
                        onClick={() => setDemoState('input')}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-8 py-4 rounded-xl border border-white/10 transition-all"
                    >
                        Edit Configuration
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
