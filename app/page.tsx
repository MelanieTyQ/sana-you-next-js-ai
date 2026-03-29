"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { trackers, getTier, type TierKey } from "@/lib/trackers";
import {
  products,
  categoryLabels,
  productShapeIcons,
  type ProductCategory,
} from "@/lib/products";

type QuizPage = "hub" | "quiz" | "tease" | "full";

const resultIcons: Record<string, string> = {
  cell:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`,
  omega:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 4C8 4 4 7 4 11s3 6 6 6h.5M12 4c4 0 8 3 8 7s-3 6-6 6h-.5M8 17v3M16 17v3"/></svg>`,
  energy:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  sleep:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  brain:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9.5 2A2.5 2.5 0 007 4.5v.5a3 3 0 00-3 3v1a3 3 0 003 3v1a2.5 2.5 0 002.5 2.5"/><path d="M14.5 2A2.5 2.5 0 0117 4.5v.5a3 3 0 013 3v1a3 3 0 01-3 3v1A2.5 2.5 0 0114.5 17"/><line x1="12" y1="2" x2="12" y2="17"/><path d="M9.5 17a2.5 2.5 0 005 0"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  mineral:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="8" y="3" width="8" height="18" rx="3"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="15" x2="16" y2="15"/></svg>`,
  pack:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  liver:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3c4 0 8 2.5 8 7 0 3-2 5-5 6-1 .3-2 .5-3 .5-3 0-7-2-7-6.5C5 6 8 3 12 3z"/><path d="M12 16.5V21M9 21h6"/></svg>`,
  antioxidant:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
};

const STARTER_QS = [
  "What should I improve first based on my result?",
  "Can you explain my result in simple words?",
  "Which daily habit would help me the most this week?",
  "Which product fits my result best?",
] as const;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ── Reusable helpers ───────────────────────────────────────────
function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily:"var(--font-lora,serif)", fontSize:"1.1rem", fontWeight:600, color:"var(--navy)", marginBottom:12, paddingBottom:8, borderBottom:"2px solid var(--royal)" }}>
      {children}
    </div>
  );
}

