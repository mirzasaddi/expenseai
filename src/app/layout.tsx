import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExpensAI",
  description: "Smart expense classification and reporting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-lg">
                Expens<span className="text-emerald-400">AI</span>
              </span>
              <nav className="flex gap-4 text-sm">
                <Link href="/" className="hover:text-emerald-400">Home</Link>
                <Link href="/upload" className="hover:text-emerald-400">Upload</Link>
                <Link href="/review" className="hover:text-emerald-400">Review</Link>
                <Link href="/dashboard" className="hover:text-emerald-400">Dashboard</Link>
                <Link href="/reports" className="hover:text-emerald-400">Reports</Link>
                <Link href="/admin" className="hover:text-emerald-400">Admin</Link>
                <Link href="/chat" className="hover:text-emerald-400">Chat</Link> 
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-10">{children}</div>
          </main>

          <footer className="border-t border-slate-800 text-xs text-slate-500 py-3">
            <div className="max-w-5xl mx-auto px-4 flex justify-between">
              <span>ExpensAI · Academic Project</span>
              <span>Built with Next.js & Supabase</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
