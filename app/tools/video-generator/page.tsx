"use client";

import { useState, useEffect } from 'react';
import { Video, Sparkles, Download, Loader2, Play, Info, History } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const STATUS_MESSAGES = [
    "Initializing Aurora engine...",
    "Analyzing prompt semantics...",
    "Defining spatial coordinates...",
    "Simulating physics and fluid dynamics...",
    "Rendering cinematic lighting...",
    "Synthesizing high-fidelity frames...",
    "Optimizing motion vectors...",
    "Finalizing neural temporal coherency...",
    "Post-processing visual effects...",
    "Compressing to 720p HD..."
];

export default function VideoGeneratorPage() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [remaining, setRemaining] = useState<number | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let statusInterval: NodeJS.Timeout;

        if (isGenerating) {
            setElapsedTime(0);
            setStatusIndex(0);

            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);

            statusInterval = setInterval(() => {
                setStatusIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
            }, 3500);
        }

        return () => {
            clearInterval(interval);
            clearInterval(statusInterval);
        };
    }, [isGenerating]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        setIsGenerating(true);
        setError(null);
        setGeneratedVideo(null);

        try {
            const res = await fetch('/api/tools/video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMsg = typeof data.error === 'object'
                    ? (data.error.message || JSON.stringify(data.error))
                    : (data.error || "Failed to generate video");
                throw new Error(errorMsg);
            }

            if (data.videoUrl) {
                setGeneratedVideo(data.videoUrl);
                if (data.remaining !== undefined) {
                    setRemaining(data.remaining);
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#030014] text-slate-200 overflow-hidden relative flex flex-col justify-center">
            {/* Background Vibrancy */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse-slow"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] bg-indigo-400/10 rounded-full blur-[140px] animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-8 lg:py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">

                    {/* Left Column: Hero Text */}
                    <div className="text-center lg:text-left mb-12 lg:mb-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-400 mb-8 backdrop-blur-md">
                            <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-500 font-bold">New Grok-Powered Video Engine</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                            Dream Big. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-600 animate-gradient-x">
                                Watch It Be.
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10 font-medium">
                            The next generation of <span className="text-white">Text-to-Video</span> is here. Experience high-fidelity motion graphics powered by xAI's aurora engine.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-bold text-slate-400">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                                720p HD EXPORT
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                                TEMPORAL COHERENCY
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                ZERO WATERMARK
                            </div>
                        </div>

                        {remaining !== null && (
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-slate-500">
                                <Info size={16} />
                                <span>Credits remaining for today: <span className="text-white">{remaining}/3</span></span>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Generator Interface */}
                    <div className="w-full relative">
                        {/* Glow Behind Card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                        <div className="relative bg-[#0b0b14]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-white/20">

                            {/* Video Display Area */}
                            <div className="aspect-video w-full bg-[#05050A] relative flex items-center justify-center overflow-hidden border-b border-white/5">
                                {!generatedVideo && !isGenerating && (
                                    <div className="text-center p-12 relative z-10">
                                        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500/20 via-blue-500/10 to-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 rotate-3 transform transition-transform duration-700 hover:rotate-0">
                                            <Video size={40} className="text-white/40" />
                                        </div>
                                        <h3 className="text-white font-bold text-2xl mb-3 tracking-tight">Ready to Animate</h3>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                                            Describe a scene in detail. Explain the motion, lighting, and camera angle for the best results.
                                        </p>
                                    </div>
                                )}

                                {isGenerating && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#05050A]/95 backdrop-blur-xl">
                                        <div className="relative mb-8">
                                            {/* Advanced Loader */}
                                            <div className="w-24 h-24 border-2 border-white/5 rounded-full flex items-center justify-center">
                                                <div className="absolute w-20 h-20 border-t-2 border-indigo-400 rounded-full animate-spin"></div>
                                                <div className="absolute w-16 h-16 border-b-2 border-blue-500 rounded-full animate-spin-reverse"></div>
                                                <Sparkles size={28} className="text-white animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="text-center space-y-2 px-8">
                                            <p className="text-white font-bold text-xl tracking-tight h-8 transition-all duration-500">
                                                {STATUS_MESSAGES[statusIndex]}
                                            </p>
                                            <div className="flex items-center justify-center gap-3 text-slate-500 font-mono text-sm">
                                                <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Processing</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <span className="text-indigo-400 font-bold">{elapsedTime}s elapsed</span>
                                            </div>
                                        </div>

                                        {/* Fake Progress Bar */}
                                        <div className="mt-10 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.min(95, (elapsedTime / 45) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {generatedVideo && (
                                    <div className="relative w-full h-full group/video bg-black">
                                        <video
                                            src={generatedVideo}
                                            className="w-full h-full object-contain"
                                            controls
                                            autoPlay
                                            loop
                                            playsInline
                                        />
                                        <div className="absolute top-4 right-4 z-30 opacity-0 group-hover/video:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/video:translate-y-0">
                                            <a
                                                href={generatedVideo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-slate-100 transition-all text-sm shadow-2xl active:scale-95"
                                            >
                                                <Download size={16} /> Save Video
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="p-8 bg-[#0b0b14]">
                                <form onSubmit={handleGenerate} className="relative">
                                    <div className="relative flex flex-col gap-4">
                                        <div className="relative">
                                            <textarea
                                                rows={3}
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="A cinematic shot of a cyberpunk city at night, heavy rain, neon lights reflecting on the pavement, smooth drone motion moving forward through the street..."
                                                className="w-full bg-[#14141d] text-white px-6 py-5 rounded-2xl border border-white/5 focus:border-accent-cyan/30 focus:ring-1 focus:ring-accent-cyan/20 outline-none placeholder:text-slate-600 focus:bg-[#181825] transition-all resize-none leading-relaxed"
                                                disabled={isGenerating}
                                            />
                                            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest pointer-events-none">
                                                Aurora V2.1
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isGenerating || !prompt.trim()}
                                            className="w-full bg-white text-black hover:bg-slate-200 font-black py-4 px-8 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-3 text-lg"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Generating HD Video...
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={20} fill="currentColor" />
                                                    Generate Cinematic Video
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {error && (
                                        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-start gap-2">
                                            <Info size={16} className="shrink-0 mt-0.5" />
                                            {error}
                                        </div>
                                    )}
                                </form>

                                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                            <History size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Engine Status</p>
                                            <p className="text-xs text-white font-semibold">Operational • Low Latency</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cloud Partners</p>
                                        <p className="text-xs text-slate-400 font-medium">xAI • Pollinations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
