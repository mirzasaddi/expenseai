// src/app/review/page.tsx
"use client";

import React, { useEffect, useState } from "react";

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
  raw?: string;
};

type ReviewResponse = {
  analysis: AnalysisResult;
  filename: string | null;
  created_at: string;
};

export default function ReviewPage() {
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [status, setStatus] =
    useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      setError(null);

      try {
        const res = await fetch("/api/review", { method: "GET" });
        const json = (await res.json()) as ReviewResponse | { error?: string };

        if (!res.ok) {
          throw new Error((json as any).error || "Failed to load review data");
        }

        setData(json as ReviewResponse);
        setStatus("done");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong while loading review");
        setStatus("error");
      }
    };

    load();
  }, []);

  const analysis = data?.analysis;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          Step 2 · Review
        </p>
        <h1 className="text-2xl font-semibold">Review your classified expenses</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          This page shows the most recent AI analysis saved in Supabase. 
          You can use it in the demo to prove that the results are persisted
          after upload.
        </p>
      </header>

      {/* Status / error */}
      {status === "loading" && (
        <p className="text-sm text-slate-400">Loading latest analysis…</p>
      )}

      {status === "error" && error && (
        <p className="text-sm text-red-400">⚠ {error}</p>
      )}

      {status === "done" && analysis && (
        <>
          {/* Meta info */}
          <section className="text-xs text-slate-400 space-y-1">
            <p>
              <span className="font-semibold text-slate-200">File:</span>{" "}
              {data?.filename || "Unknown"}
            </p>
            <p>
              <span className="font-semibold text-slate-200">Analyzed at:</span>{" "}
              {new Date(data!.created_at).toLocaleString()}
            </p>
          </section>

          {/* Summary */}
          {analysis.summary && (
            <section className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm space-y-2">
              <p className="text-slate-200">
                Total transactions:{" "}
                <span className="font-semibold">
                  {analysis.summary.totalTransactions}
                </span>
              </p>
              <p className="text-slate-200">
                Total amount:{" "}
                <span className="font-semibold">
                  {analysis.summary.totalAmount.toFixed(2)}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {analysis.summary.byCategory.map((c) => (
                  <span
                    key={c.category}
                    className="rounded-full bg-slate-800 px-3 py-1"
                  >
                    {c.category}: {c.total.toFixed(2)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Rows table */}
          {analysis.rows && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-200">
                Transaction details
              </h2>
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
                    {analysis.rows.map((row, idx) => (
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
                              Yes{row.reviewReason && ` – ${row.reviewReason}`}
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
            </section>
          )}

          {/* Fallback raw JSON if needed */}
          {!analysis.summary && !analysis.rows && analysis.raw && (
            <section className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-xs whitespace-pre-wrap">
              {analysis.raw}
            </section>
          )}
        </>
      )}

      {status === "done" && !analysis && (
        <p className="text-sm text-slate-400">
          No analysis found. Try uploading a CSV on the Upload page first.
        </p>
      )}
    </div>
  );
}
