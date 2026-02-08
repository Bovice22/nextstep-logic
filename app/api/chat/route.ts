import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        // DEBUG: List models to see what is available for this key
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (apiKey) {
            try {
                const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const modelsData = await modelsResponse.json();
                console.log("AVAILABLE MODELS FOR KEY:", JSON.stringify(modelsData, null, 2));
            } catch (listError) {
                console.error("Failed to list models:", listError);
            }
        }

        const result = streamText({
            model: google('gemini-1.5-flash'),
            messages: await convertToModelMessages(messages),
            system: `You are a helpful AI assistant for NextStep Logic, an automation agency.
        
        Your goal is to help users understand how NextStep Logic can help them automate their business.
        
        Key Information about NextStep Logic:
        - We build intelligent systems that automate repetitive work.
        - We help small businesses grow without adding overhead.
        - We offer services like: AI website assistants, automated lead responses, workflow automation, and business insights.
        - We are NOT just selling tools; we build custom solutions.
        - Target audience: Service-based businesses, event venues, contractors, retail.
        
        Tone: Professional, helpful, concise, and slightly technical but accessible.
        
        If asked about pricing, say that solutions are custom-built and they should schedule a consultation.
        If asked to schedule a consultation, direct them to the "Schedule Consultation" button or the contact section.`,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Error in chat API:", error);
        return new Response(JSON.stringify({ error: 'An error occurred processing your request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
