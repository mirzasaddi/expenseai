"use client";

import React, { useState } from "react";

type CategorySummary = {
  category: string;
  total: number;
};

type AnalysisResult = {
  summary?: {
    totalTransactions: number;
    totalAmount: number;
    byCategory: CategorySummary[];
  };
  rows?: {
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
  raw?: string; // fallback if AI didn't return clean JSON
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please choose a CSV file first.");
      return;
    }

    setStatus("uploading");
    setError(null);
    setResult(null);

    try {
      // Read file contents as text
      const csvText = await file.text();

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csv: csvText,
          filename: file.name, // important for Supabase
        }),
      });

      const data = (await res.json()) as AnalysisResult | { error?: string };

      if (!res.ok) {
        const errMsg =
          (data as any).error || `Server error (status ${res.status})`;
        throw new Error(errMsg);
      }

      console.log("AI / analyze result:", data);
      setResult(data as AnalysisResult);
      setStatus("done");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          Step 1 · Data Ingestion
        </p>
        <h1 className="text-2xl font-semibold">Upload expense exports</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Upload CSV or Excel exports from your accounting / banking system.
          ExpensAI will validate headers, classify expenses into cost heads, and
          flag anything that looks suspicious.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
        {/* LEFT: Upload card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-4">
          <div className="flex items-start justify-between text-xs text-slate-400 gap-4">
            <div>
              <p className="font-medium text-slate-200">Upload CSV / Excel</p>
              <p>Supported: .csv (for now in this milestone)</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p>Max ~1 MB is fine for demo</p>
              {/* Download sample CSV */}
              <a
                href="/expenses_demo.csv"
                download
                className="inline-flex items-center rounded-md border border-emerald-500/70 px-3 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 transition"
              >
                Download sample CSV
              </a>
            </div>
          </div>

          <label className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center text-sm text-slate-300 hover:border-emerald-400 hover:bg-slate-900/80 cursor-pointer transition">
            <span className="mb-2 font-medium">
              Drag &amp; drop your file here
            </span>
            <span className="text-xs text-slate-400">…or click to browse</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <div className="text-xs text-slate-400">
            <p className="font-medium text-slate-200">Selected file</p>
            <p>
              {file ? (
                <span className="text-emerald-300">{file.name}</span>
              ) : (
                "No file selected yet."
              )}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 gap-4">
            <p className="text-[11px] text-slate-500 max-w-sm">
              Your file is parsed locally in the browser, then sent to our AI
              endpoint for classification. The analyzed result is stored in
              Supabase for later review and dashboards.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={!file || status === "uploading"}
              className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {status === "uploading" ? "Analyzing…" : "Continue to Review →"}
            </button>
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-400">
              ⚠ {error}
            </p>
          )}
        </div>

        {/* RIGHT: What happens + milestone note */}
        <div className="space-y-4">
          <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-300">
            <p className="font-medium text-slate-100 mb-2">
              What happens after upload?
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                We validate the file format and required columns (date,
                description, amount, vendor, etc.).
              </li>
              <li>
                We normalize amounts, currencies, and dates so they’re ready for
                consistent reporting.
              </li>
              <li>
                Our AI suggests cost heads like{" "}
                <span className="text-emerald-300">
                  Travel, Meals, Utilities, Software
                </span>{" "}
                and flags anything that needs your attention.
              </li>
            </ol>
          </section>

          <section className="rounded-xl border border-emerald-700/40 bg-emerald-500/5 p-4 text-xs text-emerald-100">
            <p className="font-semibold mb-1">Milestone note</p>
            <p>
              For this PRG800 milestone we simulate the full pipeline:
              client-side upload + AI classification. In the next phase we’ll
              store cleaned data in Supabase and build dashboards &amp; reports
              on top.
            </p>
          </section>
        </div>
      </div>

      {/* RESULT SECTION */}
      {status === "done" && result && (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">AI analysis</h2>

          {/* Summary */}
          {result.summary && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm">
              <p className="text-slate-200 mb-1">
                Total transactions:{" "}
                <span className="font-semibold">
                  {result.summary.totalTransactions}
                </span>
              </p>
              <p className="text-slate-200 mb-2">
                Total amount:{" "}
                <span className="font-semibold">
                  {result.summary.totalAmount.toFixed(2)}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {result.summary.byCategory.map((c) => (
                  <span
                    key={c.category}
                    className="rounded-full bg-slate-800 px-3 py-1"
                  >
                    {c.category}: {c.total.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rows table */}
          {result.rows && (
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left">Confidence</th>
                    <th className="px-3 py-2 text-left">Needs review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {result.rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-3 py-2 max-w-xs truncate">
                        {row.description}
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        {row.amount.toFixed(2)} {row.currency}
                      </td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2">
                        {(row.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="px-3 py-2">
                        {row.needsReview ? (
                          <span className="text-amber-300">
                            Yes – {row.reviewReason}
                          </span>
                        ) : (
                          <span className="text-emerald-300">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fallback if AI returned raw text */}
          {result.raw && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-xs whitespace-pre-wrap">
              {result.raw}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
