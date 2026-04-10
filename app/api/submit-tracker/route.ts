import { NextResponse } from "next/server";
import { trackers, getTier } from "@/lib/trackers";

export async function POST(req: Request) {
  const { trackerId, answers } = await req.json();
  const tracker = trackers.find(t => t.id === trackerId);
  if (!tracker) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Scoring nasa server — HINDI makikita sa browser!
  const score = answers.reduce((s: number, a: number, qi: number) =>
    s + (tracker.questions[qi]?.options[a]?.score ?? 0), 0
  );

  const maxScore = tracker.questions.length * 3;
  const tier = getTier(score, tracker.questions.length);
  const td = tracker.tiers[tier];

  return NextResponse.json({
    score,
    maxScore,
    tier,
    tierLabel: td.label,
    summary: td.summary,
    insights: td.insights,
    products: td.products,
    tips: td.tips,
    scorePct: Math.round((score / maxScore) * 100),
  });
}