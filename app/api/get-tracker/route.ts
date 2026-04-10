import { NextResponse } from "next/server";
import { trackers } from "@/lib/trackers";

export async function GET() {
  // I-return lang ang metadata — walang questions, scores, tiers!
  return NextResponse.json(trackers.map(t => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    desc: t.desc,
    totalQuestions: t.questions.length,
  })));
}