function OutBtn({ children, onClick, color="var(--royal)" }: { children: React.ReactNode; onClick: () => void; color?: string }) {
  return (
    <button type="button" onClick={onClick}
      style={{ fontSize:".76rem", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color, background:"none", border:`1.5px solid ${color}`, padding:"11px 22px", borderRadius:2, cursor:"pointer" }}
      onMouseEnter={e => { e.currentTarget.style.background=color; e.currentTarget.style.color="#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color=color; }}>
      {children}
    </button>
  );
}

function SolidBtn({ children, onClick, bg="var(--royal)" }: { children: React.ReactNode; onClick: () => void; bg?: string }) {
  return (
    <button type="button" onClick={onClick}
      style={{ fontSize:".76rem", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#fff", background:bg, border:"none", padding:"11px 22px", borderRadius:2, cursor:"pointer" }}
      onMouseEnter={e => { e.currentTarget.style.opacity=".85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
      {children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
export default function LifefortPage() {
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [filter, setFilter] = useState<ProductCategory | "all">("all");

  // Quiz
  const [quizPage, setQuizPage] = useState<QuizPage>("hub");
  const [trackerId, setTrackerId] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [scorePct, setScorePct] = useState(0);

  // AI
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiQ, setAiQ] = useState("");
  const [aiA, setAiA] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState("");

  // Contact
  const [cF,setCF]=useState(""); const [cL,setCL]=useState(""); const [cE,setCE]=useState("");
  const [cP,setCP]=useState(""); const [cG,setCG]=useState(""); const [cM,setCM]=useState("");

  const trackersRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try { const s=sessionStorage.getItem("lf_c"); if(s) setCompleted(JSON.parse(s)); } catch {}
    const t = setTimeout(() => setPopupOpen(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg); setTimeout(() => setToast(""), 3200);
  }, []);

  const addToCart = (name: string) => {
    setCartCount(c => c + 1); showToast(`${name} added to order`);
  };

  const tracker = useMemo(() => trackers.find(t => t.id === trackerId) ?? null, [trackerId]);
  const score = useMemo(() => {
    if (!tracker) return 0;
    return answers.reduce((s, a, qi) => s + (tracker.questions[qi]?.options[a]?.score ?? 0), 0);
  }, [answers, tracker]);

  const tier: TierKey = tracker ? getTier(score, tracker.questions.length) : "good";
  const td = tracker ? tracker.tiers[tier] : null;
  const maxS = tracker ? tracker.questions.length * 3 : 0;
  const prog = tracker ? Math.round(((currentQ + 1) / tracker.questions.length) * 100) : 0;
  const remaining = trackers.filter(t => !completed[t.id] && t.id !== trackerId);
  const doneCount = Object.keys(completed).length;
  const filteredProds = filter === "all" ? products : products.filter(p => p.category === filter);

  const scrollToTrackers = () => trackersRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });

  const startTracker = (id: string) => {
    setTrackerId(id); setCurrentQ(0); setAnswers([]); setFirstName(""); setEmail("");
    setAiSummary(""); setAiError(""); setAiQ(""); setAiA(""); setScorePct(0);
    setQuizPage("quiz"); scrollToTrackers();
  };

  const nextQ = () => {
    if (!tracker || answers[currentQ] === undefined) return;
    if (currentQ < tracker.questions.length - 1) { setCurrentQ(p => p + 1); }
    else {
      const s = answers.reduce((acc, a, qi) => acc + (tracker.questions[qi].options[a]?.score ?? 0), 0);
      setQuizPage("tease");
      setTimeout(() => setScorePct(Math.round((s / (tracker.questions.length * 3)) * 100)), 200);
    }
    scrollToTrackers();
  };

  const prevQ = () => { if (currentQ > 0) setCurrentQ(p => p - 1); else setQuizPage("hub"); scrollToTrackers(); };

  const payload = () => ({
    firstName, email, trackerId: tracker?.id, trackerName: tracker?.name,
    score, maxScore: maxS, tier, tierLabel: td?.label, baseSummary: td?.summary,
    questions: tracker?.questions.map((q, qi) => ({
      question: q.q,
      selectedAnswer: answers[qi] !== undefined ? q.options[answers[qi]]?.text ?? null : null,
    })) ?? [],
  });

  const genSummary = async () => {
    if (!tracker || !td) return;
    setAiLoading(true); setAiError(""); setAiSummary("");
    try {
      const r = await fetch("/api/ai-summary", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload()) });
      const d = await r.json() as { summary?: string; error?: string };
      if (!r.ok) throw new Error(d.error ?? "Error");
      setAiSummary(d.summary ?? "");
    } catch(e) { setAiError(e instanceof Error ? e.message : "Unable to generate summary."); }
    finally { setAiLoading(false); }
  };

  const unlock = async () => {
    if (!firstName.trim()) { showToast("Please enter your first name"); return; }
    if (!isEmail(email)) { showToast("Please enter a valid email address"); return; }
    try { await fetch("/api/capture-lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload())}); } catch {}
    if (trackerId) {
      const u = {...completed,[trackerId]:true}; setCompleted(u);
      try { sessionStorage.setItem("lf_c",JSON.stringify(u)); } catch {}
    }
    showToast(`Welcome, ${firstName}! Opening your full report… 🌿`);
    setQuizPage("full"); scrollToTrackers(); void genSummary();
  };

  const askAi = async (q?: string) => {
    const fq = (q ?? aiQ).trim(); if (!fq) return;
    setAskLoading(true); setAskError(""); setAiA(""); setAiQ(fq);
    try {
      const r = await fetch("/api/ask-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload(),question:fq})});
      const d = await r.json() as { answer?: string; error?: string };
      if (!r.ok) throw new Error(d.error ?? "Error");
      setAiA(d.answer ?? "");
    } catch(e) { setAskError(e instanceof Error ? e.message : "Unable to answer."); }
    finally { setAskLoading(false); }
  };

  const submitContact = () => {
    if (!cF.trim() || !isEmail(cE)) { showToast("Please fill in your name and email"); return; }
    showToast(`Thank you ${cF}! We'll contact you within 24 hours. 🌿`);
    setCF(""); setCL(""); setCE(""); setCP(""); setCG(""); setCM("");
  };

  const TC = { good:{lbl:"var(--green)"}, mid:{lbl:"var(--amber)"}, low:{lbl:"var(--red)"} };

  // ──────────────────────────────────────────────────────────
  return (
    <div>
      {/* TOP BAR */}
      <div style={{background:"var(--navy)",padding:"7px 48px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:".7rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"var(--light-blue)"}}>
          LIFEFORT <span style={{color:"rgba(255,255,255,.5)",margin:"0 6px"}}>|</span> Independent USANA Brand Partner
        </span>
        <span style={{fontSize:".68rem",color:"rgba(255,255,255,.55)"}}>📍 Philippines · 🕐 Mon–Sat 9AM–6PM</span>
      </div>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 48px",height:66,background:"#fff",borderBottom:"3px solid var(--royal)",boxShadow:"0 2px 16px rgba(6,36,96,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="#" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <svg style={{width:36,height:36}} viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#79bde9" strokeWidth="1"/>
              <path d="M8 18 Q14 14 20 18 Q26 22 32 18 Q38 14 40 18" stroke="#79bde9" strokeWidth="1.5" fill="none"/>
              <path d="M6 28 Q12 24 18 28 Q24 32 30 28 Q36 24 42 28" stroke="#007dc3" strokeWidth="1.5" fill="none"/>
              <path d="M16 8 Q14 18 16 28 Q18 38 20 40" stroke="#007dc3" strokeWidth="1" fill="none"/>
              <path d="M32 8 Q34 18 32 28 Q30 38 28 40" stroke="#79bde9" strokeWidth="1" fill="none"/>
            </svg>
            <div>
              <span style={{display:"block",fontFamily:"var(--font-lora,serif)",fontSize:"1.2rem",fontWeight:600,color:"var(--navy)"}}>Lifefort</span>
              <span style={{display:"block",fontSize:".55rem",fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:"var(--sky)"}}>Independent USANA Brand Partner</span>
            </div>
          </a>
          <div style={{width:1,height:32,background:"var(--border)"}}/>
          <span style={{fontSize:".62rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"var(--muted)"}}>USANA®</span>
        </div>
        <ul style={{display:"flex",gap:28,listStyle:"none",margin:0,padding:0}}>
          {[["#products","Products"],["#trackers","Wellness Check"],["#contact","Consult"]].map(([h,l])=>(
            <li key={h}><a href={h} style={{fontSize:".78rem",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"var(--text-mid)",textDecoration:"none"}}
              onMouseEnter={e=>{e.currentTarget.style.color="var(--royal)"}}
              onMouseLeave={e=>{e.currentTarget.style.color="var(--text-mid)"}}>{l}</a></li>
          ))}
        </ul>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setPopupOpen(true)}
            style={{fontSize:".76rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--royal)",background:"none",border:"1.5px solid var(--royal)",padding:"8px 16px",borderRadius:2,cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.background="var(--royal)";e.currentTarget.style.color="#fff"}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--royal)"}}>
            Free Consult
          </button>
          <button onClick={()=>showToast(`${cartCount} item${cartCount!==1?"s":""} in your order`)}
            style={{display:"flex",alignItems:"center",gap:8,fontSize:".76rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#fff",background:"var(--royal)",border:"none",padding:"9px 18px",borderRadius:2,cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.background="var(--navy)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="var(--royal)"}}>
            🛍 My Order <span style={{background:"var(--sky)",color:"#fff",fontSize:".68rem",fontWeight:700,padding:"2px 7px",borderRadius:20}}>{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:"linear-gradient(135deg,var(--navy) 0%,var(--royal) 55%,#005ea8 100%)",padding:"72px 48px 64px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:".72rem",fontWeight:700,letterSpacing:".2em",textTransform:"uppercase",color:"var(--light-blue)",marginBottom:18,background:"rgba(121,189,233,.12)",padding:"6px 14px",borderRadius:2}}>
            🔬 Science-Based Cellular Nutrition
          </div>
          <h1 style={{fontFamily:"var(--font-lora,serif)",fontSize:"clamp(2.2rem,4vw,4rem)",fontWeight:600,lineHeight:1.1,color:"#fff",marginBottom:8}}>
            Nourish, Protect<br />&amp; <em style={{fontStyle:"italic",color:"var(--light-blue)"}}>Renew</em> Your Cells
          </h1>
          <p style={{fontSize:".82rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.55)",marginBottom:20}}>
            <strong style={{color:"var(--light-blue)"}}>Lifefort</strong> — Your Trusted Independent USANA Brand Partner
          </p>
          <p style={{fontSize:"1rem",lineHeight:1.8,color:"rgba(255,255,255,.72)",maxWidth:420,marginBottom:28}}>
            We help Filipinos achieve lasting health through USANA&apos;s award-winning, pharmaceutical-grade nutrition. Science-backed. Clinically tested. Life-changing.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button onClick={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}
              style={{fontSize:".82rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",background:"#fff",color:"var(--navy)",padding:"13px 28px",borderRadius:2,border:"none",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--light-blue)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="#fff"}}>
              Shop Products
            </button>
            <button onClick={()=>document.getElementById("trackers")?.scrollIntoView({behavior:"smooth"})}
              style={{fontSize:".82rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",background:"none",color:"#fff",padding:"13px 28px",borderRadius:2,border:"1.5px solid rgba(255,255,255,.45)",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="none"}}>
              Free Wellness Check
            </button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{icon:"🏆",t:"5-Star Rated",s:"NutriSearch Comparative Guide"},{icon:"🔬",t:"InCelligence™ Tech",s:"Patented cell-signaling technology"},{icon:"✅",t:"NSF Certified",s:"Independently tested — purity & potency"},{icon:"🌍",t:"24 Countries",s:"Trusted by 1,000+ pro athletes worldwide"}].map(b=>(
            <div key={b.t} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.14)",borderRadius:3,padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
              <span style={{fontSize:"1.3rem",lineHeight:1}}>{b.icon}</span>
              <div>
                <strong style={{display:"block",fontSize:".78rem",fontWeight:700,color:"#fff",marginBottom:2}}>{b.t}</strong>
                <span style={{fontSize:".68rem",color:"rgba(255,255,255,.5)",lineHeight:1.4}}>{b.s}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="trust-strip">
        <div className="strip-inner">
          {["FDA-Registered Facility","NSF Certified for Sport®","Pharmaceutical GMP","100% Potency Guaranteed","InCelligence™ Technology","Science-Based Since 1992","Lifefort Certified Partner",
            "FDA-Registered Facility","NSF Certified for Sport®","Pharmaceutical GMP","100% Potency Guaranteed","InCelligence™ Technology","Science-Based Since 1992","Lifefort Certified Partner"].map((item,i)=>(
            <span key={i} className="strip-item"><span className="strip-dot"/>{item}</span>
          ))}
        </div>
      </div>

      {/* WELLNESS TRACKER SECTION */}
      <section id="trackers" ref={trackersRef} style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"56px 48px"}}>

        {/* HUB */}
        {quizPage==="hub"&&(
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".2em",textTransform:"uppercase",color:"var(--sky)",marginBottom:10}}>🔬 Free Wellness Assessment</div>
              <h2 style={{fontFamily:"var(--font-lora,serif)",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:600,color:"var(--navy)",lineHeight:1.2,marginBottom:14}}>
                How Is Your Body <em style={{fontStyle:"italic",color:"var(--sky)"}}>Really</em> Doing?
              </h2>
              <p style={{fontSize:".94rem",color:"var(--muted)",maxWidth:580,margin:"0 auto",lineHeight:1.8}}>
                Answer a few honest questions across 5 key wellness areas. Get a personalized snapshot and the right USANA support. 100% free.
              </p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
              {trackers.map(t=>(
                <button key={t.id} type="button" onClick={()=>startTracker(t.id)}
                  className="tracker-tile"
                  style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:4,padding:"28px 24px 24px",cursor:"pointer",textAlign:"left",width:"100%"}}>
                  {completed[t.id]&&<span style={{position:"absolute",top:14,right:14,fontSize:".62rem",fontWeight:700,background:"var(--green-bg)",color:"var(--green)",padding:"2px 8px",borderRadius:20,border:"1px solid var(--green-bdr)"}}>✓ Done</span>}
                  <div style={{fontSize:"2.2rem",marginBottom:14,lineHeight:1}}>{t.icon}</div>
                  <div style={{fontFamily:"var(--font-lora,serif)",fontSize:"1.1rem",fontWeight:600,color:"var(--navy)",marginBottom:6}}>{t.name}</div>
                  <div style={{fontSize:".8rem",color:"var(--muted)",lineHeight:1.6,marginBottom:18}}>{t.desc}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--light-blue)",background:"rgba(0,125,195,.08)",padding:"3px 10px",borderRadius:20}}>5 Questions · ~2 min</span>
                    <span style={{fontSize:".74rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--royal)"}}>{completed[t.id]?"✓ Retake":"Start →"}</span>
                  </div>
                </button>
              ))}
            </div>
            <div style={{marginTop:48,padding:"18px 22px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:3,fontSize:".72rem",color:"var(--muted)",lineHeight:1.7}}>
              <strong style={{color:"var(--text-mid)"}}>Important:</strong> This assessment is for general wellness awareness only. Results do not constitute a medical diagnosis. USANA products are not intended to diagnose, treat, cure, or prevent any disease. Always consult your physician before starting any supplement program. Lifefort is an Independent Associate of USANA Health Sciences, Inc.
            </div>
          </div>
        )}

        {/* QUIZ */}
        {quizPage==="quiz"&&tracker&&(
          <div style={{maxWidth:720,margin:"0 auto",paddingBottom:40}} className="fade-up">
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:".72rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)"}}>{tracker.name}</span>
                <span style={{fontSize:".72rem",fontWeight:700,color:"var(--royal)"}}>Question {currentQ+1} of {tracker.questions.length}</span>
              </div>
              <div style={{height:6,background:"var(--surface-2)",borderRadius:3,overflow:"hidden"}}>
                <div className="prog-fill" style={{width:`${prog}%`,height:"100%",borderRadius:3,background:"linear-gradient(90deg,var(--navy),var(--sky))"}}/>
              </div>
            </div>
            <div style={{marginBottom:32}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:".68rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"var(--sky)",background:"rgba(0,125,195,.08)",padding:"5px 12px",borderRadius:20,marginBottom:12}}>
                {tracker.icon} {tracker.name}
              </div>
              <h3 style={{fontFamily:"var(--font-lora,serif)",fontSize:"1.35rem",fontWeight:500,color:"var(--navy)",lineHeight:1.4}}>{tracker.questions[currentQ].q}</h3>
              {tracker.questions[currentQ].sub&&<p style={{fontSize:".82rem",color:"var(--muted)",marginTop:6,lineHeight:1.6}}>{tracker.questions[currentQ].sub}</p>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
              {tracker.questions[currentQ].options.map((opt,i)=>{
                const sel=answers[currentQ]===i;
                return(
                  <button key={opt.text} type="button" onClick={()=>{const n=[...answers];n[currentQ]=i;setAnswers(n);}}
                    className={sel?"opt-selected":""}
                    style={{display:"flex",alignItems:"center",gap:14,background:sel?"rgba(0,82,155,.06)":"var(--surface)",border:sel?"1.5px solid var(--royal)":"1.5px solid var(--border)",borderRadius:3,padding:"14px 18px",cursor:"pointer",textAlign:"left",fontSize:".94rem",transition:"all .2s"}}
                    onMouseEnter={e=>{if(!sel){e.currentTarget.style.borderColor="var(--sky)";e.currentTarget.style.background="rgba(0,125,195,.04)";}}}
                    onMouseLeave={e=>{if(!sel){e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--surface)";}}}>
                    <div className="opt-radio"/>
                    <span style={{color:"var(--text-mid)",lineHeight:1.4}}>{opt.text}</span>
                  </button>
                );
              })}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <button type="button" onClick={prevQ} style={{fontSize:".76rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",background:"none",border:"1.5px solid var(--border)",padding:"10px 20px",borderRadius:2,cursor:"pointer"}}>← Back</button>
              <button type="button" onClick={nextQ} disabled={answers[currentQ]===undefined}
                style={{fontSize:".78rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#fff",background:answers[currentQ]===undefined?"var(--silver)":"var(--royal)",border:"none",padding:"11px 28px",borderRadius:2,cursor:answers[currentQ]===undefined?"not-allowed":"pointer"}}>
                {currentQ===tracker.questions.length-1?"See My Results →":"Next →"}
              </button>
            </div>
          </div>
        )}

        {/* TEASE */}
        {quizPage==="tease"&&tracker&&td&&(
          <div style={{maxWidth:640,margin:"0 auto",paddingBottom:40}} className="fade-up">
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:4,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,82,155,.1)"}}>
              <div style={{background:"linear-gradient(135deg,var(--navy) 0%,var(--royal) 100%)",padding:"28px 28px 24px"}}>
                <div style={{fontSize:".7rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"var(--light-blue)",marginBottom:8}}>{tracker.icon} {tracker.name} — Results</div>
                <div style={{fontFamily:"var(--font-lora,serif)",fontSize:"1.4rem",fontWeight:600,color:"#fff",marginBottom:16}}>{td.label}</div>
                <div style={{height:10,background:"rgba(255,255,255,.15)",borderRadius:5,overflow:"hidden"}}>
                  <div className="score-bar-fill" style={{width:`${scorePct}%`,height:"100%",borderRadius:5,background:"linear-gradient(90deg,var(--light-blue),#fff)"}}/>
                </div>
                <div style={{fontSize:".72rem",fontWeight:700,color:"rgba(255,255,255,.65)",marginTop:6,textAlign:"right"}}>Concern Score: {score} / {maxS}</div>
              </div>
              <div style={{padding:"24px 28px"}}>
                <div style={{fontFamily:"var(--font-lora,serif)",fontSize:"1rem",fontWeight:500,color:"var(--navy)",lineHeight:1.6,marginBottom:6}}>{td.summary}</div>
                <div style={{background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:3,padding:"14px 16px",margin:"16px 0",filter:"blur(3.5px)",userSelect:"none",pointerEvents:"none"}} aria-hidden="true">
                  <p style={{fontSize:".82rem",color:"var(--text-mid)",lineHeight:1.6}}>Based on your answers, your personalized USANA supplement recommendations include key products that directly address the patterns detected. Your full wellness insights and action plan are ready below.</p>
                </div>
                <div style={{fontSize:".78rem",fontWeight:700,color:"var(--royal)",marginBottom:14}}>🔓 Enter your details to unlock your full personalized report — free</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[{v:firstName,s:setFirstName,t:"text",p:"Your first name"},{v:email,s:setEmail,t:"email",p:"Your email address"}].map(({v,s,t,p})=>(
                    <input key={p} type={t} value={v} onChange={e=>s(e.target.value)} placeholder={p}
                      style={{width:"100%",padding:"12px 14px",fontFamily:"inherit",fontSize:".94rem",color:"var(--text)",border:"1.5px solid var(--border)",borderRadius:2,outline:"none",background:"var(--bg)"}}
                      onFocus={e=>{e.target.style.borderColor="var(--sky)"}}
                      onBlur={e=>{e.target.style.borderColor="var(--border)"}}/>
                  ))}
                  <button type="button" onClick={unlock}
                    style={{width:"100%",fontSize:".78rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",background:"var(--royal)",color:"#fff",border:"none",padding:13,borderRadius:2,cursor:"pointer"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--navy)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="var(--royal)"}}>
                    🔓 Show My Full Wellness Report →
                  </button>
                  <p style={{fontSize:".68rem",color:"var(--muted)",textAlign:"center",lineHeight:1.5}}>🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULL RESULT */}
        {quizPage==="full"&&tracker&&td&&(
          <div style={{maxWidth:720,margin:"0 auto",paddingBottom:40}} className="fade-up">
            {/* Tier badge */}
            <div className={`level-${tier}`} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderRadius:3,marginBottom:24,border:"1.5px solid"}}>
              <span style={{fontSize:"1.8rem"}}>{tier==="good"?"✅":tier==="mid"?"⚠️":"🔴"}</span>
              <div>
                <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:TC[tier].lbl,marginBottom:2}}>{td.label}</div>
                <div style={{fontFamily:"var(--font-lora,serif)",fontSize:"1rem",fontWeight:500,color:"var(--navy)",lineHeight:1.4}}>{td.summary}</div>
              </div>
            </div>

            {/* AI Summary */}
            <SecTitle>Your AI Personalized Summary</SecTitle>
            {aiLoading&&<div style={{padding:"16px 20px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:3,color:"var(--muted)",fontSize:".88rem",marginBottom:20}}>⚙️ Generating your personalized AI wellness summary…</div>}
            {!aiLoading&&aiError&&<div style={{padding:"14px 18px",background:"var(--red-bg)",border:"1px solid var(--red-bdr)",borderRadius:3,color:"var(--red)",fontSize:".88rem",marginBottom:20}}>{aiError}</div>}
            {!aiLoading&&!aiError&&aiSummary&&<div style={{padding:"16px 20px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:3,marginBottom:20}}><p style={{fontSize:".94rem",lineHeight:1.8,color:"var(--text-mid)"}}>{aiSummary}</p></div>}

            {/* Insights */}
            <SecTitle>What Your Responses Suggest</SecTitle>
            <div style={{marginBottom:28}}>
              {td.insights.map((ins,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"var(--sky)",flexShrink:0,marginTop:8}}/>
                  <div style={{fontSize:".88rem",color:"var(--text-mid)",lineHeight:1.6}} dangerouslySetInnerHTML={{__html:ins.text}}/>
                </div>
              ))}
            </div>

            {/* Products */}
            <SecTitle>Suggested USANA Support Products</SecTitle>
            <p style={{fontSize:".78rem",color:"var(--muted)",marginBottom:16,lineHeight:1.6}}>Based on your responses, these USANA products may help support the wellness areas highlighted above.*</p>
            <div style={{marginBottom:28}}>
              {td.products.map(p=>(
                <div key={p.name} style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:3,padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"flex-start",gap:16}}>
                  <div style={{width:44,height:44,borderRadius:3,flexShrink:0,background:"linear-gradient(135deg,var(--navy),var(--sky))",display:"flex",alignItems:"center",justifyContent:"center"}}
                    dangerouslySetInnerHTML={{__html:resultIcons[p.icon]??resultIcons.cell}}/>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"var(--font-lora,serif)",fontSize:".96rem",fontWeight:600,color:"var(--navy)",marginBottom:3}}>{p.name}</div>
                    <div style={{fontSize:".78rem",color:"var(--muted)",lineHeight:1.6}} dangerouslySetInnerHTML={{__html:p.why}}/>
                  </div>
                  <button type="button" onClick={()=>addToCart(p.name)}
                    style={{fontSize:".7rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--royal)",background:"none",border:"1.5px solid var(--royal)",padding:"7px 14px",borderRadius:2,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--royal)";e.currentTarget.style.color="#fff"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--royal)"}}>
                    Add to Order
                  </button>
                </div>
              ))}
            </div>

            {/* Tips */}
            <SecTitle>Lifestyle Recommendations</SecTitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
              {td.tips.map((tip,i)=>(
                <div key={i} style={{background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:3,padding:"14px 16px"}}>
                  <div style={{fontSize:"1.2rem",marginBottom:6}}>{tip.icon}</div>
                  <div style={{fontSize:".8rem",color:"var(--text-mid)",lineHeight:1.6}}>{tip.text}</div>
                </div>
              ))}
            </div>

            {/* Ask AI */}
            <SecTitle>Ask Your Wellness AI</SecTitle>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {STARTER_QS.map(q=>(
                <button key={q} type="button" onClick={()=>askAi(q)}
                  style={{fontSize:".72rem",fontWeight:600,padding:"6px 12px",borderRadius:20,background:"rgba(0,125,195,.08)",color:"var(--royal)",border:"1px solid rgba(0,82,155,.2)",cursor:"pointer"}}>
                  {q}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input type="text" value={aiQ} onChange={e=>setAiQ(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")void askAi();}}
                placeholder="e.g. What foods should I eat more of?"
                style={{flex:1,padding:"11px 14px",fontSize:".88rem",border:"1.5px solid var(--border)",borderRadius:2,outline:"none",background:"var(--bg)",color:"var(--text)"}}
                onFocus={e=>{e.target.style.borderColor="var(--sky)"}}
                onBlur={e=>{e.target.style.borderColor="var(--border)"}}/>
              <button type="button" onClick={()=>askAi()} disabled={askLoading}
                style={{fontSize:".76rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#fff",background:askLoading?"var(--silver)":"var(--royal)",border:"none",padding:"11px 20px",borderRadius:2,cursor:askLoading?"not-allowed":"pointer"}}>
                {askLoading?"…":"Ask AI"}
              </button>
            </div>
            {askError&&<p style={{fontSize:".82rem",color:"var(--red)",marginBottom:8}}>{askError}</p>}
            {!askLoading&&aiA&&(
              <div style={{padding:"14px 18px",background:"rgba(0,125,195,.05)",border:"1px solid rgba(0,82,155,.15)",borderRadius:3,marginBottom:20}}>
                <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"var(--sky)",marginBottom:6}}>AI Response</div>
                <p style={{fontSize:".94rem",lineHeight:1.8,color:"var(--text-mid)"}}>{aiA}</p>
              </div>
            )}

            <div style={{marginBottom:20,padding:"14px 18px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:3,fontSize:".82rem",color:"var(--text-mid)"}}>
              📊 <strong>Trackers completed: {doneCount} of {trackers.length}</strong>
              {remaining.length>0?` — ${remaining.length} tracker${remaining.length>1?"s":""} remaining`:" — All trackers complete! 🎉"}
            </div>
            <div style={{padding:"14px 18px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:3,fontSize:".7rem",color:"var(--muted)",lineHeight:1.7,marginBottom:24}}>
              <strong style={{color:"var(--text-mid)"}}>*Wellness Disclaimer:</strong> These product suggestions are for general wellness information only and do not constitute medical advice. USANA products are not intended to diagnose, treat, cure, or prevent any disease.
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <OutBtn onClick={()=>startTracker(tracker.id)}>Retake This Tracker</OutBtn>
              <SolidBtn onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>Book Free Consultation →</SolidBtn>
              {remaining.length>0&&<OutBtn onClick={()=>startTracker(remaining[0].id)} color="var(--sky)">Next: {remaining[0].icon} {remaining[0].name} →</OutBtn>}
              <OutBtn onClick={()=>{setQuizPage("hub");scrollToTrackers();}}>← All Trackers</OutBtn>
            </div>
          </div>
        )}
      </section>

      {/* PRODUCTS */}
      <div id="products" style={{maxWidth:1400,margin:"0 auto",padding:"0 48px"}}>
        <div style={{padding:"52px 0 0",display:"flex",alignItems:"flex-end",justifyContent:"space-between",borderBottom:"2px solid var(--royal)"}}>
          <div>
            <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".2em",textTransform:"uppercase",color:"var(--sky)",marginBottom:6}}>Official USANA Product Line</div>
            <h2 style={{fontFamily:"var(--font-lora,serif)",fontSize:"1.7rem",fontWeight:600,color:"var(--navy)"}}>USANA® Nutritional Products</h2>
          </div>
          <div style={{fontSize:".76rem",fontWeight:700,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",paddingBottom:4}}>Showing {filteredProds.length} products</div>
        </div>
        <div style={{padding:"22px 0 0",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          {(["all","cellsentials","optimizers","nutrimeal","celavive","active"] as const).map(cat=>(
            <button key={cat} type="button" onClick={()=>setFilter(cat)}
              style={{fontSize:".74rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"8px 18px",borderRadius:2,border:"1px solid var(--border)",background:filter===cat?"var(--royal)":"var(--surface)",color:filter===cat?"#fff":"var(--muted)",cursor:"pointer",transition:"all .2s"}}>
              {cat==="all"?"All Products":categoryLabels[cat as ProductCategory]}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,padding:"24px 0 64px"}}>
          {filteredProds.map((p,i)=>(
            <div key={p.id} className="product-card fade-up" style={{animationDelay:`${i*.05}s`}}>
              <div className="product-thumb" style={{background:`linear-gradient(145deg,${p.color} 0%,${p.color} 55%,${p.accent}25 100%)`}}
                dangerouslySetInnerHTML={{__html:productShapeIcons[p.category]}}/>
              {p.badge&&<span className={`product-badge badge-${p.badge}`}>{{award:"Award Winner",best:"Best Seller",new:"New"}[p.badge]??p.badge}</span>}
              <button className="wishlist-btn" onClick={e=>{e.stopPropagation();showToast("Saved to your wishlist");}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--royal)" strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
              <div style={{padding:"16px 16px 18px",borderTop:"1px solid var(--border)"}}>
                <div style={{fontSize:".65rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:"var(--sky)",marginBottom:5}}>{categoryLabels[p.category]}</div>
                <div style={{fontFamily:"var(--font-lora,serif)",fontSize:"1rem",fontWeight:500,color:"var(--navy)",lineHeight:1.3,marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:".75rem",color:"var(--muted)",lineHeight:1.5,marginBottom:12}}>{p.desc}</div>
                {p.award&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,fontSize:".65rem",fontWeight:700,color:"var(--gold)"}}>⭐ {p.award}</div>}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <span style={{fontSize:"1rem",fontWeight:700,color:"var(--navy)"}}>${p.price.toFixed(2)}</span>
                    <span style={{display:"block",fontSize:".68rem",color:"var(--sky)"}}>PC: ${p.pcPrice.toFixed(2)}</span>
                  </div>
                  <button type="button" onClick={()=>addToCart(p.name)}
                    style={{display:"flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:2,background:"var(--royal)",border:"none",cursor:"pointer",color:"#fff"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--navy)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="var(--royal)"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              </div>
              <div className="quick-add" onClick={()=>addToCart(p.name)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add to Order
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <section id="contact" style={{background:"linear-gradient(135deg,var(--navy) 0%,#004080 100%)",padding:"64px 48px"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"start"}}>
          <div>
            <h2 style={{fontFamily:"var(--font-lora,serif)",fontSize:"2rem",fontWeight:600,color:"#fff",marginBottom:10}}>Let&apos;s Find the Right Products for You</h2>
            <p style={{fontSize:".9rem",color:"rgba(255,255,255,.65)",lineHeight:1.8,marginBottom:24}}>Our Lifefort wellness consultants will help you build the perfect USANA stack — completely free, no pressure.</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{i:"📞",t:"+63 (insert number here)"},{i:"✉️",t:"hello@lifefort.com"},{i:"📍",t:"Philippines (Nationwide Delivery)"}].map(({i,t})=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:10,fontSize:".82rem",color:"var(--light-blue)"}}><span>{i}</span> {t}</div>
              ))}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:4,padding:"28px 24px"}}>
            <div style={{fontFamily:"var(--font-lora,serif)",fontSize:"1.1rem",fontWeight:600,color:"var(--navy)",marginBottom:20}}>Book a Free Wellness Consultation</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              {[{v:cF,s:setCF,p:"Juan"},{v:cL,s:setCL,p:"dela Cruz"}].map(({v,s,p})=>(
                <input key={p} type="text" value={v} onChange={e=>s(e.target.value)} placeholder={p}
                  style={{width:"100%",padding:"10px 12px",fontFamily:"inherit",fontSize:".88rem",color:"var(--text)",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:2,outline:"none"}}
                  onFocus={e=>{e.target.style.borderColor="var(--sky)"}} onBlur={e=>{e.target.style.borderColor="var(--border)"}}/>
              ))}
            </div>
            {[{v:cE,s:setCE,t:"email",p:"juan@email.com"},{v:cP,s:setCP,t:"tel",p:"+63 9XX XXX XXXX"}].map(({v,s,t,p})=>(
              <input key={p} type={t} value={v} onChange={e=>s(e.target.value)} placeholder={p}
                style={{width:"100%",padding:"10px 12px",fontFamily:"inherit",fontSize:".88rem",color:"var(--text)",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:2,outline:"none",marginBottom:14}}
                onFocus={e=>{e.target.style.borderColor="var(--sky)"}} onBlur={e=>{e.target.style.borderColor="var(--border)"}}/>
            ))}
            <select value={cG} onChange={e=>setCG(e.target.value)}
              style={{width:"100%",padding:"10px 12px",fontFamily:"inherit",fontSize:".88rem",color:"var(--text)",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:2,outline:"none",marginBottom:14}}>
              <option value="">Select your main goal…</option>
              {["Increase energy & reduce fatigue","Strengthen immune system","Weight management","Improve joint & bone health","Better skin & anti-aging","Heart & cardiovascular health","General wellness maintenance"].map(g=><option key={g}>{g}</option>)}
            </select>
            <textarea value={cM} onChange={e=>setCM(e.target.value)} rows={3} placeholder="Tell us more about your health concerns…"
              style={{width:"100%",padding:"10px 12px",fontFamily:"inherit",fontSize:".88rem",color:"var(--text)",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:2,outline:"none",resize:"none",marginBottom:6}}
              onFocus={e=>{e.target.style.borderColor="var(--sky)"}} onBlur={e=>{e.target.style.borderColor="var(--border)"}}/>
            <button type="button" onClick={submitContact}
              style={{width:"100%",fontSize:".78rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",background:"var(--royal)",color:"#fff",border:"none",padding:13,borderRadius:2,cursor:"pointer",marginTop:6}}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--navy)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="var(--royal)"}}>
              Send My Consultation Request →
            </button>
            <p style={{fontSize:".68rem",color:"var(--muted)",marginTop:10,lineHeight:1.5}}>✅ We typically respond within 24 hours. Your information is kept private and will never be shared.</p>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div style={{background:"var(--surface-2)",borderTop:"1px solid var(--border)",padding:"28px 48px"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"var(--navy)",marginBottom:10}}>⚠️ Important Legal Disclaimer</div>
          <p style={{fontSize:".72rem",color:"var(--muted)",lineHeight:1.7,maxWidth:900}}>
            <strong style={{color:"var(--text-mid)"}}>Independent Associate Disclosure:</strong> Lifefort is an Independent Associate/Brand Partner of USANA Health Sciences, Inc. This website is not an official USANA corporate website. Products, statements, and testimonials expressed here have not been evaluated by the Food and Drug Administration and are not intended to diagnose, treat, cure, or prevent any disease.<br/><br/>
            <strong style={{color:"var(--text-mid)"}}>Product Information:</strong> Always consult your physician or qualified healthcare provider before starting any supplement program, particularly if you are pregnant, nursing, taking medications, or have a medical condition.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:"var(--navy)",color:"rgba(255,255,255,.7)",padding:48}}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr",gap:40}}>
          <div>
            <div style={{fontFamily:"var(--font-lora,serif)",fontSize:"1.4rem",fontWeight:600,color:"#fff",marginBottom:2}}>Lifefort</div>
            <div style={{fontSize:".6rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:"var(--light-blue)",marginBottom:12}}>Independent USANA Brand Partner</div>
            <div style={{fontFamily:"var(--font-lora,serif)",fontSize:".88rem",fontStyle:"italic",color:"var(--light-blue)",marginBottom:10}}>&ldquo;Your Health. Your Life. Your Way.&rdquo;</div>
            <p style={{fontSize:".72rem",lineHeight:1.6}}>Helping Filipinos achieve lasting health through science-based USANA nutrition.</p>
          </div>
          {[
            {title:"Products",links:["CellSentials®","HealthPak™","Optimizers","Nutrimeal™","Celavive® Skincare","Rev3 Energy®"]},
            {title:"Wellness",links:["Fatigue Tracker","Energy Tracker","Immune Tracker","Free Consultation","Wellness Blog"]},
            {title:"Support", links:["Contact Us","Shipping Info","Returns Policy","Privacy Policy","Official USANA Site ↗"]},
          ].map(col=>(
            <div key={col.title}>
              <h4 style={{fontSize:".7rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:14}}>{col.title}</h4>
              <ul style={{listStyle:"none",margin:0,padding:0}}>
                {col.links.map(link=>(
                  <li key={link} style={{marginBottom:8}}>
                    <a href="#" style={{fontSize:".8rem",color:"rgba(255,255,255,.6)",textDecoration:"none"}}
                      onMouseEnter={e=>{e.currentTarget.style.color="var(--light-blue)"}}
                      onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.6)"}}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{maxWidth:1400,margin:"28px auto 0",paddingTop:20,borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:32,fontSize:".7rem",color:"rgba(255,255,255,.32)"}}>
          <span>© 2026 Lifefort — Independent USANA Brand Partner. All rights reserved.</span>
          <span style={{maxWidth:680,lineHeight:1.6}}>*These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. USANA® is a registered trademark of USANA Health Sciences, Inc.</span>
        </div>
      </footer>

      {/* EMAIL POPUP */}
      <div className={`popup-overlay ${popupOpen?"show":""}`} onClick={e=>{if(e.target===e.currentTarget)setPopupOpen(false);}}>
        <div className="popup-box">
          <div style={{background:"linear-gradient(135deg,var(--navy) 0%,var(--royal) 100%)",padding:"28px 28px 20px",position:"relative"}}>
            <button onClick={()=>setPopupOpen(false)} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(255,255,255,.6)",fontSize:"1.3rem",cursor:"pointer",lineHeight:1}}>✕</button>
            <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"var(--light-blue)",marginBottom:8}}>🌿 Free Wellness Newsletter</div>
            <h3 style={{fontFamily:"var(--font-lora,serif)",fontSize:"1.5rem",fontWeight:600,color:"#fff",lineHeight:1.2}}>
              Get Your Free<br/><em style={{fontStyle:"italic",color:"var(--light-blue)"}}>Wellness Starter Guide</em>
            </h3>
          </div>
          <div style={{padding:"24px 28px"}}>
            <p style={{fontSize:".88rem",color:"var(--muted)",lineHeight:1.7,marginBottom:18}}>Join 2,000+ Filipinos on their USANA wellness journey. Subscribe and get your free guide plus exclusive tips from Lifefort.</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {["Free Lifefort Wellness Starter Guide (PDF)","Weekly science-based health tips","Exclusive subscriber-only discounts","First access to new USANA products"].map(perk=>(
                <div key={perk} style={{display:"flex",alignItems:"center",gap:8,fontSize:".82rem",color:"var(--text-mid)"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"var(--sky)",flexShrink:0}}/> {perk}
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input type="email" value={popupEmail} onChange={e=>setPopupEmail(e.target.value)} placeholder="Enter your email address…"
                style={{flex:1,padding:"11px 14px",fontSize:".88rem",border:"1.5px solid var(--border)",borderRadius:2,outline:"none"}}
                onFocus={e=>{e.target.style.borderColor="var(--sky)"}} onBlur={e=>{e.target.style.borderColor="var(--border)"}}/>
              <button type="button" onClick={()=>{
                if(!isEmail(popupEmail)){showToast("Please enter a valid email");return;}
                setPopupOpen(false);setPopupEmail("");
                showToast("🌿 Welcome to Lifefort! Check your email for your free guide.");
              }}
                style={{fontSize:".76rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",background:"var(--royal)",color:"#fff",border:"none",padding:"11px 20px",borderRadius:2,cursor:"pointer",whiteSpace:"nowrap"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--navy)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="var(--royal)"}}>
                Get My Guide
              </button>
            </div>
            <p style={{fontSize:".65rem",color:"var(--muted)",marginTop:10,textAlign:"center"}}>🔒 We respect your privacy. Unsubscribe anytime. No spam — ever.</p>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast&&(
        <div className="toast-slide show" style={{position:"fixed",bottom:28,right:28,background:"var(--navy)",border:"1px solid var(--sky)",padding:"12px 20px",borderRadius:3,fontSize:".82rem",color:"#fff",display:"flex",alignItems:"center",gap:10,zIndex:200,boxShadow:"0 6px 24px rgba(6,36,96,.3)"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"var(--light-blue)"}}/>{toast}
        </div>
      )}
    </div>
  );
}
