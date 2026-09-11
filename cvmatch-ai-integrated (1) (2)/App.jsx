
import React, { createContext, useContext, useMemo, useEffect, useState ,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  Link, Routes, Route, useLocation ,matchRoutes } from "react-router-dom";
import {TermsPage ,PrivacyPage ,RefundPage , CookiePage ,ContactSupportPage ,SecurityPage ,AidisclaimerPage ,AcceptableUsePage ,DmcaPage} from "./components/Legal";
import {ConsentPage} from "./components/Consent";
import CVAnalysisLoader from "./components/Analyse";
import {COLORS ,Icon ,PremiumButton} from "./components/Ui";

import {PaymentSuccess , PaymentCancel ,CheckoutPage , ProductPage} from "./components/Payment";
import {approutes , routesDontNeedDefaultHeader , API_URL ,NotFoundPage }from "./components/Routes";
import {
  AuthProvider,
  useAuth,
  trackMeta,
} from "./context/AuthContext";


const navigation = [
  {
    id: "terms",
    label: "Terms of Service",
    url: "/terms",
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    url: "/privacy",

  },
  {
    id: "refund",
    url: "/refund",
    label: "Refund Policy",
  },
  {
    id: "cookies",
    url: "/cookie",
    label: "Cookie Policy",
  },
 
  {
    id: "security",
    url: "/security",
    label: "Security",
  },
   {
    id: "aidisclaimer",
    url: "/ai-disclaimer",
    label: "Ai Disclaimer",
  },
  {
    id: "acceptable-use",
    url: "/acceptable-use",
    label: "Acceptable Use",
  },
  {
    id: "dmca",
    url: "/dmca-copyright",
    label: "DMCA / Copyright",
  },
   {
    id: "contact",
    url: "/contact",
    label: "Contact & Support",
  },
];



const fakeScoreBreakdown = [
  { label: "Keyword match", value: 55, note: "Missing role-specific ATS keywords" },
  { label: "Experience fit", value: 70, note: "Relevant but not strongly positioned" },
  { label: "ATS readability", value: 60, note: "Needs cleaner structure" },
  { label: "Resume clarity", value: 64, note: "Summary and bullets can be stronger" },
];




export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function getScoreColor(score) {
  if (score < 60) return COLORS.danger;
  if (score < 75) return COLORS.warning;
  return COLORS.success;
}

const trackGoogleLoginStartedFromPaywall = () => {
  if (typeof window === "undefined") return;
  const startedKey = "cvmatch_google_login_started";
  let alreadyStarted = false;
  try { alreadyStarted = !!window.sessionStorage.getItem(startedKey); } catch (e) { /* storage unavailable */ }
  if (!alreadyStarted) {
    trackMeta("google_login_started", { location: "post_analysis_paywall", funnel_step: "google_login_started" }, true);
    try { window.sessionStorage.setItem(startedKey, "1"); } catch (e) { /* storage unavailable */ }
  }
};

const trackGoogleLoginCompletedFromPaywall = () => {
  if (typeof window === "undefined") return;
  const startedKey = "cvmatch_google_login_started";
  const completedKey = "cvmatch_google_login_completed";
  let started = false;
  let completed = false;
  try {
    started = !!window.sessionStorage.getItem(startedKey);
    completed = !!window.sessionStorage.getItem(completedKey);
  } catch (e) {
    /* storage unavailable */
  }
  if (started && !completed) {
    trackMeta("google_login_completed", { location: "post_analysis_paywall", funnel_step: "google_login_completed", status: "authenticated" }, true);
    try { window.sessionStorage.setItem(completedKey, "1"); } catch (e) { /* storage unavailable */ }
  }
};

const trackResumeUnlocked = (analysisId) => {
  if (typeof window === "undefined") return;
  const unlockKey = analysisId ? `cvmatch_resume_unlocked_${analysisId}` : "cvmatch_resume_unlocked_session";
  let alreadyUnlocked = false;
  try { alreadyUnlocked = !!window.sessionStorage.getItem(unlockKey); } catch (e) { /* storage unavailable */ }
  if (!alreadyUnlocked) {
    trackMeta("resume_unlocked", { location: "post_analysis_result", funnel_step: "resume_unlocked", credit_used: true, analysis_id: analysisId }, true);
    try { window.sessionStorage.setItem(unlockKey, "1"); } catch (e) { /* storage unavailable */ }
  }
};


function Button({ children, onClick, className = "", variant = "solid", disabled = false }) {
  const base = "inline-flex items-center justify-center rounded-2xl font-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  if (variant === "outline") {
    return <button onClick={onClick} disabled={disabled} className={`${base} border border-slate-200 bg-white text-slate-950 hover:bg-slate-50 ${className}`}>{children}</button>;
  }
  if (variant === "ghost") {
    return <button onClick={onClick} disabled={disabled} className={`${base} text-slate-500 hover:bg-slate-50 ${className}`}>{children}</button>;
  }
  return <button onClick={onClick} disabled={disabled} className={`${base} bg-slate-950 text-white hover:bg-slate-800 ${className}`}>{children}</button>;
}

function Card({ children, className = "", style }) {
  return <div className={className} style={style}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}



function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg,#07111F,#0B2447)" }}>
        <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.55), transparent 35%)" }} />
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full p-2" fill="none">
          <path d="M35 13C24 13 15 21.8 15 32.5S24 52 35 52c5.3 0 10.2-2 13.7-5.4" stroke="url(#cvGradient)" strokeWidth="7" strokeLinecap="round" />
          <path d="M28 17l12 30 12-30" stroke="url(#cvGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="21" y="26" width="13" height="3" rx="1.5" fill="white" opacity="0.9" />
          <rect x="21" y="33" width="10" height="3" rx="1.5" fill="white" opacity="0.7" />
          <rect x="49" y="43" width="4" height="4" rx="1" fill="#22D3EE" />
          <rect x="55" y="37" width="3" height="3" rx="0.8" fill="#22D3EE" opacity="0.8" />
          <defs><linearGradient id="cvGradient" x1="14" y1="16" x2="54" y2="50"><stop stopColor="#3B82F6" /><stop offset="1" stopColor="#22D3EE" /></linearGradient></defs>
        </svg>
      </div>
      <div>
        <div className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-slate-950"}`}>CVMATCH <span style={{ color: COLORS.teal }}>AI</span></div>
        <div className={`text-[11px] font-bold tracking-[0.24em] uppercase ${dark ? "text-white/45" : "text-slate-500"}`}>Match your CV. Get hired</div>
      </div>
    </div>
  );
}

function FooterLogo({ dark = false }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg,#07111F,#0B2447)" }}>
          <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.55), transparent 35%)" }} />
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full p-2" fill="none">
            <path d="M35 13C24 13 15 21.8 15 32.5S24 52 35 52c5.3 0 10.2-2 13.7-5.4" stroke="url(#cvGradient)" strokeWidth="7" strokeLinecap="round" />
            <path d="M28 17l12 30 12-30" stroke="url(#cvGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="21" y="26" width="13" height="3" rx="1.5" fill="white" opacity="0.9" />
            <rect x="21" y="33" width="10" height="3" rx="1.5" fill="white" opacity="0.7" />
            <rect x="49" y="43" width="4" height="4" rx="1" fill="#22D3EE" />
            <rect x="55" y="37" width="3" height="3" rx="0.8" fill="#22D3EE" opacity="0.8" />
            <defs><linearGradient id="cvGradient" x1="14" y1="16" x2="54" y2="50"><stop stopColor="#3B82F6" /><stop offset="1" stopColor="#22D3EE" /></linearGradient></defs>
          </svg>
        </div>
        <div>
          <div className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-slate-950"}`}>CVMATCH <span style={{ color: COLORS.teal }}>AI</span></div>
          <div className={`text-[11px] font-bold tracking-[0.24em] uppercase ${dark ? "text-white/45" : "text-slate-500"}`}>Match your CV. Get hired</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-500 text-center md:text-left">
        <div> © 2026 CVMatch AI  . All rights reserved. </div>
        {/* <div>All rights reserved.</div> */}
      </div>
    </div>
    
  );
}



function go(mode, setMode) {
  window.scrollTo(0, 0); 
  const path = mode === "dashboard" ? "/dashboard" : mode === "app" ? "/app" : "/";
  setMode(mode);
}


function Progress({ value, color }) {
  return <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: color || getScoreColor(value) }} /></div>;
}

function ScoreBar({ label, value, note }) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-4"><div><p className="font-black text-sm">{label}</p>{note && <p className="mt-1 text-xs text-slate-500">{note}</p>}</div><span className="text-lg font-black" style={{ color: getScoreColor(value) }}>{value}%</span></div><div className="mt-3"><Progress value={value}/></div></div>;
}

function AppStoreButton({ type = "apple", onClick }) {
  return <button onClick={onClick} className="group rounded-2xl bg-slate-950 px-5 py-3 text-white flex items-center gap-3 hover:-translate-y-0.5 hover:bg-slate-800 transition-all shadow-lg"><Icon name={type === "apple" ? "phone" : "globe"} size={22}/><span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-widest text-white/45">{type === "apple" ? "Download on the" : "Get it on"}</span><span className="block font-black text-sm">{type === "apple" ? "App Store" : "Google Play"}</span></span></button>;

}

