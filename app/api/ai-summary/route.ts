import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory rate limiting (resets on server restart)
// For production: use Upstash Redis or similar
const rateMap = new Map<string, number>();
const RATE_LIMIT_MS = 15_000; // 15 seconds between requests per IP

interface QuestionAnswer {
  question: string;
  selectedAnswer: string | null;
}

interface AiSummaryRequest {
  firstName: string;
  trackerName: string;
  score: number;
  maxScore: number;
  tier: string;
  tierLabel: string;
  baseSummary: string;
  questions: QuestionAnswer[];
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const now = Date.now();
  const last = rateMap.get(ip) ?? 0;

  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: "Please wait a moment before trying again." },
      { status: 429 }
    );
  }
  rateMap.set(ip, now);

  // Prune old entries (memory safety)
  if (rateMap.size > 5000) {
    const cutoff = now - 60_000;
    for (const [key, ts] of rateMap.entries()) {
      if (ts < cutoff) rateMap.delete(key);
    }
  }

  try {
    const body = (await req.json()) as AiSummaryRequest;

    const { firstName, trackerName, score, maxScore, tier, tierLabel, baseSummary, questions } = body;

    // Sanitize inputs
    const safeName = (firstName ?? "").slice(0, 50).replace(/[<>]/g, "");
    const safeTrackerName = (trackerName ?? "").slice(0, 80);

    const answersBlock = (questions ?? [])
      .map((q) => `• ${q.question}\n  → ${q.selectedAnswer ?? "Not answered"}`)
      .join("\n");

    const prompt = `You are a warm, knowledgeable wellness advisor for Lifefort, an Independent USANA Brand Partner in the Philippines.

A user named ${safeName} just completed the "${safeTrackerName}" wellness assessment.

Assessment result:
- Tier: ${tier} (${tierLabel})
- Score: ${score} out of ${maxScore}
- Base summary: ${baseSummary}

Their specific answers:
${answersBlock}

Write a warm, personalized 3–4 sentence wellness summary for ${safeName}. 
Requirements:
- Reference 1–2 specific answers they gave to make it feel personal
- Be encouraging and supportive, never alarming
- End with one gentle, actionable next step
- Do NOT diagnose or make medical claims
- Do NOT mention specific product names
- Write in second person ("you / your")
- Keep it under 80 words`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const summary =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("[ai-summary] Error:", error);
    return NextResponse.json(
      { error: "Unable to generate AI summary right now. Please try again." },
      { status: 500 }
    );
  }
}
