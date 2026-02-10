"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Loader2, Sparkles, Settings } from "lucide-react";

// Types for Web Speech API (since they aren't in default TS types yet)
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

export default function VoiceAIPage() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    const transcriptRef = useRef("");

    const shouldContinueRef = useRef(false);

    // Sync state to ref to avoid stale closures
    useEffect(() => {
        selectedVoiceRef.current = selectedVoice;
    }, [selectedVoice]);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current!.continuous = false;
            recognitionRef.current!.interimResults = true;
            recognitionRef.current!.lang = "en-US";

            recognitionRef.current!.onresult = (event: any) => {
                let finalTranscript = "";
                let interimTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                const currentTranscript = finalTranscript || interimTranscript;
                setTranscript(currentTranscript);
                transcriptRef.current = currentTranscript; // Keep ref in sync
            };

            recognitionRef.current!.onend = () => {
                setIsListening(false);
                // Trigger backend once they stop speaking, using the ref to get latest value
                if (transcriptRef.current.trim()) {
                    handleSendMessage(transcriptRef.current);
                } else if (shouldContinueRef.current) {
                    // If they didn't say anything but loop is active, maybe restart? 
                    // For now, let's stop to avoid infinite silence loops, or we could just restart.
                    // A better UX might be to stop if no input, but let's stick to the request "continues listening".
                    // However, silence causing loops is bad. Let's start listening again only if we had a response.
                    // Actually, if onend fires with empty result, it usually means silence timeout.
                    // Let's set shouldContinue to false to be safe, or just let it die.
                    // Ideally, we only restart AFTER the AI Speaks.
                }
            };

            recognitionRef.current!.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                if (event.error !== 'no-speech') {
                    setError(`Speech recognition error: ${event.error}`);
                }
                setIsListening(false);
                shouldContinueRef.current = false; // Stop loop on error
            };
        }

        // Initialize Speech Synthesis
        synthRef.current = window.speechSynthesis;

        // Load voices and set listener for voices changed (crucial for some browsers)
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();

            // Smart Filter: Only show "Human-sounding" voices
            // Removed Daniel/Samantha per user request
            const highQualityKeywords = ["Google", "Premium", "Enhanced", "Natural", "Ava", "Evan", "Online"];
            const filteredVoices = allVoices.filter(v =>
                v.lang.startsWith("en") && // English only for now
                highQualityKeywords.some(keyword => v.name.includes(keyword)) &&
                !v.name.includes("Compress") // Exclude compressed/low-bitrate versions if any
            );

            // If we filtered too aggressively and have nothing, fall back to all English voices
            const finalVoices = filteredVoices.length > 0 ? filteredVoices : allVoices.filter(v => v.lang.startsWith("en"));

            setVoices(finalVoices);

            // Set default voice if not already set
            if (finalVoices.length > 0) {
                // Priority: Google US English > Google > Natural
                const preferredNames = ["Google US English", "Google", "Natural"];
                const defaultVoice = finalVoices.find(v => preferredNames.some(name => v.name.includes(name)))
                    || finalVoices[0];

                const voiceToSet = defaultVoice || null;
                setSelectedVoice(prev => prev || voiceToSet);
                // We also update the ref immediately here if it's null
                if (!selectedVoiceRef.current) selectedVoiceRef.current = voiceToSet;
            }
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []); // Empty dependency array to initialization only once

    const startListening = () => {
        setError(null);
        setTranscript("");
        transcriptRef.current = "";
        setResponse("");

        // Cancel any ongoing speech
        if (synthRef.current) synthRef.current.cancel();
        setIsSpeaking(false);

        try {
            recognitionRef.current?.start();
            setIsListening(true);
            shouldContinueRef.current = true; // Enable loop
        } catch (e) {
            console.error("Start Error:", e);
            setIsListening(false);
            shouldContinueRef.current = false;
        }
    }

    const stopListening = () => {
        shouldContinueRef.current = false; // Disable loop
        recognitionRef.current?.stop();
        setIsListening(false);
    }

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleSendMessage = async (message: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/tools/voice-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            if (data.response) {
                setResponse(data.response);
                // Try to play native audio if returned
                speak(data.response, data.audio);
            } else {
                setError(data.error || "Failed to get response");
                shouldContinueRef.current = false; // Stop loop on error
            }
        } catch (err) {
            setError("Network error. Please try again.");
            shouldContinueRef.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    const speak = async (text: string, audioBase64?: string) => {
        // Ensure loop is active (unless stopped elsewhere)
        if (!isListening) shouldContinueRef.current = true;

        if (audioBase64) {
            try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const binaryString = window.atob(audioBase64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                source.onended = () => {
                    setIsSpeaking(false);
                    audioCtx.close();
                    // AUTO-RESTART LISTENING
                    if (shouldContinueRef.current) {
                        setTimeout(() => startListening(), 500); // Small delay for UX
                    }
                };
                setIsSpeaking(true);
                source.start(0);
                return;
            } catch (err) {
                console.error("Native audio error:", err);
            }
        }

        if (!synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            // AUTO-RESTART LISTENING
            if (shouldContinueRef.current) {
                setTimeout(() => startListening(), 500); // Small delay for UX
            }
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            shouldContinueRef.current = false;
        };

        // Priority 1: Use the Ref (most up to date)
        if (selectedVoiceRef.current) {
            utterance.voice = selectedVoiceRef.current;
        } else {
            // Fallback: Try to find a good voice
            const preferredNames = ["Google", "Natural", "Enhanced", "Premium", "Daniel", "Samantha"];
            const voice = voices.find(v => preferredNames.some(name => v.name.includes(name))) || voices[0];
            if (voice) utterance.voice = voice;
        }

        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        synthRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        shouldContinueRef.current = false; // Kill the loop
        synthRef.current?.cancel();
        setIsSpeaking(false);
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
                            Experience the next evolution of conversation. Talk naturally to <span className="text-white font-semibold">NextVoice</span>—our Gemini 2.0 Flash powered AI. Zero latency, human-like understanding, and absolute privacy.
                        </p>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-bold text-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                REAL-TIME AUDIO
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                                GEMINI 2.0 FLASH
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
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${isListening ? "bg-emerald-500/30 animate-pulse w-[450px] h-[450px] md:w-[600px] md:h-[600px]" :
                                isSpeaking ? "bg-blue-500/30 animate-pulse w-[400px] h-[400px] md:w-[550px] md:h-[550px]" :
                                    "bg-emerald-500/10 w-[350px] h-[350px] md:w-[500px] md:h-[500px]"
                                }`}></div>

                            {/* Main Interaction Button/Circle */}
                            <button
                                onClick={toggleListening}
                                disabled={isLoading}
                                className={`relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 overflow-hidden cursor-pointer z-20 ${isListening ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_100px_-10px_rgba(16,185,129,0.5)] scale-105" :
                                    isSpeaking ? "bg-blue-500/20 border-blue-400 shadow-[0_0_100px_-10px_rgba(59,130,246,0.5)]" :
                                        "bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_50px_-5px_rgba(16,185,129,0.2)]"
                                    }`}
                            >
                                {/* Waveform Animation */}
                                {(isListening || isSpeaking) && (
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-50 px-16">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-3 bg-white rounded-full animate-waveform shadow-lg`}
                                                style={{
                                                    height: '20%',
                                                    animationDelay: `${i * 0.1}s`,
                                                    backgroundColor: isListening ? '#34d399' : '#60a5fa'
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    {isLoading ? (
                                        <Loader2 size={80} className="animate-spin text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
                                    ) : isListening ? (
                                        <MicOff size={80} className="text-white drop-shadow-xl" />
                                    ) : (
                                        <Mic size={80} className="text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.6)]" />
                                    )}
                                    <span className="text-base font-bold uppercase tracking-[0.2em] text-slate-300 drop-shadow-lg">
                                        {isLoading ? "Thinking..." : isListening ? "Listening..." : "Tap to Speak"}
                                    </span>
                                </div>
                            </button>

                            {/* Voice Selector - Centered Below Orb */}
                            <div className="relative z-30 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
                                <div className="relative group/voice inline-block">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur opacity-0 group-hover/voice:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:border-emerald-500/30 transition-colors">
                                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                            <Settings size={12} /> Voice
                                        </label>
                                        <div className="h-4 w-px bg-white/10"></div>
                                        <select
                                            className="bg-transparent text-sm font-medium text-slate-200 border-none outline-none cursor-pointer appearance-none min-w-[120px] text-center hover:text-white"
                                            value={selectedVoice?.name || ""}
                                            onChange={(e) => {
                                                const voice = voices.find(v => v.name === e.target.value);
                                                if (voice) {
                                                    setSelectedVoice(voice);
                                                    selectedVoiceRef.current = voice;
                                                }
                                            }}
                                        >
                                            {voices.filter(v => v.lang.startsWith("en")).map(v => (
                                                <option key={v.name} value={v.name} className="bg-slate-900 text-white py-2">
                                                    {v.name.replace(/Google |English |Microsoft /g, "")}
                                                </option>
                                            ))}
                                            {voices.length === 0 && <option>Loading...</option>}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            {isSpeaking && (
                                <button
                                    onClick={stopSpeaking}
                                    className="absolute -right-4 top-0 lg:-right-12 lg:top-1/2 lg:-translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full border border-white/20 backdrop-blur-xl transition-all animate-in fade-in zoom-in"
                                    title="Stop AI Speaking"
                                >
                                    <VolumeX size={24} className="text-blue-400" />
                                </button>
                            )}
                        </div>

                        {/* Transcript/Response - Below Orb */}
                        <div className="w-full max-w-lg min-h-[100px] flex flex-col items-center justify-start gap-4 z-20">
                            {transcript && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-xl md:text-2xl text-white font-medium text-center drop-shadow-lg selection:bg-emerald-500/30 italic opacity-80">
                                        "{transcript}"
                                    </p>
                                </div>
                            )}

                            {response && !isListening && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors w-full">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Sparkles size={14} className="text-emerald-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">AI Response</span>
                                    </div>
                                    <p className="text-base md:text-lg text-slate-200 leading-relaxed text-center">
                                        {response}
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