function MobileComingSoonModal({ open, onClose }) {


  const { user} = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isEmailValid = email && isValidEmail(email);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);


  if (!open) return null; 

  const joinWaitlist = async () => {

    setError("");
    if (!email) { setError("Email required"); return;}
    if (!isValidEmail(email)) { setError("Invalid email format"); return;}

    setLoading(true);
    try {
      const url = `${API_URL}/v1/mobile-waitlist`;
      const response = await fetch( url,{
        method: "POST",
        body: JSON.stringify({ email }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();
      onClose();
    } catch (error) {
      console.error("waitlist error:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
 
  
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"><motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-600"><Icon name="phone" size={30} /></div><h3 className="mt-4 text-3xl font-black">Mobile app coming soon</h3><p className="mt-2 text-slate-600">The mobile app is currently under development. Use the web version for now.</p><div className="mt-5 rounded-3xl bg-slate-50 p-4 text-left"><label className="text-sm font-black">Get notified at launch</label><input placeholder="Email address"
    value={email}
    onChange={(e) => setEmail(e.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100" /></div><Button  onClick={joinWaitlist} disabled={loading || !isEmailValid} className="mt-5 w-full rounded-2xl bg-slate-950 py-6">Close</Button></motion.div></div>;

}

function ReviewPromptModal({ open, onClose }) {
  const [rating, setRating] = useState(0);
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center px-4"><motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] bg-white shadow-2xl p-7 text-center"><div className="h-16 w-16 mx-auto rounded-3xl text-white flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.teal})` }}><Icon name="star" size={28}/></div><h3 className="text-3xl font-black mt-4">How was your resume result?</h3><p className="text-slate-600 mt-2">Leave a quick rating after downloading. This helps us improve CVMatch AI.</p><div className="flex justify-center gap-2 mt-6">{[1,2,3,4,5].map((star) => <button key={star} onClick={() => setRating(star)} className="h-12 w-12 rounded-2xl flex items-center justify-center border transition-all" style={{ background: rating >= star ? COLORS.gold : "#FFFFFF", color: rating >= star ? COLORS.primary : COLORS.textMuted, borderColor: rating >= star ? COLORS.gold : "#E5E5E5" }}><Icon name="star" size={20}/></button>)}</div><textarea placeholder="Optional feedback..." className="w-full h-24 mt-5 rounded-3xl border border-slate-200 p-4 text-sm outline-none focus:ring-4 focus:ring-cyan-100 resize-none"/><PremiumButton onClick={onClose} className="w-full mt-5">Submit review</PremiumButton><Button onClick={onClose} variant="ghost" className="w-full rounded-2xl mt-2">Maybe later</Button></motion.div></div>;
}

function Header({ onStart, onHome, credits, lockedResultActive = false}) {
   const {
    setMode,
    setUser,
    user,
    handleLogout,
    connectWithGoogle,
  } = useAuth();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu
  

 
 
  const headerCtaLabel = lockedResultActive
    ? ((credits?.remaining ?? 0) > 0 ? "Use Credit" : "Unlock Resume")
    : "Get free score";

  const handleGoogle = () => {
    if (lockedResultActive && typeof trackGoogleLoginStartedFromPaywall === "function") {
      trackGoogleLoginStartedFromPaywall();
    }
    connectWithGoogle();
  };

  return <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><button onClick={onHome}><Logo /></button>
    <nav className="hidden items-center gap-8 text-sm font-bold text-slate-500 lg:flex">
      <a  href="/#proof"   className="hover:text-slate-950">Proof</a>
      <a  href="/#how"   className="hover:text-slate-950">How it works</a>
      <a  href="/#pricing"  className="hover:text-slate-950">Pricing</a>
      <a  href="/#mobile" className="hover:text-slate-950">Mobile</a>
    </nav>
  
    {/* Right side: desktop controls (unchanged) */}
    <div className="hidden items-center gap-3 md:flex">
      {user && !user?.is_guest ?
        (<div className="relative">
            <button onClick={() => setOpen(!open)} className="rounded-2xl border border-slate-200 bg-cyan-50 px-5 py-4 font-black" > {credits?.remaining ?? 0} Credits ▼ </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg z-50">
                <button onClick={() => { go("dashboard", setMode); setOpen(false); }} className="block w-full px-4 py-3 text-left hover:bg-gray-100" > Dashboard </button>
                <button onClick={() => handleLogout()} className="block w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100" > Logout </button>
              </div>
            )}
          </div>
        ) : (
        <button onClick={handleGoogle}
          className="rounded-2xl bg-slate-950 font-black text-white px-7 py-4 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
        > Continue with Google </button>
       )}
      <PremiumButton onClick={onStart} className="px-5 py-3">{headerCtaLabel}</PremiumButton>
    </div>
  
    {/* Mobile: always-visible CTA + hamburger toggle */}
    <div className="flex items-center gap-2 md:hidden">
      <PremiumButton onClick={onStart} className="px-4 py-3">{headerCtaLabel}</PremiumButton>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-slate-700"
      >
        {mobileOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
        )}
      </button>
    </div>
    </div>
  
    {/* Mobile menu panel */}
    {mobileOpen && (
      <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <nav className="flex flex-col gap-1 text-sm font-bold text-slate-600">
            <a href="/#proof" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 hover:bg-slate-50">Proof</a>
            <a href="/#how" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 hover:bg-slate-50">How it works</a>
            <a href="/#pricing" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 hover:bg-slate-50">Pricing</a>
            <a href="/#mobile" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 hover:bg-slate-50">Mobile</a>
          </nav>
  
          <div className="mt-3 border-t border-slate-100 pt-3">
            {user && !user?.is_guest ? (
              <div className="flex flex-col gap-2">
                <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-center font-black text-slate-700">{credits?.remaining ?? 0} Credits</div>
                <button onClick={() => { go("dashboard", setMode); setMobileOpen(false); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-left font-bold hover:bg-slate-50">Dashboard</button>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-left font-bold text-red-600 hover:bg-slate-50">Logout</button>
              </div>
            ) : (
              <button onClick={() => { handleGoogle(); setMobileOpen(false); }}
                className="w-full rounded-2xl bg-slate-950 px-7 py-4 font-black text-white transition-all duration-200 active:translate-y-0"
              >Continue with Google</button>
            )}
          </div>
        </div>
      </div>
    )}
    </header>;
}


function HeaderX() {
  
  
  return <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><button onClick={()=>{window.location.replace("/");}}><Logo /></button>
 
  
  
  <div className="hidden md:block">
    <button className="rounded-2xl bg-slate-950 font-black text-white px-7 py-4 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
    onClick={()=>{window.location.replace("/");}} >Get back</button>
  </div>
  </div></header>;
}

function ScoreCard({scoreBreakdown}) {
  return <Card className="relative overflow-hidden rounded-[2.5rem] border-white/10 bg-white shadow-2xl"><CardContent className="p-0"><div className="p-7 text-white" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.navy})` }}><div className="flex items-center justify-between"><span className="font-black">ATS Match Analysis</span><Icon name="sparkles" className="text-cyan-300" /></div><div className="mt-7 grid grid-cols-2 gap-4"><div className="rounded-3xl border border-white/10 bg-white/10 p-5"><div className="text-sm text-white/45">Current score</div><div className="mt-2 text-5xl font-black" style={{ color: COLORS.warning }}>48%</div></div><div className="rounded-3xl border border-white/10 bg-white/10 p-5"><div className="text-sm text-white/45">After CVMatch</div><div className="mt-2 text-5xl font-black" style={{ color: COLORS.success }}>86%</div></div></div></div><div className="space-y-4 p-7">{scoreBreakdown.slice(0, 3).map((item) => <ScoreBar key={item.label} {...item}/>)}</div></CardContent></Card>;
}

function FakeScoreCard() {
  return <Card className="relative overflow-hidden rounded-[2.5rem] border-white/10 bg-white shadow-2xl"><CardContent className="p-0"><div className="p-7 text-white" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.navy})` }}><div className="flex items-center justify-between"><span className="font-black">ATS Match Analysis</span><Icon name="sparkles" className="text-cyan-300" /></div><div className="mt-7 grid grid-cols-2 gap-4"><div className="rounded-3xl border border-white/10 bg-white/10 p-5"><div className="text-sm text-white/45">Current score</div><div className="mt-2 text-5xl font-black" style={{ color: COLORS.warning }}>48%</div></div><div className="rounded-3xl border border-white/10 bg-white/10 p-5"><div className="text-sm text-white/45">After CVMatch</div><div className="mt-2 text-5xl font-black" style={{ color: COLORS.success }}>86%</div></div></div></div><div className="space-y-4 p-7">{fakeScoreBreakdown.slice(0, 3).map((item) => <ScoreBar key={item.label} {...item}/>)}</div></CardContent></Card>;
}

function LandingPage({ onStart, setMode  }) {
  useEffect(() => {
    // alert('LandingPage')
  }, [setMode]);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const goMobile = () =>{ trackMeta("wantMobileApp", { method: "google", location: "site_header_or_landing" }, true); setMobileModalOpen(true);}

  return <><Hero onStart={onStart}  setMode={setMode} /><ProofSection onStart={onStart}/><PainSection/><HowItWorks onStart={onStart}/><ValueSection/><PricingSection onStart={onStart}  setMode={setMode} /><MobileSection goMobile={goMobile} /><FinalCTA onStart={onStart}/>
          <MobileComingSoonModal open={mobileModalOpen} onClose={() => setMobileModalOpen(false)}/>
          </>;
}



function Hero({ onStart, setMode , scoreBreakdown }) {
  return <section className="relative overflow-hidden" style={{ background: `radial-gradient(circle at 20% 10%, rgba(34,211,238,0.16), transparent 30%), radial-gradient(circle at 85% 15%, rgba(59,130,246,0.16), transparent 28%), linear-gradient(180deg,#FFFFFF,${COLORS.cream})` }}><div className="absolute -right-24 top-20 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(34,211,238,0.16)" }} /><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[1.06fr_0.94fr]"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm"><Icon name="sparkles" size={16} className="text-cyan-500" /> Built for US ATS systems</div><h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-slate-950 md:text-5xl xl:text-6xl">Build an ATS-Ready U.S. Resume Tailored to the Exact Job You Want</h1><p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-600">CVMatch AI analyzes your resume like an ATS, identifies missing job-specific keywords, and helps you generate a premium U.S. hybrid resume adapted to your profession, seniority, and target role.</p>
  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
    
    <PremiumButton onClick={onStart}>Scan My Resume Free <Icon name="arrow" size={18} className="ml-2" /></PremiumButton>
    <a onClick={()=>{trackMeta("seeBeforeAndAfter", { method: "google", location: "site_header_or_landing" }, true);}} href="/#proof"><Button variant="outline" className="rounded-2xl border-slate-200 bg-white px-7 py-6 font-black">See before / after</Button></a>
  </div>
  
  <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">{["No credit card required", "Private upload", "Built for U.S. job applications", "Results in under 60 seconds"].map((item) => <div key={item} className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-2 shadow-sm"><Icon name="check" size={14} className="text-cyan-500" />{item}</div>)}</div></motion.div><motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative"><div className="absolute -inset-8 rounded-[4rem] blur-2xl" style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.18),rgba(34,211,238,0.14),transparent)" }} />
    <FakeScoreCard />
  </motion.div></div>

  
  </section>;
}



