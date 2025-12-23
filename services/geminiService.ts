
import { GoogleGenAI } from "@google/genai";
import { IdeaCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBrainstormIdeas = async (
  topic: string,
  category: IdeaCategory,
  language: string = 'Dutch'
): Promise<string> => {
  try {
    const prompt = `Je bent een innovatie consultant voor DigiHart.nl. 
    Brainstorm 3 creatieve ideeën over het onderwerp: "${topic}" in de categorie: "${category}". 
    Geef je antwoord in het ${language}. Houd het kort en krachtig.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Je bent een creatieve AI assistent voor DigiHart.nl.",
        temperature: 0.9,
      }
    });

    return response.text || "Geen resultaat.";
  } catch (error) {
    console.error(error);
    return "Fout bij verbinden met AI. Controleer je API Key.";
  }
};
