import React from "react";
import { useEffect,useState } from "react";
import { Link,  useNavigate } from "react-router-dom";
import {PremiumButton} from "./Ui";
import { useAuth } from "../context/AuthContext";
import {API_URL }from "../components/Routes";


const COLORS = { primary: "#07111F", teal: "#22D3EE", blue: "#3B82F6", gold: "#C8A96A", cream: "#F8F7F3" };

export function ConsentPage() {
  const { user, setMode, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [aiDisclaimer, setAiDisclaimer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedRecord, setSavedRecord] = useState(null);
  const canContinue = terms && privacy && aiDisclaimer;

  useEffect(() => { if (!user.isAuthenticated) navigate("/"); }, [user.isAuthenticated, navigate]);
  useEffect(() => { if (!user?.is_guest) navigate("/"); }, [user.isAuthenticated, navigate]);

  const handleSubmit = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const headers = { Accept: "application/json", };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } 
       
      const response = await fetch(`${API_URL}/v1/auth/accept-terms`, {
        method: "POST",
        credentials: "include",
        headers
      });
      if ( response.status === 401 ) {
        connectWithGoogle(token);
        return;
      }
      const data = await response.json();

      if (response.ok) {
        await refreshUser();
        setMode('app') ;
        
      }

    } catch (error) {
      console.error("Analysis error:", error);
    }
    // setTimeout(() => {
    //   const record = auth.saveConsent({ terms, privacy, aiDisclaimer });
    //   setSavedRecord(record);
      setSubmitting(false);
    //   setTimeout(() => navigate("/dashboard"), 900);
    // }, 700);
  };

  return (
    <main className="min-h-screen" style={{ background: COLORS.cream }}>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-500">Required consent</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Before using CVMatch AI</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">Please review and confirm the legal terms before continuing. These confirmations are stored with timestamp, user ID, policy version, and device metadata.</p>
          <Card className="mt-8 bg-black p-6 text-white">
            <h3 className="text-xl font-black">Connected user</h3>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p><b className="text-white">Email:</b> {user?.email}</p>
            </div>
          </Card>
        </div>
        <Card className="p-7 md:p-9">
          <h2 className="text-3xl font-black text-slate-950">Consent confirmation</h2>
          <p className="mt-2 text-slate-500">All three confirmations are required.</p>
          <div className="mt-7 space-y-4">
            <ConsentCheckbox checked={terms} onChange={setTerms} title="I agree to the Terms of Service" description="I confirm that I have read and accepted CVMatch AI Terms of Service." link="/terms" linkLabel="Read Terms" />
            <ConsentCheckbox checked={privacy} onChange={setPrivacy} title="I acknowledge the Privacy Policy" description="I understand how CVMatch AI may collect and process my resume, job description, usage and payment data." link="/privacy" linkLabel="Read Privacy Policy" />
            <ConsentCheckbox checked={aiDisclaimer} onChange={setAiDisclaimer} title="I understand that AI-generated results require human review" description="I acknowledge that all resumes, cover letters and results should be reviewed and verified before use." />
          </div>
          
          <PremiumButton disabled={!canContinue || submitting} onClick={handleSubmit} className="mt-7 w-full">{submitting ? "Saving consent..." : "Continue"}</PremiumButton>
          {savedRecord && <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">Consent saved successfully. Redirecting to dashboard...</div>}
        </Card>
      </section>
    </main>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-slate-100  shadow-sm ${className}`}>{children}</div>;
}

function ConsentCheckbox({ checked, onChange, title, description, link, linkLabel }) {
  return (
    <label className={`block rounded-3xl border p-5 transition ${checked ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-white"}`}>
      <div className="flex gap-4">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-5 w-5 accent-cyan-500" />
        <div>
          <p className="font-black text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          {link && <Link to={link} target="_blank" className="mt-3 inline-block text-sm font-black text-cyan-600 hover:text-cyan-700">{linkLabel}</Link>}
        </div>
      </div>
    </label>
  );
}
