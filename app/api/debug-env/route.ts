import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    const lastChars = apiKey.length > 5 ? apiKey.slice(-5) : 'XXXXX';
    const isSet = apiKey.length > 0;

    return NextResponse.json({
        status: 'ok',
        apiKeyConfigured: isSet,
        apiKeyEndsWith: lastChars,
        envVarName: 'GOOGLE_GENERATIVE_AI_API_KEY',
        timestamp: new Date().toISOString()
    });
}
