// src/app/api/review/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Get the most recent ai_results row
    const { data, error } = await supabase
      .from("ai_results")
      .select("analysis, filename, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("[/api/review] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to load latest analysis from Supabase" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No analysis records found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        analysis: data.analysis,
        filename: data.filename,
        created_at: data.created_at,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[/api/review] SERVER ERROR:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Server crashed while loading review data. Check server logs.",
      },
      { status: 500 }
    );
  }
}
