"use client";

import { useState } from "react";

type ChatClientProps = {
  analysis: any;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatClient({ analysis }: ChatClientProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          latestAnalysis: analysis,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || `Request failed (${res.status})`);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.reply as string },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to get reply from AI.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 space-y-3">
      <div className="h-64 overflow-y-auto space-y-2 text-sm">
        {messages.length === 0 && (
          <p className="text-xs text-slate-400">
            Ask something like{" "}
            <span className="text-emerald-300">
              “How much did I spend on Meals in January?”
            </span>
          </p>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                m.role === "user"
                  ? "bg-emerald-500/80 text-slate-950"
                  : "bg-slate-800 text-slate-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isSending && (
          <p className="text-xs text-slate-400">
            Thinking about your expenses…
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400">
          ⚠ {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: What did I spend on Meals?"
          className="flex-1 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          disabled={isSending}
          className="rounded-md bg-emerald-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
