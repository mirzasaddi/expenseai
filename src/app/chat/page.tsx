// src/app/chat/page.tsx
import { supabase } from "@/lib/supabase";
import ChatClient from "./ChatClient";   // default import, same folder


export default async function ChatPage() {
  // 1) Load the most recent analysis
  const { data, error } = await supabase
    .from("ai_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Chat with your expenses</h1>
        <p className="text-sm text-red-400">
          I couldn’t find any uploaded data. Go to the Upload page first and
          analyze a CSV.
        </p>
      </div>
    );
  }

  const analysis = data.analysis;

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          Step 3 · Conversational review
        </p>
        <h1 className="text-2xl font-semibold">Chat with your expenses</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          This page loads your latest analyzed file from Supabase and acts like
          a chatbot on top of it.
        </p>
      </header>

      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
        <p>
          Loaded file:{" "}
          <span className="font-semibold text-emerald-300">
            {data.filename || "unknown.csv"}
          </span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Created at: {new Date(data.created_at).toLocaleString()}
        </p>
      </div>

      {/* Actual interactive chat UI */}
      <ChatClient analysis={analysis} />

      {/* Debug preview so you see what data is available */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <h2 className="text-sm font-semibold mb-2 text-slate-100">
          Latest analysis (debug preview)
        </h2>
        <pre className="text-xs text-slate-300 whitespace-pre-wrap max-h-[400px] overflow-auto">
          {JSON.stringify(analysis, null, 2)}
        </pre>
      </div>
    </div>
  );
}
