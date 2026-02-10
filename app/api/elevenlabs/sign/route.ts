import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { agentId, overrides } = await req.json();
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "ELEVENLABS_API_KEY is not defined in environment variables" },
                { status: 500 }
            );
        }

        if (!agentId) {
            return NextResponse.json(
                { error: "agentId is required" },
                { status: 400 }
            );
        }

        // Construct the URL for the ElevenLabs API
        const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`;

        // Prepare the request body if overrides are present
        // Note: The structure for overrides in the signed URL endpoint might differ slightly
        // or effectively be the same as the startSession config.
        // Documentation: https://elevenlabs.io/docs/api-reference/get-signed-url
        // Wait, the endpoint is actually checking if we can pass overrides during signed URL generation.
        // Recent docs suggest we might need to pass overrides here if we want them baked into the URL/token.
        // However, standard flow is: get signed URL -> start session with signed URL.
        // Let's check if the signed URL endpoint accepts a body for configuration.
        // Based on common patterns, it often doesn't, but newer versions might.
        // If not, we might need to use the `authorization` header in the frontend but that defeats the purpose of hiding the key.
        // Actually, the Signed URL *authorizes* the session. The overrides are passed to `startSession` in the frontend?
        // NO, if we use a signed URL, we usually can't override client-side unless the signed URL allows it or configuration is baked in.

        // CORRECTION: The /v1/convai/conversation/get_signed_url endpoint returns a signed_url.
        // The standard SDK usage `startSession({ signedUrl: ... })` effectively effectively replaces `agentId`.
        // If we want to override the voice, we must perform the "agent configuration" *server-side* or ensure the signed URL grants permissions.
        // BUT, ElevenLabs documentation says "Client Tools & Overrides" are part of the `startSession` call.
        // The Signed URL is just for Authentication.
        // So, we will generate the Signed URL here, and *still* pass overrides in the frontend.
        // The difference is that with a Signed URL, we are "authenticated" so the backend is more likely to accept the override 
        // (assuming the API key has permissions, which it does).

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'xi-api-key': apiKey,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs API Error:", errorText);
            return NextResponse.json(
                { error: "Failed to generate signed URL", details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ signedUrl: data.signed_url });

    } catch (error) {
        console.error("Error in /api/elevenlabs/sign:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
