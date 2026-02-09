
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    console.log(">>> DEMO CHAT API HIT <<<");
    try {
        const json = await req.json();
        const { messages, context: bodyContext } = json;

        // Context Detection via Header
        const headerContext = req.headers.get('X-Demo-Context');
        let context = bodyContext;

        if (headerContext) {
            try {
                context = decodeURIComponent(headerContext);
            } catch (e) {
                console.error("Failed to decode header context:", e);
            }
        }

        console.log("!!! DEMO ROUTE HIT !!!");
        console.log("HEADERS:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
        console.log(">>> DEMO API REQUEST DEBUG <<<");
        if (context) console.log("Context Detected (Length: " + context.length + ")");
        console.log("-----------------------------------------");

        // STRICT DEMO PROMPT
        const demoSystemPrompt = `You are a helpful, professional customer support agent.
            
CONTEXT DATA:
${context || "No context provided. Answer based on the history if available, else ask for details."}

INSTRUCTIONS:
1. Answer questions based ONLY on the Context Data above.
2. If the answer is not in the data, apologize and say you don't have that information.
3. Do NOT mention you are an AI unless necessary.
4. Do NOT mention "NextStep Logic". You are representing the company in the context.`;

        // Sanitize
        const sanitizedMessages = messages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : (m.parts?.map((p: any) => p.text).join('\n') || "")
        }));

        const result = streamText({
            model: google('gemini-flash-latest'),
            messages: sanitizedMessages,
            system: demoSystemPrompt,
        });

        return result.toUIMessageStreamResponse();

    } catch (error: any) {
        console.error("Error in DEMO chat API:", error);
        return NextResponse.json(
            { error: 'An error occurred processing your request.' },
            { status: 500 }
        );
    }
}
