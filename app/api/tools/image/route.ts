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
        // Generate Image (Nano Banana Pro Strategy)
        // ---------------------------------------------------------
        let base64Image: string | undefined;

        try {
            // PRIMARY: Nano Banana Pro (Gemini 3 Pro Image)
            // This is the high-speed, high-quality model for paid tiers.
            const { image } = await experimental_generateImage({
                model: google.image('gemini-3-pro-image-preview'),
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                aspectRatio: '1:1',
            });
            base64Image = image.base64;
            console.log("Successfully generated with Nano Banana Pro (gemini-3-pro-image-preview)");

        } catch (googleError: any) {
            console.warn("Nano Banana Pro failed, attempting fast fallback:", googleError.message);

            // FALLBACK: Pollinations.ai (Flux/SD) - Fast & Free
            // We use this to ensure the user ALWAYS gets an image even if the Google Preview is down.
            const encodedPrompt = encodeURIComponent(prompt + " high quality, detailed, 8k, vibrant");
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

            const imageRes = await fetch(imageUrl);
            if (!imageRes.ok) {
                throw new Error(`Generation failed: ${imageRes.statusText}`);
            }

            const arrayBuffer = await imageRes.arrayBuffer();
            base64Image = Buffer.from(arrayBuffer).toString('base64');
        }

        if (!base64Image) {
            throw new Error("Failed to generate image.");
        }

        // ---------------------------------------------------------
        // Update Limit & Return
        // ---------------------------------------------------------
        usage.count += 1;
        cookieStore.set('nextstep-gen-limit', JSON.stringify(usage), {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            path: '/',
            httpOnly: true,
            sameSite: 'strict'
        });

        return NextResponse.json({
            image: base64Image,
            remaining: 5 - usage.count
        });

    } catch (error: any) {
        console.error("Image Generation Error:", error);
        return NextResponse.json(
            { error: error.message || 'The AI is currently busy. Please try again in a moment.' },
            { status: 500 }
        );
    }
}
