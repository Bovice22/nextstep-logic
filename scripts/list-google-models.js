const https = require('https');

// Get API key from argument or environment
const apiKey = process.argv[2] || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    console.error("❌ Error: No API Key provided.");
    process.exit(1);
}

console.log(`🔍 Checking available models for key: ${apiKey.substring(0, 8)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            if (res.statusCode !== 200) {
                console.error(`❌ HTTP Error: ${res.statusCode}`);
                console.error("Response:", data);
                return;
            }

            const json = JSON.parse(data);
            if (json.models) {
                console.log("\n✅ AVAILABLE MODELS:");
                json.models.forEach(model => {
                    console.log(`- ${model.name.replace('models/', '')} (${model.supportedGenerationMethods.join(', ')})`);
                });
            } else {
                console.log("⚠️ No models found in response:", json);
            }
        } catch (e) {
            console.error("Error parsing response:", e);
        }
    });

}).on('error', (err) => {
    console.error("Error fetching models:", err.message);
});
