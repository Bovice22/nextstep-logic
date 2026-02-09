
// Timestamp: 2026-02-08 13:28
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { systemPrompt } from '../../knowledge';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    console.log(">>> MAIN CHAT API HIT <<<");
    try {
        const json = await req.json();
        const { messages, context: bodyContext } = json;

        console.log("JSON KEYS:", Object.keys(json));
        console.log("MESSAGES COUNT:", messages?.length);
        console.log("BODY CONTEXT LENGTH:", bodyContext?.length || 0);

        const origin = req.headers.get('origin');
        const referer = req.headers.get('referer');

        console.log("!!! MAIN ROUTE HIT !!!");
        console.log("Origin:", origin);
        console.log("Referer:", referer);
        console.log("HEADERS:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));

        // Sanitize messages for AI SDK Core
        const sanitizedMessages = messages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : (m.parts?.map((p: any) => p.text).join('\n') || "")
        }));

        // Context Detection via Header (priority)
        const headerContext = req.headers.get('X-Demo-Context');
        let context = bodyContext;

        if (headerContext) {
            try {
                context = decodeURIComponent(headerContext);
            } catch (e) {
                console.error("Failed to decode header context:", e);
            }
        }

        // ROBUST CONTEXT DETECTION
        let isDemoContext = false;

        // Strategy 1: Explicit Context (Header or Body)
        if (context && typeof context === 'string' && context.length > 0) {
            isDemoContext = true;
        }

        // Strategy 2: Referer-based Detection (Safety Net for tool page)
        if (!isDemoContext && referer && referer.includes('/tools/chatbot')) {
            console.log(">>> REFERER-BASED DEMO MODE ACTIVATED <<<");
            isDemoContext = true;
        }

        // Strategy 3: Message Inspection & Extraction (The "Antigravity" fallback)
        const contextMarker = "Here is the context about my company:";
        const questionMarker = "\n\nMy first question: ";
        if (sanitizedMessages.length > 0) {
            const firstMsgContent = sanitizedMessages[0].content || "";
            if (firstMsgContent.includes(contextMarker)) {
                console.log(">>> EXTRACTING CONTEXT FROM MESSAGE 0 <<<");
                isDemoContext = true;

                const contextPart = firstMsgContent.split(contextMarker)[1] || "";
                const splitQuestion = contextPart.split(questionMarker);

                // Set the context
                context = splitQuestion[0]?.trim() || context;
                console.log("Extraction Success! Length:", context?.length);

                // CRITICAL: Scrub the context from the message so the AI ONLY sees the question
                if (splitQuestion.length > 1) {
                    sanitizedMessages[0].content = splitQuestion[1].trim();
                } else {
                    sanitizedMessages[0].content = "Hi"; // Fallback if split fails
                }
                console.log("Scrubbed Message 0 Content:", sanitizedMessages[0].content);
            }
        }

        console.log("Is Demo Mode:", isDemoContext);

        let activeSystemPrompt = systemPrompt;

        if (isDemoContext) {
            // STRICT DEMO PROMPT
            activeSystemPrompt = `You are a helpful customer support agent.
            
CONTEXT DATA:
${context || "The user is on the chatbot creation tool. Answer based on their business if provided, else help with general chatbot setup."}

STRICT RULES:
1. Answer based ONLY on the Context Data above.
2. DO NOT mention NextStep Logic.
3. DO NOT mention you are an AI from NextStep.
4. You are the official assistant for the business described in the context.
5. Provide helpful, concise answers.`;
        }

        const result = streamText({
            model: google('gemini-flash-latest'),
            messages: sanitizedMessages,
            system: activeSystemPrompt,
        });

        return result.toUIMessageStreamResponse();

    } catch (error: any) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: 'An error occurred processing your request.' },
            { status: 500 }
        );
    }
}
