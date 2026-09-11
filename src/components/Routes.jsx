// pages/NotFoundPage.jsx
import { Link } from "react-router-dom";


// routes.js

export const approutes = [
  { path: "/" },

  { path: "/terms" },
  { path: "/privacy" },
  { path: "/refund" },
  { path: "/cookie" },
  { path: "/contact" },
  { path: "/security" },
  { path: "/ai-disclaimer" },
  { path: "/acceptable-use" },
  { path: "/dmca-copyright" },

  { path: "/product/:id" },
  { path: "/checkout/:id" },

  { path: "/auth/callback" },
  { path: "/payment/success" },
  { path: "/payment/cancel"}, 
];


export const routesDontNeedDefaultHeader = [
  { path: "/terms" },
  { path: "/privacy" },
  { path: "/refund" },
  { path: "/cookie" },
  { path: "/contact" },
  { path: "/security" },
  { path: "/ai-disclaimer" },
  { path: "/acceptable-use" },
  { path: "/dmca-copyright" },
  { path: "/payment/success" },
  { path: "/payment/cancel"}, 
];

export const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "https://api.cvmatchai.us/api";


export function NotFoundPage() {
  return ( <main className="min-h-screen relative overflow-hidden" style={{ background: `radial-gradient(circle at 20% 10%, rgba(34,211,238,0.16), transparent 30%), radial-gradient(circle at 85% 15%, rgba(59,130,246,0.16), transparent 28%), linear-gradient(180deg,#FFFFFF,#dfe1ff)` }} >
     
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center  ">
      <h1 className="text-8xl font-black text-cyan-600">404</h1>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        Oups, page introuvable
      </h2>

      <p className="mt-3 max-w-md text-slate-600">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-xl bg-cyan-600 px-6 py-3 text-white font-semibold shadow-lg transition hover:bg-cyan-700 hover:scale-105"
      >
        Retour à l'accueil
      </Link>
    </div>
    </main>
  );
}