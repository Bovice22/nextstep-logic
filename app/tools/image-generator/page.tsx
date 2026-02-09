"use client";

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, Download, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function ImageGeneratorPage() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isGenerating) {
            setElapsedTime(0);
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        setIsGenerating(true);
        setError(null);

        try {
            const res = await fetch('/api/tools/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error("Daily limit reached! Come back tomorrow.");
                }
                throw new Error(data.error || "Failed to generate image");
            }

            if (data.image) {
                setGeneratedImage(data.image);
                setRemaining(data.remaining);
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
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-8 lg:py-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

                    {/* Left Column: Hero Text */}
                    <div className="text-center lg:text-left mb-12 lg:mb-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-brand-secondary mb-6 backdrop-blur-sm">
                            <Sparkles size={16} className="text-yellow-400" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 font-bold">New Free Tool</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
                            Dream It. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 animate-gradient-x">
                                Create It.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                            Unleash your creativity with our <span className="text-white font-semibold">AI Image Generator</span>. Description to visuals in seconds—completely free.
                        </p>

                        <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Fast Generation
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                High Quality
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                No Login Req.
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Generator Interface */}
                    <div className="w-full">
                        <div className="bg-[#0f0f15]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)] relative group/card transition-all hover:border-white/20">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                            {/* Image Display Area */}
                            <div className="aspect-square md:aspect-[4/3] w-full bg-[#05050A] relative flex items-center justify-center overflow-hidden border-b border-white/5">
                                {!generatedImage && !isGenerating && (
                                    <div className="text-center p-8 relative z-10">
                                        <div className="w-24 h-24 bg-gradient-to-tr from-brand-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover/card:scale-110 transition-transform duration-500">
                                            <ImageIcon size={40} className="text-white/50" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">Nano Banana Pro</h3>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                            Enter a prompt to generate professional grade visuals in seconds.
                                        </p>
                                    </div>
                                )}

                                {isGenerating && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-t-4 border-b-4 border-brand-primary rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles size={24} className="text-purple-500 animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="mt-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-500 font-bold tracking-widest animate-pulse uppercase">Creating Magic...</p>
                                        <div className="mt-4 flex flex-col items-center gap-1">
                                            <p className="text-white/60 text-xs font-medium">Estimated wait: ~10s</p>
                                            <p className="text-brand-primary text-lg font-mono font-bold">{elapsedTime}s</p>
                                        </div>
                                    </div>
                                )}

                                {generatedImage && (
                                    <div className="relative w-full h-full group/image">
                                        <img
                                            src={`data:image/png;base64,${generatedImage}`}
                                            alt={prompt}
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <a
                                                href={`data:image/png;base64,${generatedImage}`}
                                                download={`generated-image-${Date.now()}.png`}
                                                className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                                            >
                                                <Download size={20} /> Download Image
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="p-5 md:p-6 bg-[#0f0f15]">
                                <form onSubmit={handleGenerate} className="relative">
                                    <div className="relative flex flex-col md:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="A neon cat in space..."
                                            className="flex-1 bg-[#1A1A24] text-white px-5 py-4 rounded-xl border border-white/10 focus:border-brand-primary/50 outline-none placeholder:text-slate-600 focus:bg-[#20202C] transition-all"
                                            disabled={isGenerating}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isGenerating || !prompt.trim()}
                                            className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none whitespace-nowrap flex items-center justify-center gap-2"
                                        >
                                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                            <span className="hidden md:inline">Generate</span>
                                        </button>
                                    </div>
                                    {error && (
                                        <p className="absolute -bottom-6 left-2 text-red-400 text-xs font-medium flex items-center gap-1">
                                            {error}
                                        </p>
                                    )}
                                </form>

                                <div className="mt-6 flex items-center justify-between text-xs font-medium">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        Credits:
                                        <span className="text-white px-2 py-0.5 rounded bg-white/10">
                                            Testing: Unlimited
                                        </span>
                                    </div>
                                    <div className="text-slate-600">
                                        Powered by Nano Banana Pro
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
