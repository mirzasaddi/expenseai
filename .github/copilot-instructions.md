# Copilot Agent Instructions — ExpenseAI

This file helps AI coding assistants get productive quickly in the ExpenseAI codebase.

Summary / Big picture
- This is a Next.js (App Router) TypeScript app in `src/app/` that contains client pages and an API surface under `src/app/api/`.
- Key flows:
  - Upload flow (`/upload`) reads CSV client-side and posts to serverless API `/api/analyze`.
  - `/api/analyze` (server-side) parses CSV, builds a `system` prompt and calls Groq LLM (`groq-sdk`) to return strict JSON for classification and a summary.
  - `src/lib/classifier.ts` contains a small, deterministic local classifier for simple heuristics used by the project.

Critical files to inspect and reference
- `src/app/api/analyze/route.ts` — central server route that converts CSV -> rows -> calls Groq chat completion. Contains:
  - CSV parsing logic (parses `date`, `description`, `amount`).
  - TypeScript `AnalysisResult` used by the client UI.
  - System prompt (strict JSON rules) and Groq call with `response_format: { type: 'json_object' }`.
- `src/lib/groq.ts` — Groq client wrapper; requires `GROQ_API_KEY` in `.env.local`.
- `src/lib/classifier.ts` — local fallback classifier; contains category heuristics with regexes.
- `src/app/upload/page.tsx` — client upload UI; reads file text and POSTs to `/api/analyze`.
- `src/app/chat/page.tsx` — chat front-end that references `ExpenseRow` and interacts with model-based flows (see `ChatPage` and message handling). Use this to inspect the state shape the UI expects.
- `README.md`, `package.json` — basic developer scripts and project description.
- `next.config.ts` — project Next.js settings.

Developer workflows & commands
- Development server (hot reload):
  - npm: `npm run dev`
  - pnpm: `pnpm dev` (accepted by create-next-app).
- Build: `npm run build`.
- Start production: `npm run start`.
- Linting: `npm run lint`.
- Keys & local env: place secrets in `.env.local`. `GROQ_API_KEY` is required by `src/lib/groq.ts` or server startup will fail.

Project-specific conventions and patterns
- App Router: the repository uses Next.js App Router (`src/app/`) with server components and client components. Follow the `"use client"` directive for components that rely on browser-only behavior.
- Shared libs go in `src/lib/` (e.g., `groq.ts`, `classifier.ts`). Keep helpers/clients in this folder and avoid heavy logic or secrets in client-side code.
- Strict JSON contract: The server uses a system prompt that enforces strict JSON (AnalysisResult). The client expects TypeScript typed data: keep types aligned between `POST` handler and React client types.
- Error handling: API routes return JSON with `{ error: string }` and standard status codes (400/500). The client inspects `res.ok` and shows `error` if present.
- Logging: API route logs CSV and Groq results; the project relies on console logs for debugging in dev.

Integration points & external dependencies
- Groq: modeled through `groq-sdk` and configured via `GROQ_API_KEY` in `.env.local`. `src/app/api/analyze/route.ts` triggers the chat completions.
  - Be mindful: the repo log shows `llama-3.1-70b-versatile` was used but is decommissioned; pick a supported Groq model when updating.
- `openai` dependency is present but not currently used by core flows; do not assume OpenAI integration unless adding new features.
- Future planned integration: Supabase storage and dashboards (annotation comment in `upload/page.tsx`). For now, the pipeline is “client parse -> POST -> LLM -> client render”.

How to add a new "agent" or a task-specific augmenting bot
- Add the agent in `src/agents/` or a new server-only file like `src/lib/agent.ts`.
- Patterns for agent additions:
  1. Keep PoC logic server-only (no secret leaks) — create a server route or server-side helper.
  2. Use the existing Groq client wrapper in `src/lib/groq.ts` to make calls.
  3. Reuse types in `src/app/api/analyze/route.ts` to produce consistent JSON contract.
  4. For user-facing features, add a UI page under `src/app/` and call the new server route via `fetch` (similar to `upload/page.tsx`).

Coding rules for AI agents
- Do not change global secrets or commit `.env.local`.
- When modifying model prompts or types, update both the `systemPrompt` and the TypeScript `AnalysisResult` definition for contract compatibility.
- Prefer deterministic behavior (temperature 0.1) for classification tasks to avoid non-deterministic outputs.
- Validate all LLM responses server-side. If JSON parse fails, return `raw` to client and avoid silent failures.
- When updating or replacing models: update the model name in `route.ts` and run the dev server to validate responses.

Examples to reference for new agents
- Build server LLM prompts in `src/app/api/analyze/route.ts` and set `response_format: { type: 'json_object' }`.
- Use `groq.chat.completions.create(...)` with `messages` matching the `system` prompt + `user` payload.
- For local fallback or heuristics, see `src/lib/classifier.ts` for category regex heuristics.

Suggestions for safely extending code
- Add tests (or a new `tests/` folder) for CSV parsing and classification when adding models or agents.
- Keep UI components simple and stateless; extract complex logic to `src/lib/` so it can be unit-tested.
- If you add a background or scheduled agent (e.g., for periodic classification), build it as server-side job and ensure secrets are read from env variables.

Where to ask for guidance / PR review notes
- When changing the LLM prompt or response contract, call out the change in PR, include sample input/expected output, and update `src/app/upload/page.tsx` types if needed.
- If you add a new agent, add a concise README in `src/agents/` describing its purpose and any environment variables it needs.

FAQ & quick troubleshooting
- Q: Dev server throws: "GROQ_API_KEY is not set in .env.local" — A: Add `GROQ_API_KEY=...` to `.env.local`.
- Q: Groq model returns a model decommissioned error — A: Update the `model` parameter in `src/app/api/analyze/route.ts` to a supported model.
- Q: AI returns text instead of JSON — A: Check the system prompt strictness and `response_format` in the request; fallback code returns `raw` in the response, and the client shows it as `result.raw`.

If anything in these instructions is unclear or incomplete, leave a comment here and I’ll iterate. When you want an example agent added to the codebase (e.g., a Groq-based helper or scheduled agent), let me know the exact behavior and I’ll implement it and wire up a minimal UI route and tests.
