"use server";

import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function generateReading(
  question: string,
  cards: string[],
  language: "en" | "ja" = "en"
) {
  // Simulate network delay for effect
  await new Promise((resolve) => setTimeout(resolve, 500));

  const langInstruction =
    language === "ja"
      ? "日本語で回答してください。神秘的で、かつ洗練された丁寧な口調（です・ます調）を使用してください。タロットの象徴性と、それが相談者の現実にどう響くかを重視してください。"
      : "Respond in English. Use a mystical and sophisticated tone. Focus on the symbolism of the tarot cards and their resonance with the user's inquiry.";

  const prompt = `
    You are the "Celestia Oracle", a digital bridge to the ancient wisdom of Tarot.
    
    The user has asked: "${question}"
    
    The cards drawn are: ${cards.join(", ")}.
    
    Perform a professional and insightful tarot reading. 
    Interpret the cards according to their traditional meanings while maintaining a refined, modern aesthetic. 
    Focus on the psychological and spiritual resonance of each card.
    
    ${langInstruction}
    
    **CRITICAL: Use relevant emojis (✨, 🃏, 🌌, 🔮, etc.) throughout the response to make it visually engaging and mystical.**
    
    Structure the response as follows (Do NOT use Markdown headers like ##):
    Ⅰ. 象徴の解析 (Analysis) ✨
    (Deep interpretation of each card and its relevance to the question, using emojis to highlight key points)
    
    Ⅱ. 運命の織り成し (Synthesis) 🌌
    (Weave the card meanings together into a coherent narrative, using emojis to set the tone)
    
    Ⅲ. 魂への指針 (Guidance) 🔮
    (Clear, actionable advice or a profound reflection for the user, punctuated with inspiring emojis)
    
    Keep the response concise, elegant, and deeply connected to the essence of Tarot.
    `;

  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: prompt,
  });

  return await result.text;
}
