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
        const limitCookie = cookieStore.get('nextstep-video-limit');

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

        // Allow 3 free video generations per day (more expensive than images)
        if (usage.count >= 3) {
            return NextResponse.json(
                { error: 'Daily video limit reached (3/3). Come back tomorrow!' },
                { status: 429 }
            );
        }

        const apiKey = process.env.POLLINATIONS_API_KEY;
        const encodedPrompt = encodeURIComponent(prompt);
        const url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=grok-video&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;

        console.log("Generating video with URL:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Pollinations Video API Error Text:", errorText);

            let errorMessage = `Video generation failed (${response.status})`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error?.message || errorData.error || errorMessage;
            } catch (e) {
                // Not JSON, use raw text if short
                if (errorText.length < 100) errorMessage = errorText;
            }
            throw new Error(errorMessage);
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'video/mp4';
        const base64Video = Buffer.from(arrayBuffer).toString('base64');
        const videoDataUrl = `data:${contentType};base64,${base64Video}`;

        // ---------------------------------------------------------
        // Update Limit & Return
        // ---------------------------------------------------------
        usage.count += 1;
        cookieStore.set('nextstep-video-limit', JSON.stringify(usage), {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            path: '/',
            httpOnly: true,
            sameSite: 'strict'
        });

        return NextResponse.json({
            videoUrl: videoDataUrl,
            remaining: 3 - usage.count
        });

    } catch (error: any) {
        console.error("Global Video Tool Error:", error);
        return NextResponse.json(
            { error: error.message || 'Video generation failed.' },
            { status: 500 }
        );
    }
}
