require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Just to initialize client, usually listModels is on the client instance if available in node SDK version used?
        // Actually the SDK structure might be different. Let's try raw fetch first if SDK is tricky or check SDK docs pattern.
        // SDK doesn't expose listModels directly on the main class in some versions?
        // Let's use fetch for raw API check to be absolutely sure.

        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("Error fetching models:", data);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
