// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { groq } from "@/lib/groq"; // your Groq client

export async function POST(req: Request) {
  try {
    const { message, latestAnalysis } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided." }, { status: 400 });
    }

    const systemPrompt = `
You are an expense analysis assistant.
Use the provided analysis JSON to answer questions about the user's spending.
Be specific and refer to categories, amounts, and dates when helpful.

User's latest expense analysis:
${JSON.stringify(latestAnalysis, null, 2)}
`.trim();

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b", // same model as your Groq playground
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content || "No response.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
