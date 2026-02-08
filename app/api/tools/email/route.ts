import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { content } = await req.json();

    if (!content) {
        return new Response(JSON.stringify({ error: 'Content is required' }), { status: 400 });
    }

    try {
        const result = await generateObject({
            model: google('gemini-flash-latest'),
            schema: z.object({
                bluf: z.string().describe('A single sentence "Bottom Line Up Front" summary of the email thread.'),
                action_items: z.array(z.string()).describe('A list of specific action items derived from the email.'),
                draft_reply: z.string().describe('A professional, concise draft reply to the email.'),
            }),
            prompt: `
            You are an expert Executive Assistant.
            Process the following email thread and provide:
            1. A BLUF (Bottom Line Up Front) summary.
            2. A list of clear action items.
            3. A professional draft reply.

            Email Content:
            "${content}"
            `,
        });

        return new Response(JSON.stringify(result.object), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error("Error in email tool:", error);
        return new Response(JSON.stringify({ error: 'Failed to process email.' }), { status: 500 });
    }
}