function ProofSection({ onStart }) { return <section id="proof" className="mx-auto max-w-7xl px-4 py-20"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-500">Proof first</p><h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">See exactly why your resume gets rejected</h2><p className="mt-4 text-lg leading-relaxed text-slate-600">Most resumes fail because they don’t match job requirements or ATS filters. CVMatch AI shows the problem before asking you to pay.</p></div><div className="mt-12 grid gap-6 lg:grid-cols-2"><Card className="rounded-[2rem] border-slate-100 bg-white shadow-xl"><CardContent className="p-7"><div className="flex items-center justify-between"><h3 className="text-2xl font-black">Before</h3><span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">Rejected</span></div><div className="mt-5 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-500">Generic summary. Missing job keywords. Weak bullet points. Low ATS readability. Same resume sent everywhere.</div><div className="mt-5"><div className="mb-2 flex justify-between text-sm font-black"><span>ATS match</span><span style={{ color: COLORS.warning }}>48%</span></div><Progress value={48} color={COLORS.warning} /></div></CardContent></Card><Card className="rounded-[2rem] border-cyan-100 bg-white shadow-xl"><CardContent className="p-7"><div className="flex items-center justify-between"><h3 className="text-2xl font-black">After CVMatch AI</h3><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">Interview-ready</span></div><div className="mt-5 rounded-3xl p-5 text-sm leading-7 text-slate-700" style={{ background: COLORS.softBlue }}>US-standard resume structure. ATS keywords included. Stronger bullet points. Matching cover letter. Premium PDF ready to send.</div><div className="mt-5"><div className="mb-2 flex justify-between text-sm font-black"><span>ATS match</span><span style={{ color: COLORS.success }}>86%</span></div><Progress value={86} color={COLORS.success} /></div></CardContent></Card></div>
<div className="mt-10 text-center">
  <PremiumButton onClick={onStart}>Check my resume for free</PremiumButton>
  
</div>
</section>; }

function PainSection() { const problems = ["You send the same resume everywhere", "Your CV is missing the right keywords", "ATS filters reject you before a human sees you", "You don’t know what to fix"]; return <section className="bg-slate-950 py-20 text-white"><div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center"><div><p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">The real problem</p><h2 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">It’s not always the market. Sometimes it’s your resume</h2><p className="mt-5 text-lg leading-relaxed text-white/55">If your resume does not match the role, the ATS may filter it out before a recruiter even sees it</p></div><div className="grid gap-3">{problems.map((problem) => <div key={problem} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5"><Icon name="alert" className="mt-1 text-cyan-300" /><span className="font-bold text-white/85">{problem}</span></div>)}</div></div></section>; }

function HowItWorks({ onStart }) { const steps = [["upload", "Upload your resume", "PDF, DOCX or text. No account required before your free score"], ["briefcase", "Paste the job description", "The analysis becomes more accurate when you paste the exact US job post"], ["sparkles", "Unlock your job-ready resume", "Get the rewritten resume, cover letter, keywords and premium PDF"]]; return <section id="how" className="mx-auto max-w-7xl px-4 py-20"><div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-500">How it works</p><h2 className="mt-3 text-4xl font-black md:text-6xl">Fix your resume in 3 simple steps</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map(([icon, title, text], index) => <Card key={title} className="rounded-[2rem] border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"><CardContent className="p-7"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.teal})` }}><Icon name={icon} /></div><div className="mb-3 text-sm font-black text-cyan-500">STEP {index + 1}</div><h3 className="text-2xl font-black">{title}</h3><p className="mt-2 leading-relaxed text-slate-600">{text}</p></CardContent></Card>)}</div>
<div className="mt-10">
  <PremiumButton onClick={onStart}>Get started for free</PremiumButton>
</div></section>; }

function ValueSection() { return <section className="mx-auto max-w-7xl px-4 py-20"><div className="rounded-[3rem] p-8 md:p-12" style={{ background: `linear-gradient(135deg, ${COLORS.softBlue}, #FFFFFF)` }}><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-600">What you get</p><h2 className="mt-3 text-4xl font-black md:text-5xl">Everything needed for one stronger US job application</h2></div><div className="grid gap-3 sm:grid-cols-2">{["ATS match score", "Missing keywords", "US-standard resume rewrite", "Cover letter", "Premium PDF download", "Before / after comparison"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-bold shadow-sm"><Icon name="check" className="text-cyan-500" />{item}</div>)}</div></div></div></section>; }



