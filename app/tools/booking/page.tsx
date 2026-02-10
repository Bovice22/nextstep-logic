import Link from "next/link";
import BookingDemoGenerator from "@/components/BookingDemoGenerator";

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-background-dark text-white font-sans selection:bg-accent-pink/30 flex flex-col">

            {/* Navbar Placeholder */}
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#f43f5e_0%,transparent_60%)] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl pointer-events-none mx-auto animate-pulse"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent-pink mb-4">
                            <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse"></span>
                            SaaS Booking Suite
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 leading-tight">
                            NextSlot. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-purple-500">
                                Built for Growth.
                            </span>
                        </h1>

                        <p className="text-base text-slate-400 mb-6 max-w-xl mx-auto">
                            The all-in-one platform to manage appointments, payments, and customer records. Branded to your business in seconds.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 animate-fade-in-up">
                            <div className="w-full max-w-3xl transform hover:scale-[1.01] transition-transform duration-500">
                                <BookingDemoGenerator />
                            </div>

                            <p className="text-sm text-slate-500">
                                or <Link href="/#contact" className="text-accent-pink hover:underline">contact sales</Link> for an enterprise custom white-label.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-surface-dark/30 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-pink/50 transition-colors group">
                                <div className="w-12 h-12 bg-accent-pink/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-accent-pink text-2xl">calendar_today</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Live Availability</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Show real-time openings across multiple locations and staff members. syncs instantly with your personal calendar.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-pink/50 transition-colors group">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-purple-400 text-2xl">payments</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Stripe Payments</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Collect deposits or full payments at the time of booking. Integrated with Stripe Terminal for in-person transactions.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-pink/50 transition-colors group">
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-cyan-400 text-2xl">badge</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">White Label</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Your brand, your colors, your fonts. NextSlot disappears so your business takes center stage.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5">
                &copy; {new Date().getFullYear()} NextStep Logic. All rights reserved.
            </footer>
        </div>
    );
}
