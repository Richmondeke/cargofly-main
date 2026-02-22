
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;


if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (e) {
        console.error("Failed to initialize Gemini AI:", e);
    }
} else {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
}

export const getLogisticsAdvice = async (query: string): Promise<string> => {
    if (!ai) return "AI features are currently unavailable (Missing API Key).";

    try {
        const response: any = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `You are a logistics expert. Answer the following user question about cargo, shipping, or supply chain: ${query}`,
        });
        return response?.text() || "I'm sorry, I couldn't generate a response at this time.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I encountered an error while trying to process your request. Please check your network connection or try again later.";
    }
};

export const summarizeShipmentStatus = async (shipmentData: Record<string, unknown>): Promise<string> => {
    if (!ai) return "Status summary unavailable (Missing API Key).";

    try {
        const response: any = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Summarize the status and potential risks for this shipment: ${JSON.stringify(shipmentData)}`,
        });
        return response?.text() || "Status summary unavailable.";
    } catch {
        return "Could not summarize status.";
    }
};