function PricingSection({ onStart }) {

  const {
    setMode,
    user,
    connectWithGoogle,
    handleLogout,
  } = useAuth();

  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);


  const handlePlanClick = async (plan) => { 
    trackMeta(`subscription_${plan.price}`, { method: "google", location: "site_CVMatchApp" }, true);
    localStorage.setItem( "selected_plan", plan  );
    try {

      const token = localStorage.getItem("token");
      const response = await fetch( `${API_URL}/v1/auth/me`,  {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      // Non connecté
      if (!response.ok) {
        connectWithGoogle(token);
        return;
      }


      if (plan.provider === "paddle") {
        // Backend Laravel crée l'URL checkout Paddle
        const checkoutResponse = await fetch( `${API_URL}/v1/payments/paddle/checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({
              price_id: plan.price_id,
              plan_name: plan.name,
            }),
          }
        );
        const checkoutData = await checkoutResponse.json();

        if (checkoutData?.checkout_url) {
          // Redirection vers page hébergée Paddle
          window.location.href = checkoutData.checkout_url;
          return;
        }

        throw new Error("Impossible de créer le checkout Paddle");
        return;
      }

     
      if (plan.provider == "gumroad" && plan.url) {
        const url = `${API_URL}/payments/gumroad?link=${encodeURIComponent(plan.url)}`;
        window.location.href = url;
        return;
      }
     
    } catch (error) { 
      console.error(error);
    }
   
  };

  const handleView_ = async (plan) => { 
  
    try {

      const token = localStorage.getItem("token");
      const response = await fetch( `${API_URL}/v1/auth/me`,  {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      // Non connecté
      if (!response.ok) {
        connectWithGoogle(token);
        return;
      }

      const url = `/product/${plan.id}`;
      window.location.replace(url) ;
      return;
     
    } catch (error) { 
      console.error(error);
    }
   
  };
 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/credit-plans`, {
                            credentials: "include"
                          });
        const data = await res.json();
        setPricingPlans(data.data.map(plan => plan.custom_ui));
      } catch (error) {
        console.error("Error loading pricing plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

 
  
  return <section id="pricing" className="mx-auto max-w-7xl px-4 py-20"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-500">Simple pricing</p><h2 className="mt-3 text-4xl font-black md:text-6xl">Start with one job application</h2><p className="mt-4 text-lg text-slate-600">Each optimized resume consumes 1 credit. No subscription. No hidden fees. Unlock the optimized resume and cover letter for one targeted US job application.</p></div>
  <div className="grid lg:grid-cols-3 gap-5 mt-10">
    {loading ? ( <div className="text-center py-20">Loading pricing...</div> ):(
    pricingPlans.map((plan, index) => 
    <Card key={plan.id} className={`rounded-[2.5rem] border-slate-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${index === 1 ? "ring-2 ring-cyan-300" : ""}`}>
      <CardContent className="p-7">
        <div className="flex items-center justify-between gap-3"><h3 className="text-2xl font-black">{plan.name}</h3>{plan.badge &&<span className={`text-xs font-black rounded-full px-3 py-2 ${index === 1 ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-700"}`}>{plan.badge}</span>}</div>
        <div className="mt-5"><span className="text-5xl font-black">{plan.price}</span><p className="mt-1 text-slate-500">{plan.subtitle}</p></div>
        <div className="grid gap-3 mt-7">{plan.features.map((item) => <div key={item} className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 text-sm font-bold"><Icon name="check" size={16} className="text-cyan-500"/>{item}</div>)}{plan.description && <div  className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 text-sm font-bold">{plan.description}</div>}</div>
        {/* <Link to={`/product/${plan.id}`}> 
              <button className="mt-4 w-full bg-black text-white py-2 rounded-xl">
                View
              </button>
            </Link> */}
        <PremiumButton onClick={() => handleView_(plan)} className="w-full mt-7" variant={index === 1 ? "primary" : "gold"}>{plan.cta}</PremiumButton>
        {/* <PremiumButton onClick={() => handlePlanClick(plan)} className="w-full mt-7" variant={index === 1 ? "primary" : "gold"}>{plan.cta}</PremiumButton> */}
      </CardContent>
    </Card>))
  }
  </div></section>; }

function MobileSection({goMobile}) { return <section id="mobile" className="mx-auto max-w-7xl px-4 py-20"><div className="grid gap-10 overflow-hidden rounded-[3rem] bg-slate-950 p-8 text-white md:p-12 lg:grid-cols-2 lg:items-center"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-black text-cyan-200"><Icon name="phone" size={16} /> Mobile app coming soon</div><h2 className="text-4xl font-black md:text-6xl">Continue on mobile anytime</h2><p className="mt-5 text-lg leading-relaxed text-white/55">Save resumes, track applications and optimize faster from your phone. For now, use the web version</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><AppStoreButton type="apple" onClick={goMobile}/><AppStoreButton type="google" onClick={goMobile}/></div></div><div className="mx-auto w-full max-w-sm rounded-[3rem] border border-white/10 bg-white/5 p-4"><div className="overflow-hidden rounded-[2.4rem] bg-white text-slate-950"><div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.navy})` }}><Logo dark /></div><div className="space-y-3 p-5"><div className="rounded-3xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Latest score</p><div className="mt-2 text-5xl font-black text-emerald-500">86%</div><Progress value={86} color={COLORS.success} /></div>{["Resume ready", "Cover letter generated", "Apply checklist"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 font-bold"><Icon name="check" className="text-cyan-500" size={16} />{item}</div>)}</div></div></div></div></section>; }

function FinalCTA({ onStart }) { return <section className="mx-auto max-w-7xl px-4 pb-20">
  <div className="rounded-[3rem] p-10 text-center md:p-14" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.navy})` }}>
    <div className="flex justify-center"><Logo dark /></div>
    <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">Stop applying with the wrong resume</h2><p className="mt-4 text-lg text-white/55">Start with a free resume match score</p>
    <PremiumButton onClick={onStart} className="mt-8">Get my free resume score</PremiumButton>
    
  </div></section>; }

function ResumeUpload({ next, resumeName, setResumeName , resumeFile, setResumeFile
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type: PDF and DOCX only (reject legacy .doc, txt, etc.).
    const name = (file.name || "").toLowerCase();
    const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
    const isDocx =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".docx");
    const isLegacyDoc =
      file.type === "application/msword" || (name.endsWith(".doc") && !name.endsWith(".docx"));

    if (isLegacyDoc || (!isPdf && !isDocx)) {
      setUploadError("Only PDF and DOCX files are supported.");
      event.target.value = "";
      return;
    }

    // Validate size: 10 MB max.
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Resume file must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    setUploadError("");
    setIsUploading(true);
    setResumeFile(file);
    setResumeName(file.name);
    localStorage.setItem("cvmatch_resume_name", file.name);
    setTimeout(() => setIsUploading(false), 800);
    // next();
  };

  const removeFile = () => {
    setResumeFile(null);
    setResumeName("");
    localStorage.removeItem("cvmatch_resume_name");
  };

  const useSample = () => {
    const fakeName = "sample-resume.pdf";
    setResumeName(fakeName);
    localStorage.setItem("cvmatch_resume_name", fakeName);
  };

  const storedName = localStorage.getItem("cvmatch_resume_name");
  
  
  return (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-center"> Upload your resume</h2>
    <p className="text-slate-600 text-center mt-3"> PDF, DOCX or text. No account required before your free score.</p>
    <Card className="rounded-[2.5rem] border-dashed border-2 border-slate-200 mt-8 shadow-sm bg-white">
      <CardContent className="p-10 text-center">
        <div className="h-20 w-20 rounded-3xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto"><Icon name="upload" size={34}/></div>
        <h3 className="font-black text-xl mt-5"> Drop your resume here</h3>
        <p className="text-sm text-slate-500 mt-2"> or click to choose a file</p>

      {!resumeFile && (
        <input className="mt-6 block mx-auto text-sm" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange}  />
      )}

      {uploadError && (
        <p className="text-red-600 mt-4 text-sm">{uploadError}</p>
      )}
      

      {!resumeFile && storedName && (
        <p className="text-orange-500 mt-4 text-sm">
          Previous file: {storedName} need to be re-upload
        </p>
      )}

      {resumeFile && storedName && (
        <p className="text-orange-500 mt-4 text-sm">
          File: {storedName} succesfull uploaded
        </p>
      )}

  
      {resumeFile &&  (
        <> 
          <Button variant="outline" className="rounded-2xl mt-4 px-4 py-3"  onClick={useSample}  > Use sample resume </Button>
          <div className="mt-6 inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 rounded-2xl px-4 py-3 text-sm font-bold"><Icon name="file" size={16}/>{resumeName}</div>
          <div className="mt-6 flex flex-col items-center gap-4">
            <Button variant="outline" className="rounded-2xl px-4 py-3 text-red-500" onClick={removeFile} > Remove file </Button>
          </div>
        </>
      )}

      </CardContent>
    </Card>
    <PremiumButton onClick={next} disabled={!resumeName} className="w-full mt-6" > Continue </PremiumButton>
  </div>
); }

function JobDescription({ next, jobText, setJobText ,resumeUploading}) { 

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    setIsSubmitting(true);
    try { await next(); } catch (error) {console.error(error); setIsSubmitting(false);}
  };
  const isDisabled = jobText.length < 80 || resumeUploading || isSubmitting;

  return <div className="max-w-3xl mx-auto py-12 px-4">
    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-center">Paste the job description</h2><p className="text-slate-600 text-center mt-3">The score becomes more accurate when you paste the exact US job post.</p>
    <textarea value={jobText} onChange={(event) => setJobText(event.target.value)} className="w-full h-72 mt-8 rounded-3xl border border-slate-200 bg-white p-5 outline-none focus:ring-4 focus:ring-cyan-100 resize-none" placeholder="Paste job description here..."/>
   
    <div className="flex justify-between mt-2 text-sm text-slate-500"><span>Minimum recommended: 80 characters</span><span> {jobText.length} chars</span></div>
    {resumeUploading && (
        <div className="mt-4 flex rounded-2xl bg-cyan-50 border border-cyan-100 p-4 text-cyan-700 text-sm">
          <span>Preparing resume in the background</span>
          <span className="ml-1 flex"  style={{ fontSize: "x-large" }}>
            <span className="animate-bounce [animation-delay:0ms]">.</span>
            <span className="animate-bounce [animation-delay:200ms]">.</span>
            <span className="animate-bounce [animation-delay:400ms]">.</span>
          </span>
        </div>
      )}
    <PremiumButton onClick={handleNext} disabled={isDisabled} className="w-full mt-6">{isSubmitting ? "Analyzing..." : "Analyze my resume"}</PremiumButton>
  </div>; }

function Analysis({ next }) { const [progress, setProgress] = useState(0); React.useEffect(() => { const timers = [22, 48, 76, 100].map((value, index) => window.setTimeout(() => setProgress(value), (index + 1) * 700)); const done = window.setTimeout(next, 3400); return () => { timers.forEach(window.clearTimeout); window.clearTimeout(done); }; }, [next]); return <div className="max-w-2xl mx-auto py-20 text-center min-h-[68vh] flex flex-col justify-center px-4"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-24 w-24 rounded-[2rem] bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto shadow-xl"><Icon name="sparkles" size={40}/></motion.div><h2 className="text-4xl md:text-5xl font-black mt-8">Analyzing your ATS match...</h2><p className="text-slate-600 mt-3">Checking keywords, experience relevance, ATS readability, and clarity.</p><div className="mt-8"><Progress value={progress} color={COLORS.teal}/></div><div className="grid grid-cols-4 gap-3 mt-6 text-xs text-slate-500"><span>Keywords</span><span>Experience</span><span>ATS</span><span>Rewrite</span></div></div>; }

const unlockItems = [
  "Full rewritten U.S.-style resume",
  "Tailored cover letter",
  "Premium PDF download",
  "Before / after comparison",
  "Improvements made",
  "Supported keywords strengthened",
  "Remaining weaknesses",
  "Recruiter-style impression",
  "Saved report history",
];

function WhatYouUnlockBlock({ dark = false }) {
  return <Card className={`rounded-[2rem] shadow-sm ${dark ? "border-white/10 bg-white/5 text-white" : "border-slate-100 bg-white"}`}>
    <CardContent className="p-7">
      <h3 className="text-2xl font-black">What you unlock</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {unlockItems.map((item) => (
          <div key={item} className={`flex items-center gap-2 rounded-2xl p-3 text-sm font-bold ${dark ? "bg-white/10 text-white/85" : "bg-slate-50 text-slate-700"}`}>
            <Icon name="check" size={16} className="text-cyan-400"/>
            {item}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>;
}

function getStrongestImprovements(breakdown, optimizedBreakdown) {
  return [
    ["Resume structure", breakdown.resume_structure, optimizedBreakdown.resume_structure],
    ["ATS readability", breakdown.ats_readability, optimizedBreakdown.ats_readability],
    ["Skills alignment", breakdown.skills_alignment, optimizedBreakdown.skills_alignment],
    ["Keyword match", breakdown.keyword_match, optimizedBreakdown.keyword_match],
    ["Experience relevance", breakdown.experience_relevance, optimizedBreakdown.experience_relevance],
    ["Achievement quality", breakdown.achievement_quality, optimizedBreakdown.achievement_quality],
  ]
    .map(([label, before, after]) => ({
      label,
      before: Number(before) || 0,
      after: Number(after) || 0,
      gain: (Number(after) || 0) - (Number(before) || 0),
    }))
    .filter((item) => item.after > 0 && item.gain > 0)
    .sort((a, b) => b.gain - a.gain)
    .slice(0, 4);
}

function StrongestImprovementsBlock({ improvements }) {
  if (!improvements.length) return null;
  return <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
    <CardContent className="p-7">
      <h3 className="text-2xl font-black">Strongest improvements</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {improvements.map((item) => (
          <div key={item.label} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            <p className="text-slate-950">{item.label}</p>
            <p className="mt-1">{item.before}% to {item.after}%</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>;
}

function FreeResult({ next,restart, goMobile }) { 
  const {
    setMode,
    connectWithGoogle,
    credits,
  } = useAuth();
  const [analyseResult, setAnalyseResult] = useState({
    // critical_issues: [],
    // missing_keywords: [],
  });
  const token = localStorage.getItem("token");
  const guestToken = localStorage.getItem("guest_token");
  const analysisId = localStorage.getItem("analysisId");

  useEffect(() => {
    trackMeta("report_viewed", { location: "free_report", status: "viewed" }, true);
    trackMeta("paywall_viewed", { location: "paywall", status: "viewed" }, true);
    const googlePromptKey = "cvmatch_google_signin_prompt_viewed";
    if (!token && typeof window !== "undefined" && !window.sessionStorage.getItem(googlePromptKey)) {
      trackMeta("google_signin_prompt_viewed", { location: "free_report", status: "viewed" }, true);
      window.sessionStorage.setItem(googlePromptKey, "1");
    }
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const headers = { Accept: "application/json", };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        } else if (guestToken) {
          headers["X-Guest-Token"] = guestToken;
        }
       
        const res = await fetch(`${API_URL}/v1/analyses/${analysisId}`, {
          credentials: "include",
          headers,
        });

        if ( res.status === 401 ) {
          if (token){localStorage.setItem("redirect", "app" ); connectWithGoogle(token)};
          return;
        }
        
        const data = await res.json();
        setAnalyseResult(data.data);
      } catch (error) {
        console.error("Error loading pricing plans:", error);
      } 
    };

    fetchPlans();
  }, [token,guestToken]);

  const originalResume = analyseResult?.posted_resume ;
  const optimizedResume = analyseResult?.optimized_resume_text ;
  
  const originalScore =analyseResult?.score || 0;
  const breakdown = analyseResult?.score_breakdown || {};

  const optimized = analyseResult?.optimized_resume_analysis;
  const optimizedBreakdown = optimized?.scoring_breakdown || {};
  const optimizedScore = optimized?.overall_ats_score || 0;
  const scoreImprovement = optimized?.score_improvement ?? Math.max(optimizedScore - originalScore, 0);
  const hasScoreImprovement = Number.isFinite(Number(scoreImprovement)) && Number(scoreImprovement) > 0;
  const strongestImprovements = getStrongestImprovements(breakdown, optimizedBreakdown);
  const hasCredits = (credits?.remaining ?? 0) > 0;

  const scoreBreakdown = [
    {
      label: "Keyword match",
      value: breakdown.keyword_match || 0,
      note: "Keyword alignment with the job description"
    },
    {
      label: "Skills alignment",
      value: breakdown.skills_alignment || 0,
      note: "Relevant hard and soft skills match"
    },
    {
      label: "Experience relevance",
      value: breakdown.experience_relevance || 0,
      note: "Experience fit for this role"
    },
    {
      label: "Resume structure",
      value: breakdown.resume_structure || 0,
      note: "US resume formatting and clarity"
    },
    {
      label: "ATS readability",
      value: breakdown.ats_readability || 0,
      note: "ATS parsing and readability"
    },
    {
      label: "Achievement quality",
      value: breakdown.achievement_quality || 0,
      note: "Strength of measurable impact"
    }
  ];

  return <div className="max-w-7xl mx-auto py-10 px-4">
  <div className="text-center mb-8">
    <p className="text-sm font-black uppercase tracking-widest text-cyan-500">Free analysis</p>
    <h2 className="text-4xl md:text-5xl font-black mt-2">Your resume needs targeted improvements for this role.</h2>
    <p className="text-slate-600 mt-3">Your free scan found weak ATS readability, U.S. resume structure issues, and missing role-specific signals.</p>
    <p className="mx-auto mt-3 max-w-3xl text-slate-600">Unlock the optimized resume package to get a rewritten U.S.-style resume, tailored cover letter, premium PDF, before/after comparison, and recruiter-style feedback.</p>
    {optimizedScore < 60 ? (
      hasScoreImprovement && (
      <p className="mt-3 text-sm font-black text-emerald-600">Estimated improvement: +{scoreImprovement || 0} match points</p>
      )
    ) : (
      <p className="mt-3 text-sm font-black text-emerald-600">Estimated match score after optimization: {optimizedScore}% (+{scoreImprovement || 0} points)</p>
    )}
  </div>
  <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
    <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white"><CardContent className="p-7">
      <div className="flex items-center justify-between"><p className="text-sm font-black text-slate-500">Current Match Score</p><span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black"> { analyseResult?.match_level}</span></div>
      <div className="flex items-end gap-3 mt-3"><span className="text-7xl font-black" style={{ color: COLORS.warning }}>{originalScore}%</span><span className="text-slate-500 mb-3">before optimization</span></div>
      <div className="mt-6"><Progress value={originalScore} color={COLORS.warning}/></div>
      <div className="grid gap-3 mt-6">{scoreBreakdown.map((item) => <ScoreBar key={item.label} {...item}/>)}</div>
    </CardContent></Card>
    <div className="space-y-6">
      <StrongestImprovementsBlock improvements={strongestImprovements} />
      <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
        <CardContent className="p-7">
          <h3 className="text-2xl font-black">Critical issues found</h3>
          {/* <div className="mt-5 space-y-3">{analyseResult.critical_issues.map((problem, index) => <div key={index} className="flex gap-3 p-3 rounded-2xl bg-red-50 text-red-950"><Icon name="alert" size={18} className="mt-0.5"/><span className="text-sm font-bold">{problem}</span></div>)}</div> */}
          <div className="mt-5 space-y-3">{analyseResult?.detected_problems?.map((problem, index) => <div key={index} className="flex gap-3 p-3 rounded-2xl bg-red-50 text-red-950"><Icon name="alert" size={18} className="mt-0.5"/><span className="text-sm font-bold">{problem}</span></div>)}</div>
          {analyseResult?.recruiter_risk_flags?.length > 0 && ( <>
            <h4 className="font-black mt-6">Recruiter risk flags</h4>
            <div className="mt-3 space-y-2"> {analyseResult.recruiter_risk_flags.map((risk, index) => (<div key={index} className="rounded-2xl bg-orange-50 text-orange-900 px-4 py-3 text-sm font-bold"> {risk} </div> ))} </div>
            </> )}
          {analyseResult?.missing_keywords?.length > 0 && (<>
          <h4 className="font-black mt-6">Missing keywords</h4>
          <p className="mt-1 text-sm leading-6 text-slate-500">These are important role keywords found in the job description but weak or missing in your resume.</p>
          <div className="flex flex-wrap gap-2 mt-3">{analyseResult.missing_keywords.map((keyword) => <span key={keyword} className="px-3 py-2 rounded-full text-xs font-black bg-cyan-50 text-cyan-700">{keyword}</span>)}</div>
          </> )}
          {analyseResult?.missing_hard_skills?.length > 0 && (  <>
          <h4 className="font-black mt-6">Missing hard skills</h4>
          <div className="flex flex-wrap gap-2 mt-3"> {analyseResult.missing_hard_skills.map((skill) => ( <span key={skill} className="px-3 py-2 rounded-full text-xs font-black bg-slate-100 text-slate-700" > {skill} </span> ))} </div>
          </>  )}
        
        </CardContent>
      </Card>
      <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
        <CardContent className="p-7">
          <h3 className="text-2xl font-black">Expected improvement after optimization</h3>
          <p className="text-slate-600 mt-2">The paid package focuses on a stronger resume structure, role-specific presentation, and supported keyword coverage.</p>
          {hasScoreImprovement && (<p className="text-slate-600 mt-2">Estimated improvement:{" "} <span className="font-black text-emerald-600">+{scoreImprovement || 0} match points</span></p>)}

              <div className="grid gap-3 mt-6">
                {[
                  ["Keyword match", optimizedBreakdown.keyword_match],
                  ["Skills alignment", optimizedBreakdown.skills_alignment],
                  ["Experience relevance", optimizedBreakdown.experience_relevance],
                  ["Resume structure", optimizedBreakdown.resume_structure],
                  ["ATS readability", optimizedBreakdown.ats_readability],
                  ["Achievement quality", optimizedBreakdown.achievement_quality]
                ].map(([label, value]) => (
                  <ScoreBar key={label} label={label} value={value || 0}  note="Projected score after optimization"  />
                ))}
              </div>

              {optimized?.keywords_added?.length > 0 && ( <>
              <h4 className="font-black mt-6">Supported keywords strengthened</h4>
              <p className="mt-1 text-sm leading-6 text-slate-500">These keywords are based on your existing resume content and were strengthened where supported.</p>
              <div className="flex flex-wrap gap-2 mt-3"> {optimized.keywords_added.map((keyword) => ( <span key={keyword} className="px-3 py-2 rounded-full text-xs font-black bg-emerald-50 text-emerald-700" > {keyword} </span> ))} </div>
              </>)}
        </CardContent>
      </Card>
      <WhatYouUnlockBlock />
      <BeforeAfter locked optimizedResume={optimizedResume}  originalResume ={originalResume} />
      <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-slate-950 text-white">
        <CardContent className="p-7">
          <div className="flex items-center gap-2 font-black text-xl"><Icon name="lock"/> Unlock your complete optimization package</div>
          <p className="text-white/55 mt-2 text-sm leading-relaxed">Get everything generated from this resume scan and job description.</p>
          {token ?  (
              analyseResult?.locked && ( <PremiumButton onClick={() => { trackMeta("unlock_cta_clicked", { location: "free_report", status: hasCredits ? "has_credit" : "needs_credit" }, true); next(); }} className="w-full mt-5">{hasCredits ? "Use 1 Credit to Unlock Resume" : "Buy 1 Credit & Unlock Resume"}</PremiumButton>)
          ) : (
            <>
              <div className="mt-5 rounded-3xl bg-white/10 p-5">
                <p className="font-black">Continue with Google to save your optimized resume, access your downloads, and keep your report history.</p>
                <p className="mt-2 text-sm text-white/55">No password needed. Secure checkout after sign-in.</p>
              </div>
              <PremiumButton  onClick={() => { trackMeta("unlock_cta_clicked", { location: "free_report", status: "google_signin_required" }, true); trackGoogleLoginStartedFromPaywall(); localStorage.setItem("redirect", "app" ); connectWithGoogle();}} className="w-full mt-5">Continue with Google</PremiumButton> 
            </>
          )}
          <p className="mt-3 text-center text-sm text-white/45">One-time payment. No subscription.</p>
          <p className="mt-2 text-center text-xs leading-5 text-white/40">CVMatch AI provides resume analysis and optimization suggestions. It does not guarantee job or interview outcomes.</p>
                     <Button variant="outline" className="rounded-2xl mt-3 bg-transparent border-white/20 text-black hover:bg-white/10 w-full py-4" onClick={goMobile}>Continue on mobile app</Button>
          {/* <Button onClick={restart} variant="outline" className="rounded-2xl mt-3 bg-transparent border-white/20 text-black hover:bg-white/10 w-full py-4">Optimize another resume</Button> */}

        </CardContent>
      </Card>
    </div>
  </div>
</div>; }

function BeforeAfter({ locked = false , optimizedResume, originalResume }) { 
  const previewText = optimizedResume ?.split(" ") ?.slice(0, 40) ?.join(" ");
  return <Card className="rounded-[2rem] shadow-sm border-slate-100 overflow-hidden bg-white"><CardContent className="p-7"><div className="flex items-center justify-between"><h3 className="text-2xl font-black">{locked ? "Before → After" :  "Before"} </h3>{locked && <span className="text-xs font-black bg-cyan-50 text-cyan-700 rounded-full px-3 py-2 flex items-center gap-1"><Icon name="lock" size={13}/> Locked preview</span>}</div><div className={`grid ${locked ? "md:grid-cols-2" : "md:grid-cols-1"}  gap-4 mt-5`} ><div className="rounded-3xl bg-slate-50 p-5 h-72 overflow-hidden"><p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Original</p><pre className="whitespace-pre-wrap text-xs leading-4 text-slate-600 font-sans">{originalResume}</pre></div>
        {locked && <div className="relative rounded-3xl bg-slate-950 text-white p-5 h-72 overflow-hidden"> 
          <p className="text-xs font-black uppercase tracking-widest text-cyan-300 mb-3">Optimized resume package</p>
          <pre className={`whitespace-pre-wrap text-xs leading-6 font-sans ${locked ? "blur-sm select-none" : ""}`}>{locked ? `${previewText}...` : optimizedResume}</pre>
          {locked && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/55 to-slate-950 flex items-end justify-center pb-5"><span className="rounded-2xl px-4 py-3 text-sm font-black bg-white text-slate-950">Unlock to view your full optimized resume, cover letter, PDF preview, and recruiter-style feedback.</span></div>}
        </div>}
      </div>
    </CardContent>
  </Card>; }

function FinalResult({ restart, goMobile, onReview }) { 
  const { connectWithGoogle} = useAuth();

  const [analyseResult, setAnalyseResult] = useState([]);
  const token = localStorage.getItem("token");
  const analysisId = localStorage.getItem("analysisId");


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const headers = { Accept: "application/json", };
        if (token) {  headers.Authorization = `Bearer ${token}`;}
        const res = await fetch(`${API_URL}/v1/analyses/${analysisId}`, {
                            credentials: "include", 
                            headers
                          });
        if ( res.status === 401 ) {
          localStorage.setItem("redirect", "app" );
          connectWithGoogle(token);
          return;
        }
        const data = await res.json();
        setAnalyseResult(data.data);
      } catch (error) {
        console.error("Error :", error);
      }
    };

    fetchPlans();
  }, []);
  

  const originalResume = analyseResult?.posted_resume ;
  
  const optimized = analyseResult?.optimized_resume_analysis;

  const originalScore = analyseResult?.score || 0;
  const optimizedScore = optimized?.overall_ats_score || 0;

  const optimizedBreakdown = optimized?.scoring_breakdown || {};

  const optimizedResume = analyseResult?.optimized_resume_text || "" ;
  const coverLetter = analyseResult?.cover_letter || "" ;

  const finalScoreBreakdown = [
    {
      label: "Keyword match",
      value: optimizedBreakdown.keyword_match || 0
    },
    {
      label: "Skills alignment",
      value: optimizedBreakdown.skills_alignment || 0
    },
    {
      label: "Experience relevance",
      value: optimizedBreakdown.experience_relevance || 0
    },
    {
      label: "Resume structure",
      value: optimizedBreakdown.resume_structure || 0
    },
    {
      label: "ATS readability",
      value: optimizedBreakdown.ats_readability || 0
    },
    {
      label: "Achievement quality",
      value: optimizedBreakdown.achievement_quality || 0
    }
  ];

  const copyResume = async () => { try { 
    trackMeta("copyResumeText", { method: "google", location: "site_CVMatchApp" }, true);
    await navigator.clipboard.writeText(optimizedResume); } catch (error) { console.warn("Clipboard unavailable in this preview environment", error); }
  };
  const downloadResumeText = () => { 
    trackMeta("downloadResumeText", { method: "google", location: "site_CVMatchApp" }, true);
    
    const blob = new Blob([optimizedResume], { type: "text/plain;charset=utf-8" }); 
    const url = URL.createObjectURL(blob); 
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "cvmatch-ai-optimized-resume.txt"; anchor.click(); 
    URL.revokeObjectURL(url); setTimeout(onReview, 600); 
  }; 

  const downloadResume = async () =>  { 
    trackMeta("downloadResumePDF", { method: "google", location: "site_CVMatchApp" }, true);

    const headers = { Accept: "application/json", };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}/v1/analyses/${analyseResult?.id}/download/resume`, {
      method: "GET",
      credentials: "include", 
      headers
    });

    if ( response.status === 401 ) {
      localStorage.setItem("redirect", "app" );
      connectWithGoogle(token);
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const blob = await response.blob();

    // const blob = new Blob([optimizedResume], { type: "text/plain;charset=utf-8" }); 
    const url = URL.createObjectURL(blob); 
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "cvmatch-ai-optimized-resume.pdf"; anchor.click();  anchor.remove();

    URL.revokeObjectURL(url); setTimeout(onReview, 600); 
  }; 

  return <div className="max-w-7xl mx-auto py-10 px-4"><div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"><div><p className="text-sm font-black uppercase tracking-widest text-cyan-500">Unlocked result</p><h2 className="text-4xl md:text-5xl font-black mt-2">Your optimized resume package is ready.</h2><p className="mt-2 text-slate-600">We improved your resume structure, ATS readability, and role-specific presentation without inventing unsupported experience.</p><p className="mt-2 text-sm font-black text-emerald-600">New match score: {optimizedScore}%</p><p className="mt-1 text-sm text-slate-500">Your report is saved to your account.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" className="rounded-2xl border-slate-200 px-4 py-3" onClick={copyResume}><Icon name="copy" size={16} className="mr-2"/>Copy</Button><PremiumButton onClick={downloadResumeText} className="px-4 py-3"><Icon name="download" size={16} className="mr-2"/>Download TXT</PremiumButton><PremiumButton onClick={downloadResume} variant="gold" className="px-4 py-3"><Icon name="file" size={16} className="mr-2"/>Download PDF</PremiumButton></div></div>
      <div className="grid lg:grid-cols-[1fr_0.55fr] gap-6">
        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white"><CardContent className="p-7"><h3 className="font-black text-2xl mb-5">Premium Resume PDF Preview</h3><div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-inner"><pre className="whitespace-pre-wrap text-sm leading-5 font-sans text-slate-700">{optimizedResume}</pre></div></CardContent></Card>
          <BeforeAfter locked={false} optimizedResume={optimizedResume}  originalResume ={originalResume}/>
          
          <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white"><CardContent className="p-7"><h3 className="font-black text-xl">Cover Letter</h3><pre className="text-sm text-slate-600 leading-5 mt-4 whitespace-pre-wrap font-sans">{coverLetter}</pre></CardContent></Card>
          
        </div>
        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-7">
              <h3 className="font-black text-2xl">New Score</h3>
              <div className="text-7xl font-black mt-4" style={{ color: COLORS.success }}>{optimizedScore}%</div>
              <Progress value={optimizedScore} color={COLORS.success}/>
              <div className="grid gap-3 mt-6">{finalScoreBreakdown.map((item) => <ScoreBar key={item.label} label={item.label} value={item.value}/>)}</div>
            </CardContent>
          </Card>
          {optimized?.improvements_made?.length > 0 && (
            <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
              <CardContent className="p-7">
                <h3 className="font-black text-xl">Improvements made</h3>

                <div className="mt-4 space-y-3">
                  {optimized.improvements_made.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-emerald-50 text-emerald-800 px-4 py-3 text-sm font-bold"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}
          {optimized?.keywords_added?.length > 0 && (
            <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
              <CardContent className="p-7">
                <h3 className="font-black text-xl">Supported keywords strengthened</h3><p className="mt-1 text-sm leading-6 text-slate-500">These keywords are based on your existing resume content and were strengthened where supported.</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {optimized.keywords_added.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-2 rounded-full text-xs font-black bg-cyan-50 text-cyan-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {optimized?.remaining_weaknesses?.length > 0 && (
          <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-7">
              <h3 className="font-black text-xl">Remaining weaknesses</h3><p className="mt-1 text-sm leading-6 text-slate-500">Honest role-fit notes to help you understand what the optimized resume can and cannot fix.</p>

              <div className="mt-4 space-y-3">
                {optimized.remaining_weaknesses.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-orange-50 text-orange-900 px-4 py-3 text-sm font-bold"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {optimized?.recruiter_impression && (
          <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-7">
              <h3 className="font-black text-xl">Recruiter impression</h3>

              <p className="text-sm text-slate-600 leading-7 mt-4">
                {optimized.recruiter_impression}
              </p>
            </CardContent>
          </Card>
        )}
         
         
          <Card className="rounded-[2rem] shadow-sm border-slate-100 bg-slate-950 text-white"><CardContent className="p-7"><div className="flex items-center gap-2 font-black text-xl"><Icon name="phone"/>Save this on mobile</div><p className="text-white/55 mt-2 text-sm leading-relaxed">Download the mobile app to keep resumes, track jobs, and optimize again faster.</p><div className="flex flex-col gap-3 mt-5"><AppStoreButton type="apple" onClick={goMobile}/><AppStoreButton type="google" onClick={goMobile}/></div></CardContent></Card><Button onClick={restart} variant="outline" className="w-full rounded-2xl py-6 border-slate-200">Optimize another resume</Button><PremiumButton onClick={goMobile} className="w-full">Download mobile app</PremiumButton>
        </div>
      </div>
    </div>;
}

function CVMatchApp({ setActiveAppStep }) {
  const pollIntervalRef = useRef(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {refreshUser ,connectWithGoogle ,setMode , user} = useAuth();
  const [current, setCurrent] = useState(() => { return Number(localStorage.getItem("cvmatch_current")) || 0;});
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState(() => { return localStorage.getItem("cvmatch_resume_name") || "";});
  const [jobText, setJobText] = useState(() => { return localStorage.getItem("cvmatch_job_text") || "";});
  const [resumeId, setResumeId] = useState( localStorage.getItem("cvmatch_resume_id") || null);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    const savedStep = Number(localStorage.getItem("cvmatch_current"));
    if ( savedStep === 2 && user?.current_analyse_done != null ) {
      const analysisId = user.current_analyse_done;
      localStorage.setItem("analysisId", analysisId);
      pollAnalysisStatus(analysisId);
    }
  }, [user]);
 
  
  useEffect(() => { localStorage.removeItem("redirect");}, []);
  useEffect(() => { localStorage.setItem("cvmatch_current", current);}, [current]);
  useEffect(() => { setActiveAppStep?.(current);}, [current, setActiveAppStep]);
  useEffect(() => { localStorage.setItem("cvmatch_job_text", jobText);}, [jobText]);
  useEffect(() => { localStorage.setItem("cvmatch_resume_name", resumeName);}, [resumeName]);

  const token = localStorage.getItem("token");
  const next = React.useCallback(() => setCurrent((screen) => Math.min(screen + 1, 5)), []);
  const previous = () => {setCurrent((screen) => Math.max(screen - 1, 0));};
  const restart = () => { 
    trackMeta("anotherGetFreeScore", { method: "google", location: "site_CVMatchApp" }, true);
    
    localStorage.removeItem("cvmatch_current");
    localStorage.removeItem("cvmatch_resume_id");
    localStorage.removeItem("cvmatch_resume_name");
    localStorage.removeItem("analysisId");

    setCurrent(0);
    setResumeName("");
    setResumeFile(null);
    
  };
  const goMobile = () => setMobileModalOpen(true);
  const progress = useMemo(() => ((current + 1) / 6) * 100, [current]);

  const storeResume = async () => {
    trackMeta("uploadResume", { method: "google", location: "site_CVMatchApp" }, true);
    next(); 
    try {
      setResumeUploading(true);
      const formData = new FormData();
      formData.append("name", resumeName);
      if (resumeFile) { formData.append("media[]", resumeFile); }

      const guestToken = localStorage.getItem("guest_token");
      const token = localStorage.getItem("token");

      const url = token || guestToken
      ? `${API_URL}/v1/resumes/upload`
      : `${API_URL}/v1/resumes/visitor-upload`;

      const headers = { Accept: "application/json", };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } else if (guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }
      const usingGuestToken = !token ;

      const response = await fetch( url,{
        method: "POST",
        body: formData,
        credentials: "include",
        headers
      });

      if ( response.status === 401 ) {
        localStorage.setItem("redirect", "app" );
        if (token)  connectWithGoogle(token);
        previous();
        return;
      }

      const data = await response.json();
      if (usingGuestToken) {
        const newGuestToken = response.headers.get("X-Guest-Token");
        if (newGuestToken) {
          localStorage.setItem("guest_token", newGuestToken);
        }
      }
      await refreshUser();
      const uploadedResumeId = data.data.id;
      if (uploadedResumeId) {
        trackMeta("resume_upload_completed", { location: "resume_upload", status: "completed" }, true);
        setResumeId(uploadedResumeId);
        localStorage.setItem( "cvmatch_resume_id", uploadedResumeId);
      }
    } catch (error) {
      console.error("upload error:", error);
      previous();
    } finally {
      setResumeUploading(false);
    }
  };

  const analyzeResume = async () => {
    trackMeta("uploadAnalyse", { method: "google", location: "site_CVMatchApp" }, true);
    try {

      const currentResumeId = resumeId || localStorage.getItem("cvmatch_resume_id");
      const guestToken = localStorage.getItem("guest_token");
      const token = localStorage.getItem("token");

      const headers = { Accept: "application/json", };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } else if (guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }
       
      const formData = new FormData();
      formData.append("job_description", jobText);
      if (currentResumeId) { formData.append("resume_id", currentResumeId); }

      const response = await fetch(`${API_URL}/v1/analyses`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers
      });

      if ( response.status === 401 ) {
        localStorage.setItem("redirect", "app" );
        if (token)  connectWithGoogle(token);
        return;
      }
      const data = await response.json();
      const analysisId = data.data.id;
      localStorage.setItem('analysisId',analysisId)
      await refreshUser();
      next();
      // start polling
      pollAnalysisStatus(analysisId);

    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  const unlockAnalysis = async () => {
    trackMeta("unlockFullResume", { method: "google", location: "site_CVMatchApp" }, true);

    try {

      const analysisId = localStorage.getItem("analysisId");
      const token = localStorage.getItem("token");
      const headers = { Accept: "application/json", };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } 
       
      const response = await fetch(`${API_URL}/v1/analyses/${analysisId}/unlock`, {
        method: "POST",
        credentials: "include",
        headers
      });
      if ( response.status === 401 ) {
        localStorage.setItem("redirect", "app" );
        connectWithGoogle(token);
        return;
      }
      const data = await response.json();

      if (response.ok) {
        trackMeta("unlock_succeeded", { location: "report_unlock", status: "succeeded" }, true);
        trackResumeUnlocked(analysisId);
        await refreshUser();
        next() ;
      }else{
        // trackMeta("unlock_failed", { location: "report_unlock", status: "failed" }, true);
        setErrorMessage(
          data?.message ||
          "You don't have enough credits."
        );
        // setShowErrorModal(true);
        localStorage.setItem("redirect","app") ;
        window.location.replace('/#pricing')

        return;
      }

    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  const pollAnalysisStatus = async (analysisId) => {
    // STOP OLD POLLING BEFORE STARTING NEW ONE
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current =  setInterval(async () => {
      try {
        const guestToken = localStorage.getItem("guest_token");
        const token = localStorage.getItem("token");
        
        const headers = { Accept: "application/json", };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        } else if (guestToken) {
          headers["X-Guest-Token"] = guestToken;
        }
       
        const response = await fetch(
          `${API_URL}/v1/analyses/${analysisId}`,
          {
            credentials: "include",
            headers
          }
        );

        if ( response.status === 401 ) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          previous();
          if (token){ localStorage.setItem("redirect", "app" ); connectWithGoogle(token);}
          return;
        }

        const data = await response.json();
        console.log("POLL STATUS:", data.data.status);

        // FINISHED
        if (data.data.status === "completed") {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          trackMeta("scan_completed", { location: "analysis", status: "completed" }, true);
          next();
        }

        // FAILED
        if (data.data.status === "failed") {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          console.log("Analysis failed");
        }

      } catch (error) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        console.error("Polling error:", error);
      }

    }, 10000); // every 2 sec
  };
  
  if (token && user && !user?.is_guest && !user?.has_accepted_terms) return  <ConsentPage /> ;

  return <div>
      <div className="max-w-7xl mx-auto px-4 pt-5">
        <Progress value={progress} color={COLORS.teal}/>
        {current > 0 && current < 2 && (
          <button
            onClick={previous}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Icon name="arrow-left" size={16} />
            Previous
          </button>
        )}
      </div>
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }}>
            {current === 0 && <ResumeUpload next={storeResume} resumeName={resumeName} setResumeName={setResumeName}  resumeFile={resumeFile}  setResumeFile={setResumeFile}/>} 
            {current === 1 && <JobDescription next={analyzeResume} jobText={jobText} setJobText={setJobText} resumeUploading={resumeUploading}/>} 
            {/* {current === 2 && <Analysis/>}  */}
            {current === 2 && <CVAnalysisLoader/>} 
            
            {current === 3 && <FreeResult restart={restart} next={unlockAnalysis} goMobile={goMobile}/>} 
            {current === 4 && <FinalResult restart={restart} goMobile={goMobile} onReview={() => setReviewModalOpen(true)}/>}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileComingSoonModal open={mobileModalOpen} onClose={() => setMobileModalOpen(false)}/>
      <ReviewPromptModal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)}/>
      <AnimatePresence>{showErrorModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"><motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl"><div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-3xl">⚠️</div></div><h2 className="mt-6 text-center text-2xl font-black text-white">Unlock optimized resume Failed</h2><p className="mt-3 text-center text-slate-300">{errorMessage}</p><div className="mt-8 flex gap-3"><button onClick={()=>{localStorage.setItem("redirect","app") ; setShowErrorModal(false) ; window.location.replace('/#pricing')}} className="flex-1 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-white transition hover:scale-[1.02]">Buy More Credits</button><button onClick={() => setShowErrorModal(false)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white">Close</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>;
}


function CreditStat({title,value}) {
  return <div className="rounded-[2rem] bg-white p-7 shadow-xl"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 font-black">◆</div><p className="mt-6 text-sm font-black text-slate-500">{title}</p><div className="mt-2 text-6xl font-black">{value}</div><p className="mt-2 text-slate-500">Resume credits</p></div>;
}


function ViewAnalyse() {
  const { setMode } = useAuth();
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const backToDashboard = () => {
    localStorage.setItem("changemode", "dashboard");
    window.location.replace("/");
  };
  const backToNewAnalyse = () => {
    localStorage.setItem("changemode", "app");
    window.location.replace("/");
  };
  const goMobile = () => setMobileModalOpen(true);
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <button onClick={backToDashboard} > ← Back to dashboard</button>
      </div>
      <FinalResult restart={backToNewAnalyse} goMobile={goMobile} onReview={() => {}} />
      <MobileComingSoonModal open={mobileModalOpen} onClose={() => setMobileModalOpen(false)} />
    </>
  );
}

function Dashboard() {

  const {
    user,
    credits,
    refreshUser,
    setMode
  } = useAuth();
  const [refreshCooldown, setRefreshCooldown] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState(0);


  useEffect(() =>{  localStorage.removeItem("redirect");}, []);

  const token = localStorage.getItem("token");
  const history =  user.transactions;
  const analyses = user.analyses ?? [];

  // Open a past analysis: reuse the existing app-flow that resumes into the
  // result view by reading analysisId + cvmatch_current from localStorage.
  const openAnalysis = (a) => {
    const id = a?.uuid || a?.id;
    if (!id) return;
    localStorage.setItem("analysisId", id);
    // localStorage.setItem("cvmatch_current", "4");
    localStorage.setItem("changemode", "viewanalyse");
    window.location.replace("/");
  };

  const handleRefresh = async () => {
    if (refreshCooldown) return;

    await refreshUser();

    setRefreshCooldown(true);
    setRefreshTimer(50);

    const interval = setInterval(() => {
      setRefreshTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRefreshCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  return <main className="mx-auto max-w-7xl px-4 py-12">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[.24em] text-cyan-500">
          Account dashboard
        </p>

        <h1 className="mt-2 text-4xl md:text-6xl font-black">
          My Resume Credits
        </h1>

        <p className="mt-3 text-slate-600">
          {token ? "You are connected with "+user.email+" ." : "Prototype mode"} 
        </p>
      </div>

      <button
        onClick={handleRefresh}
        disabled={refreshCooldown}
        className="rounded-2xl bg-black px-5 py-3 text-white font-black disabled:opacity-40"
      >
        {refreshCooldown
          ? `Refresh in ${refreshTimer}s`
          : "Refresh"}
      </button>
    </div>
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <CreditStat title="Total purchased" value={credits?.total ?? 0}/><CreditStat title="Credits used" value={credits?.used ?? 0}/><CreditStat title="Remaining balance" value={credits?.remaining ?? 0}/>
    </div>
    <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl flex items-center justify-between">
      <div>
        <p className="text-sm font-black text-slate-500">Activity overview</p>
        <h2 className="text-2xl font-black">Your usage stats</h2>
      </div>

      <div className="flex gap-10 text-center">
        <div>
          <p className="text-sm text-slate-500">Resumes uploaded</p>
          <p className="text-4xl font-black text-cyan-600">{user.resumes_count ?? 0}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Analyses generated</p>
          <p className="text-4xl font-black text-blue-600">{user.analyses_count ?? 0}</p>
        </div>
      </div>
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.7fr]">
      {/* <div className="rounded-[2rem] bg-white p-7 shadow-xl"><h2 className="text-2xl font-black">Credit history</h2><div className="mt-6 space-y-3">{history.map((h,i)=><div key={i} className="rounded-2xl bg-slate-50 p-4"><p className="font-black">{h.label}</p><p className="text-sm text-slate-500">{h.detail}</p></div>)}</div></div> */}
      <div className="rounded-[2rem] bg-white p-7 shadow-xl">
        <h2 className="text-2xl font-black">Credit history</h2>

        {history.length > 0 ? (
          <div className="mt-6 space-y-3">
            {history.map((h, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100"
              >
                <p className="font-black">{h.label}</p>
                <p className="text-sm text-slate-500">{h.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">
              <span className="text-3xl">🪙</span>
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              No credit activity yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Your purchases, credit usage, refunds, and bonuses will appear here once
              you start using credits.
            </p>
          </div>
        )}
      </div>
      <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl"><h2 className="text-2xl font-black">Ready to optimize?</h2><p className="mt-2 text-white/55">Each unlocked resume consumes 1 credit. You have <b className="text-cyan-300">{credits?.remaining ?? 0}</b> credits left.</p><div className="mt-6 rounded-3xl bg-white/5 p-5"><p className="text-white/50">Usage rule</p><p className="text-3xl font-black">1 resume = 1 credit</p></div><PremiumButton onClick={()=>go("app", setMode)} className="mt-6 w-full">Optimize a resume</PremiumButton><button onClick={()=>{localStorage.setItem("redirect","app") ;  window.location.replace("/#pricing"); }}  className="mt-3 w-full rounded-2xl border border-white/20 py-4 font-black">Buy more credits</button></div>
    </div>
    <div className="mt-8 rounded-[2rem] bg-white p-7 shadow-xl">
      <h2 className="text-2xl font-black">My analyses</h2>
      {analyses.length > 0 ? (
        <div className="mt-6 space-y-3">
          {analyses.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black">Resume analysis</p>
                  {a.is_full_unlocked ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Unlocked</span>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-600">Locked</span>
                  )}
                  {typeof a.score === "number" && a.score > 0 && (
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">Score {a.score}</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {a.status}{a.created_at ? " · " + new Date(a.created_at).toLocaleDateString() : ""}
                </p>
              </div>
              <button
                onClick={() => openAnalysis(a)}
                className="shrink-0 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                View analysis
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow"><span className="text-3xl">📄</span></div>
          <h3 className="text-lg font-bold text-slate-800">No analyses yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">Your resume analyses will appear here. Optimize a resume to get started.</p>
        </div>
      )}
    </div>
  </main>;
}

function AuthCallback({pathname}) {
  const {
    setMode,
    refreshUser
  } = useAuth();

  const [status, setStatus] = useState( "Connecting your account..." );
  const sleep = (ms) =>  new Promise((resolve) => setTimeout(resolve, ms));
  

  useEffect(() => {
    async function handleAuth() {
      try {
        if (pathname === "/auth/callback"){
          setStatus("Connecting your account...");
          await sleep(1200);

          setStatus("Verifying Google authentication...");
          await sleep(1800);
        }

        const token = new URLSearchParams( window.location.search ).get("token");
        if (!token) {
          console.error("No token found");
          setMode("landing") ;
          window.location.replace("/");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.removeItem("guest_token");
        setStatus("Loading your dashboard...");
        await sleep(1200);

        if (pathname === "/auth/callback"){
          setStatus("Authentication successful");
          await sleep(1500);
        }

      } catch (error) {
        console.error("Auth callback error:", error);
        if (pathname === "/auth/callback"){
          setStatus("Authentication failed");
        }
        if (pathname === "/payement/callback"){
          setStatus("Paiement failed");
        }
        await sleep(2500);
      }
      window.location.replace("/");
    };

    handleAuth();}, []);

  
  return (<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4"><div className="absolute inset-0 overflow-hidden"><div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" /><div className="absolute bottom-[-10%] right-[-10%] h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" /><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" /></div><motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-10 backdrop-blur-2xl shadow-2xl"><div className="flex justify-center"><motion.div animate={{ boxShadow: ["0 0 20px rgba(6,182,212,.3)", "0 0 60px rgba(6,182,212,.6)", "0 0 20px rgba(6,182,212,.3)"] }} transition={{ repeat: Infinity, duration: 2 }} className="flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-500 text-4xl font-black text-white">CV</motion.div></div><div className="mt-8 text-center"><h1 className="text-3xl font-black text-white">CVMatch AI</h1><p className="mt-3 text-slate-300">Secure authentication in progress</p></div><div className="mt-10 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-14 w-14 rounded-full border-4 border-white/10 border-t-cyan-400" /></div><AnimatePresence mode="wait"><motion.p key={status} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="mt-8 text-center text-sm font-medium text-slate-300">{status}</motion.p></AnimatePresence><div className="mt-8 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "easeInOut" }} className="h-2 rounded-full bg-cyan-400" /></div><p className="mt-8 text-center text-xs text-slate-500">Preparing your AI workspace...</p></motion.div></div>);
}


function App() {
  
  const { mode, setMode, user, credits, refreshUser } = useAuth();
  const hasRefreshedFromChangeMode = useRef(false);
  const [activeAppStep, setActiveAppStep] = useState(null);
  const location = useLocation();
  // const startApp = () =>{ trackMeta("getFreeScore", { method: "google", location: "site_header_or_landing" }, true); go("app", setMode);}
  const startApp = () =>{ trackMeta("getFreeScore", { method: "google", location: "site_header_or_landing" }, true); localStorage.setItem("changemode","app") ;  window.location.replace("/"); }
  const goHome = () => { window.location.replace("/");}
  const total=5, used=2, credit=total-used;

  

  const is404 = !matchRoutes(approutes, location) ;
  const pathname = location.pathname;
  const hash = location.hash;
  const params = new URLSearchParams(location.search);


  useEffect(() => {
    if (user && !user?.is_guest) trackGoogleLoginCompletedFromPaywall();
  }, [user]);


  useEffect(() => {
    if( !hasRefreshedFromChangeMode.current){
      hasRefreshedFromChangeMode.current = true;
      localStorage.removeItem("changemode")
    }
    const run = async () =>  { await refreshUser() ; }
    if(pathname === "/"  ) run();
  } , [mode ,pathname , hash]);

  
  useEffect(() => {

    // if (pathname === "/auth/callback") { setMode("callback");}
    // if (pathname !== "/auth/callback" && pathname !== "/payment/success" && pathname !== "/payment/cancel" && redirect) { setMode(redirect) ;}
    if (pathname+hash === "/#proof") {setMode("landing");setTimeout(()=>document.getElementById("proof")?.scrollIntoView({behavior:"smooth"}),500)}
    if (pathname+hash === "/#proof") {setMode("landing");setTimeout(()=>document.getElementById("proof")?.scrollIntoView({behavior:"smooth"}),500)}
    if (pathname+hash === "/#how") {setMode("landing"); setTimeout(()=>document.getElementById("how")?.scrollIntoView({behavior:"smooth"}),500)}
    if (pathname+hash === "/#pricing") {setMode("landing"); setTimeout(()=>document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"}),500)}
    if (pathname+hash === "/#mobile") {setMode("landing"); setTimeout(()=>document.getElementById("mobile")?.scrollIntoView({behavior:"smooth"}),500)}
    // alert(pathname) ;
  }, [pathname, hash]);


  return <div className="min-h-screen text-slate-950" style={{ background: COLORS.cream }}>
      {mode === "callback" && ( <AuthCallback  pathname={pathname}/>)}
      {mode !== "callback"  && ( <>
        { (!matchRoutes(routesDontNeedDefaultHeader, location) )?  
        (!is404 && <Header onStart={startApp}  user={user} credits={credits} lockedResultActive={mode === "app" && activeAppStep === 3}   setMode={setMode} onHome={goHome}/>)
        :
        (!is404 && <HeaderX />)
        } 
        <Routes>
        {/* pages légales */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/cookie" element={<CookiePage />} />
          <Route path="/contact" element={<ContactSupportPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/ai-disclaimer" element={<AidisclaimerPage />} />
          <Route path="/acceptable-use" element={<AcceptableUsePage />} />
          <Route path="/dmca-copyright" element={<DmcaPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          {/* app principale (fallback logique mode) */}
          <Route  path="/" element={
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>{mode === "landing" && ( <LandingPage onStart={startApp} setMode={setMode} /> )} {mode === "app" && (<CVMatchApp setActiveAppStep={setActiveAppStep} /> )} {mode === "dashboard" && (<Dashboard user={user} credits={credits} setMode={setMode} /> )} {mode === "viewanalyse" && (<ViewAnalyse />)}  </motion.div>
            </AnimatePresence>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
       
        
        {!is404 && <footer className="border-t border-slate-200 bg-white/60 py-2">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
            <FooterLogo />
            <div className="footer-links items-center gap-5 text-sm font-medium">
              <a href="/#pricing"  className="hover:text-cyan-600 transition-colors">Pricing </a>
              {navigation.map((item) => (
                <Link key={item.id} to={item.url} className="hover:text-cyan-600 transition-colors" >{item.label} </Link>
              ))}
              <a href="mailto:assistance@cvmatchai.us" className="hover:text-cyan-600 transition-colors">Support</a>
            </div>
          </div>
        </footer>}
      </>
      )}
    </div>;
  
}
