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
                { error: 'Daily limit reached (5/5). Come back tomorrow!' },
                { status: 429 }
            );
        }

        // ---------------------------------------------------------
        // Generate Image (Dual Strategy: Google -> Fallback)
        // ---------------------------------------------------------
        let base64Image: string | undefined;

        try {
            // STRATEGY 1: Try Google Imagen 3 (Paid/Preview Tier)
            // Note: This requires the specific model to be enabled on the API key.
            const { image } = await experimental_generateImage({
                model: google.image('imagen-3.0-generate-001'),
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                aspectRatio: '1:1',
            });
            base64Image = image.base64;
            console.log("Generated with Google Imagen 3");

        } catch (googleError: any) {
            console.warn("Google Imagen failed (likely private preview restriction), falling back to Pollinations:", googleError.message);

            // STRATEGY 2: Fallback to Pollinations.ai (Free - Flux/SD)
            const encodedPrompt = encodeURIComponent(prompt + " high quality, detailed, 8k, vibrant");
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

            const imageRes = await fetch(imageUrl);
            if (!imageRes.ok) {
                throw new Error(`Fallback generation failed: ${imageRes.statusText}`);
            }

            const arrayBuffer = await imageRes.arrayBuffer();
            base64Image = Buffer.from(arrayBuffer).toString('base64');
        }

        if (!base64Image) {
            throw new Error("Failed to generate image with any provider.");
        }

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
            image: base64Image,
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
