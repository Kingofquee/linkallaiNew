import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY     = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY  = process.env.ANTHROPIC_API_KEY;
const GOOGLE_API_KEY     = process.env.GOOGLE_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const OPENAI_MODEL     = process.env.OPENAI_MODEL     || "gpt-4o-mini";
const ANTHROPIC_MODEL  = process.env.ANTHROPIC_MODEL  || "claude-3-opus-20240229";
const GEMINI_MODEL     = process.env.GEMINI_MODEL     || "gemini-1.5-flash";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-70b-instruct";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json() as { prompt: string };
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const tasks: Promise<[string, string]>[] = [
      askOpenAI(prompt).then(txt => ["ChatGPT", txt]),
      askAnthropic(prompt).then(txt => ["Claude", txt]),
      askGemini(prompt).then(txt => ["Gemini", txt]),
      askMetaViaOpenRouter(prompt).then(txt => ["MetaAI", txt]),
    ];

    const settled = await Promise.allSettled(tasks);
    const result: Record<string, string> = {};
    for (const s of settled) {
      if (s.status === "fulfilled") {
        const [name, text] = s.value;
        result[name] = text;
      }
    }
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error("ask error", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* ---------------- Providers ---------------- */

async function askOpenAI(prompt: string) {
  if (!OPENAI_API_KEY) return "OpenAI not configured.";
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are ChatGPT." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    }),
  });
  if (!r.ok) return `OpenAI error: ${await r.text()}`;
  const data = await r.json();
  return data?.choices?.[0]?.message?.content ?? "No response.";
}

async function askAnthropic(prompt: string) {
  if (!ANTHROPIC_API_KEY) return "Anthropic not configured.";
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }]
    }),
  });
  if (!r.ok) return `Anthropic error: ${await r.text()}`;
  const data = await r.json();
  return data?.content?.[0]?.text ?? "No response.";
}

async function askGemini(prompt: string) {
  if (!GOOGLE_API_KEY) return "Gemini not configured.";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${GOOGLE_API_KEY}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!r.ok) return `Gemini error: ${await r.text()}`;
  const data = await r.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";
}

async function askMetaViaOpenRouter(prompt: string) {
  if (!OPENROUTER_API_KEY) return "Meta (via OpenRouter) not configured.";
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: "You are Meta AI (Llama 3 family)." },
        { role: "user", content: prompt }
      ]
    }),
  });
  if (!r.ok) return `Meta(OpenRouter) error: ${await r.text()}`;
  const data = await r.json();
  return data?.choices?.[0]?.message?.content ?? "No response.";
}
