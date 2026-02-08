const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get API key from argument or environment
const apiKey = process.argv[2] || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    console.error("❌ Error: No API Key provided.");
    console.error("Usage: node scripts/verify-google-key.js YOUR_API_KEY");
    process.exit(1);
}

console.log(`🔍 Verifying API Key: ${apiKey.substring(0, 8)}... (redacted)`);

async function verify() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // 1. Try to get a specific model (Gemini 1.5 Flash)
        console.log("\n--- Test 1: Instantiating Model (Gemini 1.5 Flash) ---");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("✅ Model instantiated successfully.");

        // 2. Try to generate content (The real test)
        console.log("\n--- Test 2: Generating Content ---");
        console.log("Sending prompt: 'Hello, are you working?'");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();
        console.log("✅ Response received:", text);

    } catch (error) {
        console.error("\n❌ FAILED:");
        console.error(error.message);

        if (error.message.includes("API key not valid")) {
            console.error("\n👉 DIAGNOSIS: The API Key is invalid. Please create a new one in Google AI Studio.");
        } else if (error.message.includes("not found")) {
            console.error("\n👉 DIAGNOSIS: The model 'gemini-1.5-flash' was not found for this key.");
            console.error("This usually means the 'Generative Language API' is disabled in your Google Cloud Project.");
        } else if (error.message.includes("403")) {
            console.error("\n👉 DIAGNOSIS: Permission denied (403). Check if your project has billing enabled or if you are in a supported region.");
        }
    }
}

verify();
