import { NextRequest, NextResponse } from 'next/server';
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
        // Generate Image (Nano Banana Pro via direct REST)
        // ---------------------------------------------------------
        let base64Image: string | undefined;

        try {
            const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
            // Trying the standard name for Nano Banana Pro
            const model = "gemini-3-pro-image-preview";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Generate a high-quality image. Prompt: ${prompt}` }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `Google API error: ${response.status}`);
            }

            // Gemini image models return the image as a part in the contents
            // We search for any part containing data with a mimeType starting with 'image'
            const parts = data.candidates?.[0]?.content?.parts;
            if (parts) {
                for (const part of parts) {
                    if (part.inlineData?.mimeType?.startsWith("image/")) {
                        base64Image = part.inlineData.data;
                        console.log(`SUCCESS: Generated image with ${model} (${part.inlineData.mimeType})`);
                        break;
                    }
                }
            }

            if (!base64Image) {
                // Specific error if they gave us text back instead of an image
                const textPart = parts?.find((p: any) => p.text);
                if (textPart) {
                    console.warn("Model returned text instead of image:", textPart.text);
                    throw new Error("The AI returned a text response instead of an image. Quality check failed.");
                }
                throw new Error("No image data found in Nano Banana Pro response.");
            }

        } catch (googleError: any) {
            console.error("Nano Banana Pro Error:", googleError.message);

            // FAST FALLBACK: Pollinations.ai (Flux/SD)
            const encodedPrompt = encodeURIComponent(prompt + " high quality, detailed, 8k, vibrant");
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

            const imageRes = await fetch(imageUrl);
            if (!imageRes.ok) {
                throw new Error(`Generation failed: ${googleError.message}`);
            }

            const arrayBuffer = await imageRes.arrayBuffer();
            base64Image = Buffer.from(arrayBuffer).toString('base64');
            console.warn("FALLBACK: Used Pollinations.ai due to Google error.");
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
        console.error("Global Image Tool Error:", error);
        return NextResponse.json(
            { error: error.message || 'Image generation failed.' },
            { status: 500 }
        );
    }
}
