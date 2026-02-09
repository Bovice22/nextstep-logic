"use client";

import { useState } from 'react';
import { Send, Image as ImageIcon, Sparkles, Download, Loader2, RefreshCw } from 'lucide-react';
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
                    throw new Error("Daily limit reached! Come back tomorrow for more.");
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
        <div className="min-h-screen bg-[#050510] text-slate-200 selection:bg-brand-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-secondary mb-4">
                        <Sparkles size={14} />
                        <span>AI Powered Creative Suite</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-500">Image Creator</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Turn your words into stunning visuals in seconds. Perfect for social posts, mockups, or finding inspiration.
                    </p>
                </div>

                {/* Generator Interface */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                        {/* Image Display Area */}
                        <div className="aspect-video w-full bg-[#0a0a0a] relative group flex items-center justify-center overflow-hidden border-b border-white/5">
                            {!generatedImage && !isGenerating && (
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                                        <ImageIcon size={40} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                                    </div>
                                    <p className="text-slate-500 max-w-sm mx-auto">
                                        Your masterpiece will appear here. Try describing a scene, a character, or a style.
                                    </p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                                    <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-brand-primary font-mono text-sm tracking-widest animate-pulse">GENERATING...</p>
                                </div>
                            )}

                            {generatedImage && (
                                <div className="relative w-full h-full">
                                    <img
                                        src={`data:image/png;base64,${generatedImage}`}
                                        alt={prompt}
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`data:image/png;base64,${generatedImage}`}
                                            download={`generated-image-${Date.now()}.png`}
                                            className="p-3 bg-black/70 hover:bg-black/90 text-white rounded-xl backdrop-blur-md transition-all hover:scale-105 border border-white/10"
                                            title="Download"
                                        >
                                            <Download size={20} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-6 md:p-8 bg-[#0f0f15]">
                            <form onSubmit={handleGenerate} className="relative">
                                <div className="relative flex items-center gap-3">
                                    <div className="relative flex-1 group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                        <input
                                            type="text"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="A futuristic cyberpunk city with neon rain..."
                                            className="relative w-full bg-[#151520] text-white px-6 py-5 rounded-xl border border-white/10 focus:border-white/20 outline-none placeholder:text-slate-600 shadow-xl transition-all"
                                            disabled={isGenerating}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isGenerating || !prompt.trim()}
                                        className="relative group bg-white text-black font-bold h-[64px] px-8 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                        <span className="hidden md:inline">Generate</span>
                                    </button>
                                </div>
                                {error && (
                                    <p className="absolute -bottom-8 left-2 text-red-400 text-sm flex items-center gap-1">
                                        ⚠️ {error}
                                    </p>
                                )}
                            </form>

                            {/* Footer / Credits */}
                            <div className="mt-8 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-6">
                                <div className="flex items-center gap-2">
                                    {remaining !== null ? (
                                        <span className={cn("font-mono px-2 py-1 rounded bg-white/5", remaining === 0 ? "text-red-400" : "text-green-400")}>
                                            {remaining} / 5 Daily Credits
                                        </span>
                                    ) : (
                                        <span className="font-mono px-2 py-1 rounded bg-white/5">Free Daily Limit: 5</span>
                                    )}
                                </div>
                                <div>
                                    Powered by <span className="text-slate-400">Google Imagen</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
