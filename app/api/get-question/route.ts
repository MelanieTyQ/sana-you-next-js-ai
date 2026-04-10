import { NextResponse } from "next/server";
import { trackers } from "@/lib/trackers";

export async function POST(req: Request) {
  const { trackerId, questionIndex } = await req.json();
  const tracker = trackers.find(t => t.id === trackerId);
  if (!tracker) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const q = tracker.questions[questionIndex];
  return NextResponse.json({
    q: q.q,
    sub: q.sub ?? null,
    // Options text lang — walang score!
    options: q.options.map(o => ({ text: o.text })),
    isLast: questionIndex === tracker.questions.length - 1,
  });
}
