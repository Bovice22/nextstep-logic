import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Increased timeout for retries

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// The error log showed ONLY gemini-2.0-flash exists (others returned 404).
// So we prioritize it, but we MUST handle the 429 Rate Limit error with retries.
const MODELS_TO_TRY = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b"
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        let responseText = "";
        const errorLog: string[] = [];

        // Try the primary model with robust retries for Rate Limits
        for (const modelName of MODELS_TO_TRY) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent({
                    contents: [{ role: "user", parts: [{ text: message }] }],
                    systemInstruction: `You are a helpful, concise Voice AI. 
                    Keep your responses short (under 2 sentences). 
                    Speak in a friendly, conversational tone.`
                });

                const response = result.response;
                const textPart = response.candidates?.[0].content.parts.find(p => p.text);

                if (textPart?.text) {
                    responseText = textPart.text;
                    console.log(`>>> SUCCESS: Generated response with ${modelName}`);
                    break; // Break loop on success
                }
            } catch (err: any) {
                const isRateLimit = err.message.includes("429") || err.message.includes("Too Many Requests");
                const errorMsg = `Model ${modelName} failed: ${err.message}`;
                console.warn(errorMsg);
                errorLog.push(errorMsg);

                if (isRateLimit) {
                    // If it's a rate limit, don't retry same model - move to next one immediately
                    console.log(`Rate limit hit on ${modelName}. Switching to next model...`);
                    continue;
                } else {
                    // For other errors, we also move to next model
                    continue;
                }
            }
        }

        if (responseText) {
            // Success block moved outside loop
            console.log("Voice AI Response Text:", responseText);

            return NextResponse.json({
                response: responseText,
                audio: null
            });
        }

        if (!responseText) {
            console.error(">>> CRITICAL: All models failed.", errorLog);
            return NextResponse.json(
                {
                    error: `Service Busy (Rate Limit). Please wait a moment and try again.`,
                    details: errorLog
                },
                { status: 503 }
            );
        }

        console.log("Voice AI Response Text:", responseText);

        return NextResponse.json({
            response: responseText,
            audio: null
        });

    } catch (error: any) {
        console.error(">>> VOICE CHAT API FATAL ERROR <<<");
        return NextResponse.json(
            { error: `API Fatal Error: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
