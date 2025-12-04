/*import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});
*/
// src/lib/groq.ts
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in .env.local");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
