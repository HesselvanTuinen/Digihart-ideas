
import { GoogleGenAI, Type } from "@google/genai";
import { IdeaCategory, Idea } from "../types";

/**
 * Generates radical, provocative brainstorm text for a specific topic.
 * Uses thinkingConfig to allow the model to explore more creative pathways.
 */
export const generateBrainstormIdeas = async (
  topic: string,
  category: IdeaCategory,
  language: string = 'Dutch'
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Je bent een radicale futurist en "disruptive thinker". 
    Brainstorm 3 extreem creatieve, provocerende ideeën over: "${topic}" in de categorie: "${category}". 
    Regels voor maximale creativiteit:
    1. "Unexpected Intersectionality": Combineer het onderwerp met iets totaal ongerelateerds (bijv. quantum-fysica en tuinieren).
    2. "Inversion": Draai een maatschappelijke norm volledig om.
    3. Focus op radicale menselijke empathie en de 'ziel' van technologie.
    
    Antwoord in het ${language}. Kort, krachtig, en als een manifest.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "Jij bent de 'Chief Creative Provocateur' van DigiHart.nl. Je bent een meester in het vinden van onverwachte verbanden en het uitdagen van de status quo met poëtische maar brute innovatie.",
        temperature: 1.0,
        thinkingConfig: { thinkingBudget: 2000 } // Small budget for quick but deep creative sparks
      }
    });

    return response.text || "De toekomst is even onzichtbaar.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Fout bij het verbinden met de toekomst.";
  }
};

/**
 * Generates structured Idea objects with deep reasoning. 
 * Requests specific, highly diverse archetypes with a focus on 'impossible' combinations.
 */
export const generateStructuredIdeas = async (
  topic: string,
  language: string = 'Dutch'
): Promise<Partial<Idea>[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Genereer 3 unieke innovatie-concepten over: "${topic}" die de grenzen van de verbeelding opzoeken.
    Archetypes voor diversiteit:
    1. "The Bio-Digital Dream": Een fusie tussen levende organismen en digitale intelligentie.
    2. "The Invisible Infrastructure": Een oplossing die onzichtbaar is maar de sociale cohesie radicaal herstelt.
    3. "The Ancestral Future": Gebruik oeroude wijsheid of technieken gecombineerd met futuristische technologie.

    Vermijd clichés. Geen apps, geen dashboards, geen 'slimme' sensoren tenzij ze een bizarre, briljante twist hebben.
    Zorg dat de ideeën passen binnen deze categorieën: ${Object.values(IdeaCategory).join(', ')}.
    Gebruik prikkelende titels in het ${language}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "Je bent een 'Speculative Designer' en 'Innovation Alchemist'. Je creëert concepten die zowel vreemd als onvermijdelijk aanvoelen. Je antwoorden zijn gewaagd, inclusief en visionair. Antwoord uitsluitend in JSON.",
        responseMimeType: "application/json",
        temperature: 1.0,
        thinkingConfig: { thinkingBudget: 4000 } // Higher budget for complex synthesis
      }
    });

    try {
      const text = response.text || '[]';
      return JSON.parse(text);
    } catch (e) {
      console.error("JSON Parsing error in Gemini service", e);
      return [];
    }
  } catch (error) {
    console.error("Gemini Structured Ideas Error:", error);
    return [];
  }
};

/**
 * Suggests an action-oriented admin reply.
 */
export const suggestAdminReply = async (
  idea: Idea,
  language: string = 'Dutch'
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Als mentor van DigiHart.nl, schrijf een inspirerende, korte reactie op dit idee:
    Titel: ${idea.title}
    Omschrijving: ${idea.description}
    
    De reactie moet in het ${language} zijn, maximaal 2 zinnen. Prikkel de auteur met een vraag die hem uitdaagt de technische of ethische grenzen van zijn idee nog verder op te zoeken.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Je bent een constructieve coach voor innovators. Je bent scherp, warm en altijd gericht op het 'waarom' achter een idee.",
        temperature: 0.8,
      }
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Suggest Reply Error:", error);
    return "";
  }
};
