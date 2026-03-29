import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const rateMap = new Map<string, number>();
const RATE_LIMIT_MS = 8_000;

interface QuestionAnswer {
  question: string;
  selectedAnswer: string | null;
}

interface AskAiRequest {
  firstName: string;
  trackerName: string;
  score: number;
  maxScore: number;
  tier: string;
  tierLabel: string;
  questions: QuestionAnswer[];
  question: string; // the user's actual question
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const now = Date.now();
  const last = rateMap.get(ip) ?? 0;

  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: "Please wait a moment before asking again." },
      { status: 429 }
    );
  }
  rateMap.set(ip, now);

  if (rateMap.size > 5000) {
    const cutoff = now - 60_000;
    for (const [key, ts] of rateMap.entries()) {
      if (ts < cutoff) rateMap.delete(key);
    }
  }

  try {
    const body = (await req.json()) as AskAiRequest;

    const {
      firstName,
      trackerName,
      score,
      maxScore,
      tier,
      tierLabel,
      questions,
      question,
    } = body;

    const safeName = (firstName ?? "").slice(0, 50).replace(/[<>]/g, "");
    const safeQuestion = (question ?? "").slice(0, 300).replace(/[<>]/g, "");

    if (!safeQuestion.trim()) {
      return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    }

    const answersBlock = (questions ?? [])
      .map((q) => `• ${q.question}\n  → ${q.selectedAnswer ?? "Not answered"}`)
      .join("\n");

    const systemPrompt = `You are a knowledgeable wellness advisor for Lifefort, an Independent USANA Brand Partner. 
You are answering questions from ${safeName} who just completed the "${trackerName}" assessment.

Their result context:
- Tier: ${tier} (${tierLabel})
- Score: ${score}/${maxScore}

Their assessment answers:
${answersBlock}

Guidelines:
- Be warm, helpful, and concise (2–4 sentences max)
- Refer to their specific answers when relevant
- Never diagnose, prescribe, or make medical claims
- If asked about products, you may mention USANA products generally but remind them to consult their Lifefort advisor
- If the question is unrelated to wellness, politely redirect
- Always end with one practical, doable suggestion`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 250,
      system: systemPrompt,
      messages: [{ role: "user", content: safeQuestion }],
    });

    const answer =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[ask-ai] Error:", error);
    return NextResponse.json(
      { error: "Unable to answer right now. Please try again." },
      { status: 500 }
    );
  }
}
