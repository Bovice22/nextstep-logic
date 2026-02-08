'use client';

import { useState } from 'react';
import { Loader2, ArrowRight, Mail, CheckCircle, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EmailToolPage() {
    const [content, setContent] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/tools/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Failed to analyze email", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background-dark pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-4">
                        <Mail size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Inbox <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-pink">Intelligence</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Paste a messy email thread below. AI will instantly summarize it, extract action items, and write a reply for you.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-surface-dark border border-white/10 rounded-3xl p-1 shadow-2xl">
                    <form onSubmit={handleSubmit} className="bg-black/20 rounded-[22px] p-6 md:p-8 space-y-6">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your email thread here..."
                            className="w-full h-64 bg-transparent border-0 focus:ring-0 text-slate-200 placeholder:text-slate-600 resize-none text-lg leading-relaxed"
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || !content.trim()}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Analyze Email <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* BLUF & Actions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-surface-dark border border-white/10 rounded-3xl p-6 md:p-8">
                                <h3 className="text-accent-cyan font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} /> BLUF (Bottom Line)
                                </h3>
                                <p className="text-slate-300 text-lg leading-relaxed">{result.bluf}</p>
                            </div>

                            <div className="bg-surface-dark border border-white/10 rounded-3xl p-6 md:p-8">
                                <h3 className="text-accent-pink font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} /> Action Items
                                </h3>
                                <ul className="space-y-3">
                                    {result.action_items.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-pink flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Draft Reply */}
                        <div className="bg-surface-dark border border-white/10 rounded-3xl p-6 md:p-8 relative group">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-primary font-bold flex items-center gap-2">
                                    <Mail size={20} /> Draft Reply
                                </h3>
                                <button
                                    onClick={() => copyToClipboard(result.draft_reply)}
                                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                                >
                                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copied ? "Copied!" : "Copy Text"}
                                </button>
                            </div>
                            <div className="bg-black/30 rounded-xl p-6 text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed border border-white/5">
                                {result.draft_reply}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center pt-8 border-t border-white/10">
                            <p className="text-slate-400 mb-4">Want to connect this directly to your Gmail?</p>
                            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-medium transition-all">
                                Join the Waitlist for Live Sync
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
