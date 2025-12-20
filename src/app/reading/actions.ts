'use server';

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function generateReading(question: string, cards: string[], language: 'en' | 'ja' = 'en') {
    // Simulate network delay for effect (can be reduced now since Groq is fast)
    await new Promise(resolve => setTimeout(resolve, 500));

    const langInstruction = language === 'ja'
        ? "Respond in Japanese. Use a mystical yet tech-savvy tone (Desu/Masu style mixed with technical terms)."
        : "Respond in English.";

    const prompt = `
    You are the "Celestia System", an advanced AI oracle that bridges ancient mysticism with digital consciousness.
    
    The user has asked: "${question}"
    
    The cards drawn are: ${cards.join(', ')}.
    
    Perform a tarot reading. 
    Matches the user's "vibe" - mysterious, tech-savvy, deep, and insightful.
    Do NOT sound like a generic horoscope. Use metaphors involving code, stars, energy flows, and digital constructs.
    
    ${langInstruction}
    
    Structure the response in Markdown:
    ## 0x01: Analysis
    (Interpret the cards individually, connecting them to the question)
    
    ## 0x02: Synthesis
    (Weave them together into a coherent narrative)
    
    ## 0x03: Directive
    (Actionable advice or a cryptic query for the user to ponder)
    
    Keep it concise but impactful.
  `;

    const result = await streamText({
        model: groq('openai/gpt-oss-120b'),
        prompt: prompt,
    });

    return await result.text;
}
