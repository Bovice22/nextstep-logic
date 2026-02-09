"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<'paid' | 'free' | null>(null);

    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-32 h-10">
                            <Link href="/">
                                <Image
                                    src="/All White.png"
                                    alt="NextStep Logic Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/#problem" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">The Problem</Link>
                        <Link href="/#services" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Services</Link>
                        <Link href="/#how-it-works" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">How It Works</Link>
                        <Link href="/#who-we-help" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Who We Help</Link>
                        <div className="relative group">
                            <button
                                onClick={() => setActiveMenu(activeMenu === 'paid' ? null : 'paid')}
                                onMouseEnter={() => setActiveMenu('paid')}
                                className="text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1 focus:outline-none"
                            >
                                <span className="material-symbols-outlined text-sm text-accent-pink">workspace_premium</span> Paid Tools
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                className={`absolute top-full left-0 mt-2 w-56 rounded-xl bg-surface-dark border border-white/10 shadow-xl overflow-hidden transition-all duration-200 ${activeMenu === 'paid' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <div className="p-1">
                                    <Link href="/tools/booking" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group/item">
                                        <div className="font-semibold text-white group-hover/item:text-accent-pink flex items-center gap-2">
                                            <span className="material-symbols-outlined text-accent-pink">calendar_month</span>
                                            Bookings
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">Automated appointment scheduling</div>
                                    </Link>
                                    <Link href="/tools/chatbot" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group/item">
                                        <div className="font-semibold text-white group-hover/item:text-accent-cyan flex items-center gap-2">
                                            <span className="material-symbols-outlined text-accent-cyan">smart_toy</span>
                                            AI Support Agent
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">24/7 Automated customer service</div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={() => setActiveMenu(activeMenu === 'free' ? null : 'free')}
                                onMouseEnter={() => setActiveMenu('free')}
                                className="text-accent-cyan hover:text-white text-sm font-medium transition-colors flex items-center gap-1 focus:outline-none"
                            >
                                <span className="material-symbols-outlined text-sm">construction</span> Free Tools
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                className={`absolute top-full left-0 mt-2 w-56 rounded-xl bg-surface-dark border border-white/10 shadow-xl overflow-hidden transition-all duration-200 ${activeMenu === 'free' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <div className="p-1">

                                    <Link href="/tools/email" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group/item">
                                        <div className="font-semibold text-white group-hover/item:text-accent-cyan flex items-center gap-2">
                                            <span className="material-symbols-outlined text-accent-cyan">mail</span>
                                            Email Summarizer
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">Quickly summarize long threads</div>
                                    </Link>
                                    <Link href="/tools/image-generator" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group/item">
                                        <div className="font-semibold text-white group-hover/item:text-purple-400 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-purple-400">image</span>
                                            AI Image Creator
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">Generate stunning visuals</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* CTA */}
                    <div className="flex items-center gap-4">
                        <Link href="/#contact" className="hidden md:flex bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(56,56,250,0.4)] border border-primary/50">
                            Schedule Consultation
                        </Link>
                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-slate-300 hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-panel border-b border-white/10 p-4 absolute w-full top-16 left-0 flex flex-col gap-4">
                    <Link href="/#problem" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>The Problem</Link>
                    <Link href="/#services" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Services</Link>
                    <Link href="/#how-it-works" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                    <Link href="/#who-we-help" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Who We Help</Link>
                    <Link href="/tools/email" className="text-accent-cyan hover:text-white text-sm font-medium flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined text-sm">mail</span> Free Tools: Email
                    </Link>
                    <Link href="/tools/image-generator" className="text-purple-400 hover:text-white text-sm font-medium flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined text-sm">image</span> Free Tools: Image Gen
                    </Link>
                    <Link href="/tools/booking" className="text-accent-pink hover:text-white text-sm font-medium flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined text-sm">workspace_premium</span> Paid Tools: Bookings
                    </Link>
                    <Link href="/#contact" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                        Schedule Consultation
                    </Link>
                </div>
            )}
        </header>
    );
}
