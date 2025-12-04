import { groq } from "@/lib/groq";
import { supabase } from "@/lib/supabase";

type CategorySummary = {
  category: string;
  total: number;
};

type AnalysisResult = {
  summary: {
    totalTransactions: number;
    totalAmount: number;
    byCategory: CategorySummary[];
  };
  rows: {
    date: string;
    description: string;
    amount: number;
    currency: string;
    vendor: string | null;
    category: string;
    confidence: number;
    needsReview: boolean;
    reviewReason: string | null;
  }[];
};

// --- CSV parser ---
function parseCsv(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idxDate = header.indexOf("date");
  const idxDesc = header.indexOf("description");
  const idxAmount = header.indexOf("amount");

  if (idxDate === -1 || idxDesc === -1 || idxAmount === -1) {
    throw new Error("CSV must have date, description, amount columns");
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    return {
      date: cols[idxDate]?.trim() ?? "",
      description: cols[idxDesc]?.trim() ?? "",
      amount: Number(cols[idxAmount] ?? 0),
      currency: "USD",
      vendor: null,
    };
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const csvText = body.csv as string | undefined;
    const filename = (body.filename as string | undefined) ?? null;

    if (!csvText) {
      return new Response(
        JSON.stringify({ error: "No CSV text received from client" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let rows;
    try {
      rows = parseCsv(csvText);
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || "Invalid CSV format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!rows.length) {
      return new Response(
        JSON.stringify({ error: "CSV contained no data rows" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `
You are an AI assistant for an accounting firm. 
Return STRICT JSON matching this type:

type AnalysisResult = {
  summary: {
    totalTransactions: number;
    totalAmount: number;
    byCategory: { category: string; total: number }[];
  };
  rows: {
    date: string;
    description: string;
    amount: number;
    currency: string;
    vendor: string | null;
    category: string;
    confidence: number;
    needsReview: boolean;
    reviewReason: string | null;
  }[];
};

Rules:
- ONLY output valid JSON. No explanation text.
- Category must be one of: "Travel", "Meals", "Office", "Software", "Utilities", "Other".
- If you are not sure, choose "Other" and set needsReview=true with a reason.
`.trim();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "Here is the list of expenses as JSON array:\n" +
            JSON.stringify(rows, null, 2),
        },
      ],
      response_format: { type: "json_object" } as any,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    console.log("Groq raw:", content);

    let aiJson: AnalysisResult;
    try {
      aiJson = JSON.parse(content) as AnalysisResult;
    } catch {
      return new Response(
        JSON.stringify({ raw: content }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- save to Supabase ---
    const { error: dbError } = await supabase
      .from("ai_results")
      .insert({
        filename,
        analysis: aiJson,
      });

    if (dbError) {
      console.error("Supabase save error:", dbError);
    }

    return new Response(JSON.stringify(aiJson), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[/api/analyze] error:", err);
    return new Response(
      JSON.stringify({
        error: err?.message || "Server crashed while analyzing.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
