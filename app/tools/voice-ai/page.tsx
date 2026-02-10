"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Loader2, Sparkles, Settings } from "lucide-react";
import { useConversation } from "@elevenlabs/react";

// Curated list of voices provided by user
const VOICES = [
    { id: "", name: "Default Agent Voice" }, // Use the agent's configured voice
    { id: "mZ8K1MPRiT5wDQaasg3i", name: "Alexander Kensington" },
    { id: "bm3QvaZ3fUSCRBC3UV1f", name: "Steffy" },
];

export default function VoiceAIPage() {
    // UI State
    const [isListening, setIsListening] = useState(false); // Controls "mic on" UI state
    const [isSpeaking, setIsSpeaking] = useState(false); // Controls "speaker on" UI state
    const [transcript, setTranscript] = useState("Tap to start conversation");
    const [error, setError] = useState<string | null>(null);
    const [selectedVoiceId, setSelectedVoiceId] = useState(VOICES[0].id);

    // ElevenLabs Hook
    const conversation = useConversation({
        onConnect: () => {
            console.log("Connected to ElevenLabs");
            setIsListening(true);
            setError(null);
            setTranscript("Listening...");
        },
        onDisconnect: () => {
            console.log("Disconnected from ElevenLabs");
            setIsListening(false);
            setIsSpeaking(false);
        },
        onMessage: (message) => {
            console.log("Message received:", message);
            setTranscript(message.message);
        },
        onModeChange: (mode) => {
            console.log("Mode changed:", mode);
            setIsSpeaking(mode.mode === 'speaking');
            setIsListening(mode.mode === 'listening');
        },
        onError: (err) => {
            console.error("ElevenLabs SDK Error:", err);
            const errorMessage = typeof err === 'string' ? err : "Connection error.";
            setError(errorMessage);
            setIsListening(false);
        }
    });

    const toggleListening = async () => {
        if (conversation.status === 'connected') {
            await conversation.endSession();
            setIsListening(false);
        } else {
            try {
                // Get this from: https://elevenlabs.io/app/conversational-ai
                const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_6501kh4gjvbrfx4re8j55ct432he";
                console.log("--------------------------------------------------");
                console.log("USING AGENT ID:", agentId);
                console.log("--------------------------------------------------");

                // 1. Fetch Signed URL from our backend
                // This ensures we have an authenticated session which is required for reliable voice overrides
                const response = await fetch('/api/elevenlabs/sign', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ agentId }),
                });

                if (!response.ok) {
                    const errText = await response.text();
                    console.error("Signed URL Fetch Failed:", errText);
                    throw new Error(`Failed to get signed URL: ${errText}`);
                }

                const { signedUrl } = await response.json();
                console.log("Got signed URL successfully");

                // 2. Prepare session config with the Signed URL
                // We do NOT pass agentId when using signedUrl usually, or it's redundant.
                // But we DO pass the overrides.
                const sessionConfig: any = {
                    // signedUrl replaces agentId for authentication
                    signedUrl: signedUrl,
                    // Explicitly set connection type if needed, or let SDK handle it.
                    // connectionType: "websocket", 
                };

                // Only apply override if a specific voice is selected (not default)
                if (selectedVoiceId) {
                    console.log("Applying voice override:", selectedVoiceId);
                    sessionConfig.overrides = {
                        tts: {
                            voiceId: selectedVoiceId,
                            // FORCE to Turbo v2.5 to ensure compatibility with most voices
                            modelId: "eleven_turbo_v2_5"
                        },
                    };
                }

                console.log("Session Config:", JSON.stringify(sessionConfig, null, 2));

                // 3. Start the session
                await conversation.startSession(sessionConfig);
            } catch (err) {
                console.error("Failed to start session:", err);
                setError("Failed to start session");
                setIsListening(false);
            }
        }
    };

    // Helper to stop speaking (ElevenLabs handles this mostly automatically, but for manual override)
    const stopSpeaking = () => {
        // Ending session stops everything
        conversation.endSession();
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#020617] text-white flex flex-col justify-center overflow-hidden relative selection:bg-emerald-500/30">
            {/* Background Vibrancy */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000 ${isListening ? "bg-emerald-500/20 scale-110" :
                    isSpeaking ? "bg-blue-500/20 scale-110" :
                        "bg-emerald-900/10 scale-100"
                    }`}></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-6 md:py-0">
                {/* Header - Mobile Only */}
                <div className="md:hidden flex items-center justify-between mb-8">
                    <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

                    {/* Left Column: Hero Text & Description */}
                    <div className="text-center lg:text-left mb-12 lg:mb-0 relative z-20">
                        {/* Header - Desktop Only */}
                        <div className="hidden md:flex items-center gap-4 mb-8">
                            <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back
                            </Link>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-400 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                            <Sparkles size={16} className="animate-pulse" />
                            <span className="font-bold tracking-wide uppercase text-xs">Live Voice Intelligence</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                            Speak your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 animate-gradient-x">
                                NextVoice.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            Experience the next evolution of conversation. Talk naturally to <span className="text-white font-semibold">NextVoice</span>—powered by ElevenLabs Conversational AI. Zero latency, human-like understanding, and absolute privacy.
                        </p>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-bold text-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                REAL-TIME AUDIO
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                                ELEVENLABS AI
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                                NEURAL VOICE ENGINE
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interaction Orb */}
                    <div className="w-full flex flex-col items-center justify-center relative">

                        <div className="relative group mb-8 flex flex-col items-center gap-12">
                            {/* Glowing Rings */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${conversation.status === 'connected' ? "bg-emerald-500/30 animate-pulse w-[450px] h-[450px] md:w-[600px] md:h-[600px]" :
                                isSpeaking ? "bg-blue-500/30 animate-pulse w-[400px] h-[400px] md:w-[550px] md:h-[550px]" :
                                    "bg-emerald-500/10 w-[350px] h-[350px] md:w-[500px] md:h-[500px]"
                                }`}></div>

                            {/* Main Interaction Button/Circle */}
                            <button
                                onClick={toggleListening}
                                disabled={conversation.status === 'connecting'}
                                className={`relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 overflow-hidden cursor-pointer z-20 ${conversation.status === 'connected' ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_100px_-10px_rgba(16,185,129,0.5)] scale-105" :
                                    isSpeaking ? "bg-blue-500/20 border-blue-400 shadow-[0_0_100px_-10px_rgba(59,130,246,0.5)]" :
                                        "bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_50px_-5px_rgba(16,185,129,0.2)]"
                                    }`}
                            >
                                {/* Waveform Animation */}
                                {(conversation.status === 'connected' || isSpeaking) && (
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-50 px-16">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-3 bg-white rounded-full animate-waveform shadow-lg`}
                                                style={{
                                                    height: '20%',
                                                    animationDelay: `${i * 0.1}s`,
                                                    backgroundColor: conversation.status === 'connected' ? '#34d399' : '#60a5fa'
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    {conversation.status === 'connecting' ? (
                                        <Loader2 size={80} className="animate-spin text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
                                    ) : conversation.status === 'connected' ? (
                                        <MicOff size={80} className="text-white drop-shadow-xl" />
                                    ) : (
                                        <Mic size={80} className="text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.6)]" />
                                    )}
                                    <span className="text-base font-bold uppercase tracking-[0.2em] text-slate-300 drop-shadow-lg">
                                        {conversation.status === 'connecting' ? "Connecting..." : conversation.status === 'connected' ? "Stop Conversation" : "Start Conversation"}
                                    </span>
                                </div>
                            </button>

                            {/* Voice Selector - Centered Below Orb */}
                            {conversation.status !== 'connected' && (
                                <div className="relative z-30 animate-in fade-in slide-in-from-top-4 duration-500 delay-100 mb-8">
                                    <div className="relative group/voice inline-block">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur opacity-0 group-hover/voice:opacity-100 transition-opacity"></div>
                                        <div className="relative flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:border-emerald-500/30 transition-colors">
                                            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                                <Settings size={12} /> Voice
                                            </label>
                                            <div className="h-4 w-px bg-white/10"></div>
                                            <select
                                                className="bg-transparent text-sm font-medium text-slate-200 border-none outline-none cursor-pointer appearance-none min-w-[200px] text-center hover:text-white"
                                                value={selectedVoiceId}
                                                onChange={(e) => setSelectedVoiceId(e.target.value)}
                                            >
                                                {VOICES.map(v => (
                                                    <option key={v.id} value={v.id} className="bg-slate-900 text-white py-2">
                                                        {v.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transcript/Response - Below Orb */}
                            <div className="w-full max-w-lg min-h-[100px] flex flex-col items-center justify-start gap-4 z-20">
                                {transcript && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <p className="text-xl md:text-2xl text-white font-medium text-center drop-shadow-lg selection:bg-emerald-500/30 italic opacity-80">
                                            "{transcript}"
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <div className="text-red-400 text-sm font-medium bg-red-950/50 px-6 py-3 rounded-full border border-red-500/30 backdrop-blur-sm animate-in fade-in zoom-in">
                                        {error}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes waveform {
                    0%, 100% { height: 20%; }
                    50% { height: 70%; }
                }
                .animate-waveform {
                    animation: waveform 0.6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
