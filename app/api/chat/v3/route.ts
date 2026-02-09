
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { systemPrompt } from '../../../knowledge';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    console.log("!!! V3 CHAT API HIT !!!");
    try {
        const json = await req.json();
        console.log("V3 BODY:", JSON.stringify(json, null, 2));
        console.log("V3 HEADERS:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
        const { messages, context: bodyContext } = json;
        const headerContext = req.headers.get('X-Demo-Context');

        let context = bodyContext;
        if (headerContext) {
            try { context = decodeURIComponent(headerContext); } catch (e) { }
        }

        const isDemo = !!(context && context.length > 0);
        console.log("Decision: Is Demo Mode?", isDemo);

        let activePrompt = systemPrompt;
        if (isDemo) {
            activePrompt = `You are a helpful customer support agent.
Answer based ONLY on this context:
${context}

Rules:
1. Do NOT mention NextStep Logic.
2. If not in context, say you don't know.`;
        }

        const sanitizedMessages = messages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : (m.parts?.map((p: any) => p.text).join('\n') || "")
        }));

        const result = streamText({
            model: google('gemini-flash-latest'),
            messages: sanitizedMessages,
            system: activePrompt,
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error("V3 Error:", error);
        return NextResponse.json({ error: 'error' }, { status: 500 });
    }
}
