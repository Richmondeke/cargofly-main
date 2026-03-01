import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
    try {
        if (!ai) {
            return NextResponse.json(
                { error: "AI features are currently unavailable (Missing API Key)." },
                { status: 503 }
            );
        }

        const body = await req.json();
        const { action, query, data } = body;

        if (action === 'logisticsAdvice') {
            const response: any = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `You are a logistics expert. Answer the following user question about cargo, shipping, or supply chain: ${query}`,
            });
            return NextResponse.json({ result: response?.text() || "I'm sorry, I couldn't generate a response at this time." });
        }

        if (action === 'summarizeShipment') {
            const response: any = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `Summarize the status and potential risks for this shipment: ${JSON.stringify(data)}`,
            });
            return NextResponse.json({ result: response?.text() || "Status summary unavailable." });
        }

        return NextResponse.json({ error: "Invalid action type provided." }, { status: 400 });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "I encountered an error while trying to process your request. Please check your network connection or try again later." },
            { status: 500 }
        );
    }
}
