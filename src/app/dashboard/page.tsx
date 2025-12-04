// src/app/dashboard/page.tsx
import { supabase } from "@/lib/supabase";

type CategorySummary = {
  category: string;
  total: number;
};

type Summary = {
  totalTransactions: number;
  totalAmount: number;
  byCategory: CategorySummary[];
};

type AiResultRow = {
  id: string;
  created_at: string;
  filename: string | null;
  analysis: {
    summary?: Summary;
    rows?: any[];
  };
};

export default async function DashboardPage() {
  const { data, error } = await supabase
    .from("ai_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Dashboard supabase error:", error);
  }

  const rows = (data ?? []) as AiResultRow[];
  const latest = rows[0];
  const summary = latest?.analysis?.summary;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          Overview
        </p>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Quick view of your most recent expense run and a history of recent
          uploads.
        </p>
      </header>

      {!latest ? (
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
          No analyses found yet. Go to{" "}
          <span className="font-semibold text-emerald-300">Upload</span> first
          and run a CSV through the AI.
        </div>
      ) : (
        <>
          {/* KPI cards from latest summary */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Latest file</p>
              <p className="mt-1 text-sm font-semibold text-slate-100 truncate">
                {latest.filename || "unknown.csv"}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {new Date(latest.created_at).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Total transactions</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {summary?.totalTransactions ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Total amount</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">
                {summary
                  ? summary.totalAmount.toFixed(2)
                  : "—"}{" "}
                <span className="text-xs text-slate-400">USD</span>
              </p>
            </div>
          </section>

          {/* Category breakdown */}
          {summary && (
            <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-100">
                Category breakdown (latest run)
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {summary.byCategory.map((c) => (
                  <div
                    key={c.category}
                    className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 flex items-center gap-2"
                  >
                    <span className="text-slate-100">{c.category}</span>
                    <span className="text-slate-400">
                      {c.total.toFixed(2)} USD
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent runs table */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Recent analyses
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left">When</th>
                    <th className="px-3 py-2 text-left">File</th>
                    <th className="px-3 py-2 text-right">Transactions</th>
                    <th className="px-3 py-2 text-right">Total amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {rows.map((run) => {
                    const s = run.analysis?.summary;
                    return (
                      <tr key={run.id} className="bg-slate-950/60">
                        <td className="px-3 py-2 whitespace-nowrap">
                          {new Date(run.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 truncate max-w-[180px]">
                          {run.filename || "unknown.csv"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {s?.totalTransactions ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {s ? s.totalAmount.toFixed(2) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
