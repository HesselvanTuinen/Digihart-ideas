
import { GoogleGenAI, Type } from "@google/genai";
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

export const generateStructuredIdeas = async (
  topic: string,
  language: string = 'Dutch'
): Promise<Partial<Idea>[]> => {
  try {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey) return [];

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Genereer 3 unieke, innovatieve ideeën over: "${topic}". 
    Zorg dat ze divers zijn en passen binnen de categorieën: ${Object.values(IdeaCategory).join(', ')}.
    Antwoord in het ${language}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Je bent een innovatie-expert. Genereer ideeën in JSON formaat.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { 
                type: Type.STRING,
                description: "Moet een van de volgende zijn: Technology, Community, Sustainability, Education, Health, Art, Inclusion"
              }
            },
            required: ["title", "description", "category"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      return [];
    }
  } catch (error) {
    console.error("Gemini Structured Ideas Error:", error);
    return [];
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
