import { systemPrompt } from '../../knowledge';

// ... (existing code)

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
