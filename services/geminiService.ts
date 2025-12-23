
import { GoogleGenAI } from "@google/genai";
import { IdeaCategory, Idea } from "../types";

export const generateBrainstormIdeas = async (
  topic: string,
  category: IdeaCategory,
  language: string = 'Dutch'
): Promise<string> => {
  try {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey) return "Fout: Geen API-sleutel gevonden.";

    const ai = new GoogleGenAI({ apiKey });
    
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
    console.error("Gemini API Error:", error);
    return "Fout bij verbinden met AI.";
  }
};

export const suggestAdminReply = async (
  idea: Idea,
  language: string = 'Dutch'
): Promise<string> => {
  try {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey) return "";

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Als beheerder van DigiHart.nl, schrijf een korte, bemoedigende en professionele reactie op dit idee:
    Titel: ${idea.title}
    Omschrijving: ${idea.description}
    Categorie: ${idea.category}
    
    De reactie moet in het ${language} zijn en maximaal 2 zinnen lang.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-lite-latest',
      contents: prompt,
      config: {
        systemInstruction: "Je bent een vriendelijke en constructieve moderator voor DigiHart.nl.",
        temperature: 0.7,
      }
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Suggest Reply Error:", error);
    return "";
  }
};
