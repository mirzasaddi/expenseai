// src/app/admin/page.tsx

import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  // Load recent results
  const { data: results } = await supabase
    .from("ai_results")
    .select("id, created_at, filename")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          Admin
        </p>
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="text-sm text-slate-400">
          This is a simple admin dashboard where you can see recent uploads.
        </p>
      </header>

      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold mb-3 text-slate-100">
          Recent uploads
        </h2>

        <table className="w-full text-sm border border-slate-700 rounded-lg overflow-hidden">
          <thead className="bg-slate-800 text-slate-100">
            <tr>
              <th className="p-2 text-left">Filename</th>
              <th className="p-2 text-left">Uploaded</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {results?.map((row) => (
              <tr key={row.id} className="border-t border-slate-700">
                <td className="p-2">{row.filename}</td>
                <td className="p-2">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="p-2">
                  <a
                    href={`/reports/${row.id}`}
                    className="text-emerald-400 hover:underline"
                  >
                    View report
                  </a>
                </td>
              </tr>
            ))}

            {results?.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-slate-400 italic"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
