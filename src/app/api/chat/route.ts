import { NextRequest, NextResponse } from "next/server";
import { TavilyClient } from "tavily";

// Server-side only — these env vars are NEVER sent to the browser
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY!;
const MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function POST(req: NextRequest) {
    try {
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const { message, conversationHistory = [], citationsEnabled = true } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Invalid message" }, { status: 400 });
        }

        // Build conversation history for Gemini
        const contents = conversationHistory.map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        let tavilySources: { url: string; title: string; domain: string; number: number }[] = [];
        let sourcesContext = "";

        // Fetch Tavily sources if citations are enabled
        if (citationsEnabled && TAVILY_API_KEY) {
            try {
                const tavilyClient = new TavilyClient({ apiKey: TAVILY_API_KEY });
                const tavilyResponse = await tavilyClient.search({
                    query: message,
                    max_results: 5,
                    include_answer: false,
                    include_raw_content: false,
                });

                if (tavilyResponse.results) {
                    tavilySources = tavilyResponse.results.map((result: any, index: number) => ({
                        url: result.url,
                        title: result.title || result.url,
                        domain: (() => {
                            try { return new URL(result.url).hostname.replace("www.", ""); }
                            catch { return "unknown"; }
                        })(),
                        number: index + 1,
                    }));

                    sourcesContext = tavilyResponse.results
                        .map((r: any, i: number) => `[${i + 1}] ${r.title}\n${r.url}\n${r.content}`)
                        .join("\n\n");
                }
            } catch (err) {
                console.error("Tavily search error:", err);
            }
        }

        // Build the prompt — add sources context if available
        const userPrompt = sourcesContext
            ? `You are a helpful AI assistant. Use the following sources to answer the user's question. Cite sources using numbered references like [1], [2], etc.

SOURCES:
${sourcesContext}

USER QUESTION:
${message}

Please provide a comprehensive answer citing the sources appropriately.`
            : message;

        contents.push({ role: "user", parts: [{ text: userPrompt }] });

        // Call Gemini
        const geminiResponse = await fetch(`${API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                generationConfig: { temperature: 1.0, maxOutputTokens: 8192 },
            }),
        });

        if (!geminiResponse.ok) {
            // Don't expose raw Gemini error to client
            console.error("Gemini API error:", await geminiResponse.text());
            return NextResponse.json({ error: "AI request failed. Please try again." }, { status: 502 });
        }

        const data = await geminiResponse.json();
        const candidates = data.candidates as Array<{
            content?: { parts?: Array<{ text?: string }> };
        }>;

        const text = candidates?.[0]?.content?.parts
            ?.map((p) => p.text || "")
            .join("") || "No response generated";

        return NextResponse.json({
            text,
            sources: tavilySources,
            hasSources: tavilySources.length > 0,
        });

    } catch (err: any) {
        console.error("Chat API error:", err);
        // Generic error — don't leak internal details
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
