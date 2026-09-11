import React from "react";

export const COLORS = {
  primary: "#07111F",
  navy: "#0B1628",
  teal: "#22D3EE",
  blue: "#3B82F6",
  gold: "#C8A96A",
  cream: "#F8F7F3",
  softBlue: "#EAF6FF",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  textMuted: "#64748B",
  navy2: "#0B1628",
  cyan: "#22D3EE",
  green: "#22C55E",
  orange: "#F59E0B",
};


// =====================================================
// UI COMPONENTS
// =====================================================
export const Container = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-5xl mx-auto p-6">{children}</div>
  </div>
);

export const Card = ({ children }) => (
  <div className="bg-white border shadow rounded-2xl p-5">{children}</div>
);

export const Button = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 bg-black text-white rounded-xl w-full disabled:opacity-50"
  >
    {children}
  </button>
);

export function PremiumButton({ children, onClick, variant = "primary", className = "", disabled = false }) {
  const styles = variant === "gold"
    ? { background: COLORS.gold, color: COLORS.primary, boxShadow: "0 18px 45px rgba(200,169,106,0.32)" }
    : { background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.teal})`, color: "white", boxShadow: "0 18px 45px rgba(59,130,246,0.28)" };
  return <button disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center rounded-2xl px-7 py-4 font-black transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 ${className}`} style={styles}>{children}</button>;
}

export function PrimaryLink({ href, children, tone = "cyan" }) {
  const gradient =
    tone === "dark"
      ? "linear-gradient(135deg,#07111F,#111827)"
      : "linear-gradient(135deg,#3B82F6,#22D3EE)";

  return (
    <a
      href={href}
      className="rounded-2xl px-7 py-4 text-center font-black text-white shadow-xl transition hover:-translate-y-0.5"
      style={{
        background: gradient,
        boxShadow:
          tone === "dark"
            ? "0 20px 45px rgba(15,23,42,.18)"
            : "0 20px 45px rgba(34,211,238,.25)",
      }}
    >
      {children}
    </a>
  );
}

export function PrimaryButton({  onClick, children, tone = "cyan" , className = "", disabled = false }) {
  const gradient =
    tone === "dark"
      ? "linear-gradient(135deg,#07111F,#111827)"
      : "linear-gradient(135deg,#3B82F6,#22D3EE)";

  return (
    <button disabled={disabled} onClick={onClick}
      className="rounded-2xl px-7 py-4 text-center font-black text-white shadow-xl transition hover:-translate-y-0.5"
      style={{
        background: gradient,
        boxShadow:
          tone === "dark"
            ? "0 20px 45px rgba(15,23,42,.18)"
            : "0 20px 45px rgba(34,211,238,.25)",
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryLink({ href, children }) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg"
    >
      {children}
    </a>
  );
}

export function SecondaryButton({   onClick, children, className = "", disabled = false }) {
  return (
    <button disabled={disabled} onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg"
    >
      {children}
    </button>
  );
}

export function Icon({ name, size = 20, className = "" }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className, "aria-hidden": true };
  const icons = {
    check: <path d="M20 6L9 17l-5-5" />,
    arrow: <><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></>,
    upload: <><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></>,
    sparkles: <><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></>,
    alert: <><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
    star: <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    download: <><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></>,
  };
  return <svg {...common}>{icons[name] || icons.check}</svg>;
}


export function SoftGlow({ type }) {
  const isSuccess = type === "success";
  return (
    <>
      <div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: isSuccess ? "rgba(34,197,94,.18)" : "rgba(245,158,11,.18)" }}
      />
      <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />
    </>
  );
}

export function StatusIcon({ type }) {
  const isSuccess = type === "success";
  return (
    <div className="relative mx-auto h-24 w-24">
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: isSuccess ? "rgba(34,197,94,.34)" : "rgba(245,158,11,.34)" }}
      />
      <div
        className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border text-5xl font-black shadow-2xl"
        style={{
          background: isSuccess
            ? "linear-gradient(135deg, rgba(34,197,94,.22), rgba(34,211,238,.14))"
            : "linear-gradient(135deg, rgba(245,158,11,.22), rgba(248,113,113,.12))",
          color: isSuccess ? "#86EFAC" : "#FDBA74",
          borderColor: isSuccess ? "rgba(134,239,172,.32)" : "rgba(253,186,116,.32)",
        }}
      >
        {isSuccess ? "✓" : "!"}
      </div>
    </div>
  );
}

export function CreditSummary({ purchase }) {
  return (
    <div className="mt-8 grid gap-4 rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-cyan-50 to-white p-6 text-left shadow-inner md:grid-cols-2">
      <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[.18em] text-emerald-600">
          Credits Pending
        </p>
        <div className="mt-2 text-5xl font-black text-emerald-600">
          +{purchase?.creditsAdded}
        </div>
        <p className="mt-1 text-sm font-bold text-slate-500">Resume credits</p>
      </div>

     

      <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">
          Purchase
        </p>
        <div className="mt-2 text-xl font-black text-slate-950">
          {purchase?.plan}
        </div>
       
        <p className="mt-1 text-sm font-bold text-slate-500">
          status : Processing...
        </p>
      </div>
    </div>
  );

  
}

export function InfoStep({ number, title, text, color = "cyan" }) {
  const colorClass =
    color === "green" ? "bg-emerald-100 text-emerald-700" : "bg-cyan-100 text-cyan-700";

  return (
    <div className="group flex items-start gap-4 rounded-3xl border border-slate-100 bg-white/80 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${colorClass}`}>
        {number}
      </span>
      <div>
        <p className="font-black text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}
