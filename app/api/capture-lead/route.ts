import { NextRequest, NextResponse } from "next/server";

interface LeadCaptureRequest {
  firstName: string;
  email: string;
  trackerId: string;
  trackerName: string;
  tier: string;
  score: number;
  maxScore: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadCaptureRequest;

    const { firstName, email, trackerId, trackerName, tier, score, maxScore } = body;

    // ── Basic validation ───────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!firstName?.trim() || !emailRegex.test(email ?? "")) {
      return NextResponse.json({ error: "Invalid name or email." }, { status: 400 });
    }

    // ── Log for development ────────────────────────────────────
    console.log("[lead-capture]", {
      firstName,
      email,
      trackerId,
      trackerName,
      tier,
      score,
      maxScore,
      capturedAt: new Date().toISOString(),
    });

    // ── TODO: Integrate your email service here ────────────────
    // Option A: Mailchimp
    // await fetch(`https://us1.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: "subscribed",
    //     merge_fields: { FNAME: firstName },
    //     tags: [trackerName, `tier:${tier}`],
    //   }),
    // });

    // Option B: Resend (recommended)
    // await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     from: "Lifefort <hello@yourdomain.com>",
    //     to: email,
    //     subject: `Your ${trackerName} Results — Lifefort Wellness`,
    //     html: `<p>Hi ${firstName}, here are your results...</p>`,
    //   }),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[capture-lead] Error:", error);
    return NextResponse.json(
      { error: "Unable to save your details. Please try again." },
      { status: 500 }
    );
  }
}
