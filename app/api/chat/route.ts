import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { systemPrompt } from '../../knowledge';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const result = streamText({
            model: google('gemini-flash-latest'),
            messages: await convertToModelMessages(messages),
            system: systemPrompt,
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error("Error in chat API:", error);
        return new Response(JSON.stringify({ error: 'An error occurred processing your request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
