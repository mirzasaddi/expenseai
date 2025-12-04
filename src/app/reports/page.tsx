// src/app/reports/page.tsx
import { supabase } from "@/lib/supabase";

type Row = {
  date: string;
  description: string;
  amount: number;
  currency: string;
  vendor: string | null;
  category: string;
  confidence: number;
  needsReview: boolean;
  reviewReason: string | null;
};

type AnalysisResult = {
  rows: Row[];
};

export default async function ReportsPage() {
  // 1) Load latest AI analysis from Supabase
  const { data, error } = await supabase
    .from("ai_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Reports</h1>
        <p className="text-sm text-slate-400">
          No analysis found. Go to the <span className="font-semibold">Upload</span> page,
          upload a CSV, and run AI analysis first.
        </p>
      </div>
    );
  }

  const analysis = data.analysis as AnalysisResult;
  const rows = analysis?.rows ?? [];

  // 2) Derive summary numbers from rows
  const totalTransactions = rows.length;
  const totalAmount = rows.reduce((sum, r) => sum + (r.amount || 0), 0);

  const byCategoryMap = new Map<string, number>();
  rows.forEach((r) => {
    const key = r.category || "Other";
    byCategoryMap.set(key, (byCategoryMap.get(key) || 0) + (r.amount || 0));
  });
  const byCategory = Array.from(byCategoryMap.entries()).map(([category, total]) => ({
    category,
    total,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          Step 4 · Reports
        </p>
        <h1 className="text-2xl font-semibold">Expense report</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          This report summarizes your latest analyzed file and presents it in a
          table format that can be easily exported to Excel or PDF.
        </p>
      </header>

      {/* File info */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
        <p>
          Latest file:{" "}
          <span className="font-semibold text-emerald-300">
            {data.filename || "unknown.csv"}
          </span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Analyzed at: {new Date(data.created_at).toLocaleString()}
        </p>
      </div>

      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs text-slate-400">Total transactions</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {totalTransactions}
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs text-slate-400">Total amount</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {totalAmount.toFixed(2)}{" "}
            <span className="text-sm text-slate-400">
              {rows[0]?.currency || "USD"}
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs text-slate-400">Categories</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {byCategory.map((c) => (
              <span
                key={c.category}
                className="rounded-full bg-slate-800/80 px-3 py-1 text-slate-100"
              >
                {c.category}: {c.total.toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Detailed transactions
          </h2>
          <p className="text-[11px] text-slate-500">
            Tip: Select the table, copy, and paste into Excel / Google Sheets to
            start building your own pivot tables.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-left">Currency</th>
                <th className="px-3 py-2 text-left">Confidence</th>
                <th className="px-3 py-2 text-left">Needs review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/70">
                  <td className="px-3 py-2 whitespace-nowrap">{row.date}</td>
                  <td className="px-3 py-2 max-w-xs truncate">
                    {row.description}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {row.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.currency}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {(row.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.needsReview ? (
                      <span className="text-amber-300">
                        Yes{row.reviewReason ? ` – ${row.reviewReason}` : ""}
                      </span>
                    ) : (
                      <span className="text-emerald-300">No</span>
                    )}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    No rows found in this analysis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
