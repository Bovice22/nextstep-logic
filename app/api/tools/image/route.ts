import { NextRequest, NextResponse } from 'next/server';
import { experimental_generateImage } from 'ai';
import { google } from '@ai-sdk/google';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // ---------------------------------------------------------
        // Rate Limiting (Cookie Based - Simple & Free)
        // ---------------------------------------------------------
        const cookieStore = await cookies();
        const limitCookie = cookieStore.get('nextstep-gen-limit');

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let usage = { count: 0, date: today };

        if (limitCookie) {
            try {
                const parsed = JSON.parse(limitCookie.value);
                if (parsed.date === today) {
                    usage = parsed;
                }
            } catch (e) {
                // Invalid cookie, reset
            }
        }

        if (usage.count >= 5) {
            return NextResponse.json(
                { error: 'Daily limit reached (5/5). Try again tomorrow!' },
                { status: 429 }
            );
        }

        // ---------------------------------------------------------
        // Generate Image (Google Imagen 3 via AI SDK)
        // ---------------------------------------------------------
        // Note: 'imagen-3.0-generate-001' is the model ID for Imagen 3 on Vertex/AI Studio
        // If this specific model ID isn't available on the API key tier yet, we might need to fallback or catch.
        const { image } = await experimental_generateImage({
            model: google.image('imagen-3.0-generate-001'),
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            aspectRatio: '1:1',
        });

        // ---------------------------------------------------------
        // Update Limit & Return
        // ---------------------------------------------------------
        usage.count += 1;
        cookieStore.set('nextstep-gen-limit', JSON.stringify(usage), {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            path: '/',
            httpOnly: true, // Secure, client can't tamper easily
            sameSite: 'strict'
        });

        return NextResponse.json({
            image: image.base64,
            remaining: 5 - usage.count
        });

    } catch (error: any) {
        console.error("Image Generation Error:", error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate image. The AI might be busy.' },
            { status: 500 }
        );
    }
}
