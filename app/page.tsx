
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="relative w-32 h-10">
                                <Image
                                    src="/All White.png"
                                    alt="NextStep Logic Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="#problem" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">The Problem</Link>
                            <Link href="#services" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Services</Link>
                            <Link href="#how-it-works" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">How It Works</Link>
                            <Link href="#who-we-help" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Who We Help</Link>
                        </nav>

                        {/* CTA */}
                        <div className="flex items-center gap-4">
                            <Link href="#contact" className="hidden md:flex bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(56,56,250,0.4)] border border-primary/50">
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
                        <Link href="#problem" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>The Problem</Link>
                        <Link href="#services" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Services</Link>
                        <Link href="#how-it-works" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                        <Link href="#who-we-help" className="text-slate-300 hover:text-white text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Who We Help</Link>
                        <Link href="#contact" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                            Schedule Consultation
                        </Link>
                    </div>
                )}
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-hero-glow opacity-60 pointer-events-none"></div>
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            {/* Text Content */}
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                                    AI Automation That Helps Your Business <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent-pink neon-text">Run Better.</span>
                                </h1>
                                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    NextStep Logic builds intelligent systems that automate repetitive work, respond to customers instantly, and help small businesses grow without adding overhead.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link href="#contact" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-[0_0_30px_rgba(56,56,250,0.6)] hover:shadow-[0_0_50px_rgba(56,56,250,0.8)] transition-all transform hover:-translate-y-1 relative overflow-hidden group text-center flex items-center justify-center">
                                        Schedule a Consultation
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Content */}
                            <div className="flex-1 w-full max-w-[600px] lg:max-w-none perspective-1000">
                                <div className="relative w-full aspect-square lg:aspect-[4/3]">
                                    {/* Main Glass Card */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-surface-dark to-[#1a1a3a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                                        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-black/20">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="p-6 flex-1 relative flex items-center justify-center">
                                            <div className="text-center">
                                                <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-pulse-blue">smart_toy</span>
                                                <div className="text-white font-bold text-xl">System Active</div>
                                                <div className="text-slate-400 text-sm mt-2">Automating workflows...</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Floating Card 1 */}
                                    <div className="absolute -bottom-6 -left-6 bg-surface-dark/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl w-48 animate-bounce" style={{ animationDuration: '3s' }}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                                                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-bold">Efficiency</div>
                                                <div className="text-green-400 text-xs font-bold">+245%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Problem & About Section */}
                <section id="problem" className="py-24 bg-surface-dark border-y border-white/5 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="uppercase tracking-wider text-accent-pink font-bold text-sm mb-4">The Problem</div>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Buried in manual work?</h2>
                                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                    Most small businesses lose time and revenue to repetitive tasks, missed inquiries, and disconnected systems. Hiring more staff isn’t always the answer — better systems are.
                                </p>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    NextStep Logic helps businesses eliminate unnecessary manual work and create smarter workflows that run automatically in the background.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                                <div className="uppercase tracking-wider text-primary font-bold text-sm mb-4">Our Positioning</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Practical AI, Not Hype.</h3>
                                <p className="text-slate-400 mb-6">
                                    NextStep Logic helps small businesses improve operations through practical AI and automation. We design systems that reduce manual work, improve response time, and connect the tools your business already uses.
                                </p>
                                <p className="text-slate-400">
                                    Our focus is simple: build solutions that save time, capture more opportunities, and make day-to-day operations easier to manage.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Do (Services) */}
                <section id="services" className="py-24 relative">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What We Do</h2>
                            <p className="text-lg text-slate-300">Intelligent systems that handle the heavy lifting.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="group bg-surface-dark border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(56,56,250,0.15)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-3xl">mark_chat_unread</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Capture More Customers</h3>
                                <p className="text-slate-400 mb-4">AI-powered systems respond instantly to inquiries, answer common questions, and guide customers toward booking or buying.</p>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>AI website assistants</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Automated lead responses</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Booking and inquiry automation</li>
                                </ul>
                            </div>

                            {/* Feature 2 */}
                            <div className="group bg-surface-dark border border-white/10 p-8 rounded-2xl hover:border-accent-pink/50 transition-all hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-accent-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-14 h-14 bg-accent-pink/10 rounded-xl flex items-center justify-center text-accent-pink mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-3xl">settings_motion_mode</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Automate Daily Work</h3>
                                <p className="text-slate-400 mb-4">We reduce repetitive administrative tasks by connecting systems and automating workflows.</p>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-pink rounded-full"></span>Workflow automation</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-pink rounded-full"></span>System integrations</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-pink rounded-full"></span>Scheduling automation</li>
                                </ul>
                            </div>

                            {/* Feature 3 */}
                            <div className="group bg-surface-dark border border-white/10 p-8 rounded-2xl hover:border-accent-cyan/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-14 h-14 bg-accent-cyan/10 rounded-xl flex items-center justify-center text-accent-cyan mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-3xl">monitoring</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Understand Your Business</h3>
                                <p className="text-slate-400 mb-4">AI-generated insights help business owners understand performance without digging through data.</p>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></span>Automated reports</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></span>Business performance summaries</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></span>Operational insights</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-24 bg-surface-dark/50 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>

                            {/* Step 1 */}
                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-surface-dark border-2 border-primary text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(56,56,250,0.3)]">1</div>
                                <h3 className="text-xl font-bold text-white mb-2">Analysis</h3>
                                <p className="text-slate-400">We learn how your business operates and identify time-wasting processes.</p>
                            </div>
                            {/* Step 2 */}
                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-surface-dark border-2 border-accent-pink text-accent-pink flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(244,63,94,0.3)]">2</div>
                                <h3 className="text-xl font-bold text-white mb-2">Strategy</h3>
                                <p className="text-slate-400">We identify missed opportunities and design custom workflows.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-surface-dark border-2 border-accent-cyan text-accent-cyan flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">3</div>
                                <h3 className="text-xl font-bold text-white mb-2">Build</h3>
                                <p className="text-slate-400">We build intelligent systems that run automatically.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who We Help */}
                <section id="who-we-help" className="py-24 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Who It's For</h2>
                                <p className="text-lg text-slate-300 mb-8">NextStep Logic works with service-based and locally operated businesses looking to operate more efficiently.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-primary">check_circle</span> Event venues
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-primary">check_circle</span> Contractors & Services
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-primary">check_circle</span> Retail businesses
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-primary">check_circle</span> Coworking spaces
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-primary">check_circle</span> Hospitality & Entertainment
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-primary">check_circle</span> Small to mid-sized teams
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-surface-dark to-[#02020a] p-8 rounded-2xl border border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-4">Our Differentiator</h3>
                                <p className="text-slate-300 mb-6 leading-relaxed">
                                    <span className="text-accent-pink font-bold">We don’t sell AI tools.</span> We build practical solutions that solve real operational problems. Every system we build is designed to save time, increase responsiveness, or improve efficiency.
                                </p>
                                <Link href="#contact" className="text-primary font-bold hover:text-white transition-colors flex items-center gap-2 group">
                                    Let's discuss your needs <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="contact" className="relative py-24 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to break <br /><span className="text-primary">speed limit?</span></h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join hundreds of companies that have already transformed their IT infrastructure with NextStep Logic.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-[0_0_40px_rgba(56,56,250,0.5)] hover:bg-primary/90 transition-all hover:scale-105">
                                Schedule a Consultation
                            </button>
                            <a href="mailto:hello@nextsteplogic.com" className="text-white font-medium hover:text-primary transition-colors border-b border-transparent hover:border-primary">Contact Sales</a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#02020a] border-t border-white/10 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="relative w-32 h-10">
                                    <Image
                                        src="/All White.png"
                                        alt="NextStep Logic Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                NextStep Logic helps small businesses automate customer communication, streamline workflows, and operate more efficiently using practical AI solutions.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Platform</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#services" className="hover:text-primary transition-colors">Services</Link></li>
                                <li><Link href="#problem" className="hover:text-primary transition-colors">The Problem</Link></li>
                                <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-600 text-sm">© 2026 NextStep Logic. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
