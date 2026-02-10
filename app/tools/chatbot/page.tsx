import Link from "next/link";
import Image from "next/image";
import ChatbotDemoGeneratorV2 from "@/components/ChatbotDemoGeneratorV2";

export default function ChatbotPage() {
    return (
        <div className="min-h-screen bg-background-dark text-white font-sans selection:bg-cyan-500/30 flex flex-col">

            {/* Navbar Placeholder (Managed by Layout/Page wrapper usually, but adding back button for now) */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-white/30">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Home
                </Link>
            </div>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-12 pb-10 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#06b6d4_0%,transparent_60%)] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
                    <div className="absolute bottom-0 left-[-100px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-4 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
                            Now Available in Beta
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 leading-tight">
                            NextChat. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                Zero Human Effort.
                            </span>
                        </h1>

                        <p className="text-base text-slate-300 mb-6 max-w-xl mx-auto leading-relaxed">
                            Automate your customer service with our AI-powered chatbot. It answers FAQs, handles booking inquiries, and captures leads while you sleep.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 animate-fade-in-up">
                            <div className="w-full max-w-3xl transform hover:scale-[1.01] transition-transform duration-500">
                                <ChatbotDemoGeneratorV2 />
                            </div>

                            <p className="text-sm text-slate-500">
                                or <Link href="/#contact" className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">contact sales</Link> for a custom enterprise pilot.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-surface-dark/30 border-y border-white/5 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1">
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                    <span className="material-symbols-outlined text-cyan-400 text-2xl">smart_toy</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">Instant Responses</h3>
                                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    Never miss a potential customer. Our AI responds to inquiries instantly, 24/7, ensuring your clients always feel heard.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(192,132,252,0.15)] hover:-translate-y-1">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <span className="material-symbols-outlined text-purple-400 text-2xl">calendar_month</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Booking Integration</h3>
                                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    Seamlessly integrates with NextSlot. The AI can check availability and guide users directly to your booking page.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] hover:-translate-y-1">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <span className="material-symbols-outlined text-blue-400 text-2xl">menu_book</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Custom Knowledge</h3>
                                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    Train the AI on *your* business. Upload your FAQs, pricing, and policies, and it stays perfectly on-brand.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Live Demo Section */}


            <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5">
                &copy; {new Date().getFullYear()} NextStep Logic. All rights reserved.
            </footer>
        </div>
    );
}
