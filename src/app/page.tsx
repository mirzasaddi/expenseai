// src/app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-50">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 lg:pt-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-5">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-300">
              Expense AI for CPAs & Finance Teams
            </span>

            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Close your books{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                faster, with fewer spreadsheets
              </span>
            </h1>

            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              ExpensAI ingests CSV or Excel exports from your banking and
              accounting systems, automatically classifies every transaction,
              and generates audit-ready cost-head summaries your partners can
              trust.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm hover:bg-emerald-400"
              >
                Start with a CSV
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300"
              >
                View sample dashboard
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-[11px] text-slate-400">
              <p>✅ Designed for PRG800 Milestone 5 demo</p>
              <p>🔒 PIPEDA-aware, secure by design</p>
              <p>📊 Built on Next.js, Supabase & AI classification</p>
            </div>
          </div>

          {/* Right side – quick stats */}
          <div className="flex-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-emerald-900/20">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                At a glance
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-slate-400">Time saved per month-end</dt>
                  <dd className="mt-1 text-2xl font-semibold text-emerald-300">
                    60%
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Manual rework reduced</dt>
                  <dd className="mt-1 text-2xl font-semibold text-emerald-300">
                    40%
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Supported cost heads</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-50">
                    Travel, Meals, Office, Utilities, Software…
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Data source formats</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-50">
                    CSV / Excel, bank exports
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto max-w-5xl px-6 py-12 space-y-6">
          <h2 className="text-lg font-semibold text-slate-50">
            How ExpensAI fits your workflow
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-emerald-300">
                Step 1 · Upload
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-50">
                Drop in your raw exports
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                Upload CSV or Excel files from your accounting / banking
                system. We validate headers, dates, amounts and vendor fields
                before anything else happens.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-emerald-300">
                Step 2 · AI classification
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-50">
                Smart cost-head tagging
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                Our rule engine & AI model label each transaction into cost
                heads like Travel, Meals, Software or Utilities, and flag any
                low-confidence items for human review.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-emerald-300">
                Step 3 · Reporting
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-50">
                Export-ready summaries
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                Generate PDF or Excel summaries grouped by cost head,
                ready to attach to working papers, client packages or
                management decks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-12 space-y-6">
          <h2 className="text-lg font-semibold text-slate-50">
            Built for real teams
          </h2>
          <div className="grid gap-5 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-slate-50">
                CPA firms
              </h3>
              <p className="mt-2 text-slate-300">
                Standardize how staff classify expenses across clients and
                engagements. Reduce partner review time and keep a clean audit
                trail in Supabase.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-slate-50">
                In-house finance
              </h3>
              <p className="mt-2 text-slate-300">
                Give controllers a single place to upload card feeds and bank
                exports, classify once, then push consistent numbers into your
                ERP.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-slate-50">
                Students & capstone teams
              </h3>
              <p className="mt-2 text-slate-300">
                Demonstrate end-to-end product thinking: upload flow,
                AI micro-service, Supabase storage, dashboards, admin and chat
                review – all in one small, focused app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security + CTA */}
      <section className="border-t border-slate-800 bg-slate-950/95">
        <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-3 text-xs">
            <h2 className="text-lg font-semibold text-slate-50">
              Security & compliance first
            </h2>
            <ul className="space-y-2 text-slate-300">
              <li>• Data stored in Supabase Postgres with row-level security.</li>
              <li>• Designed with PIPEDA / privacy best practices in mind.</li>
              <li>• Role-based access via the Admin module (staff vs admin).</li>
              <li>• Clear audit trail of AI classifications and manual changes.</li>
            </ul>
          </div>

          <div className="flex-1 rounded-2xl border border-emerald-600/60 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6">
            <h3 className="text-sm font-semibold text-emerald-200">
              Ready to see it in action?
            </h3>
            <p className="mt-2 text-xs text-slate-200">
              Start by uploading the provided sample file, walk through the
              Review, Dashboard and Reports modules, then log into Admin to see
              how internal users would manage access.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400"
              >
                Go to Upload
              </Link>
              <Link
                href="/reports"
                className="inline-flex items-center justify-center rounded-md border border-emerald-400/60 px-4 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-500/10"
              >
                Open Reports
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-md border border-slate-600 px-4 py-2 text-xs font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300"
              >
                Try the expense chat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
