import React from "react";
import { useEffect,useState } from "react";
import {  Link} from "react-router-dom";
import {
 
  AlertTriangle,
} from "lucide-react";

const SUPPORT_EMAIL = "assistance@cvmatchai.us";
const BUSINESS_NAME = "CVMatch AI";
const EFFECTIVE_DATE = "May 2026";
const GOVERNING_LAW = "United States and shall be interpreted under applicable U.S. laws";


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

export  function TermsPage() {
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  const sections = [
      {
        title: "1. Services",
        content:
          "CVMatch AI provides AI-assisted resume analysis, ATS compatibility review, resume optimization, cover letter generation, and credit-based digital services.",
      },
      {
        title: "2. Accounts",
        content:
          "Users must provide accurate information and are responsible for maintaining the confidentiality of their account credentials.",
      },

      // =========================
      // CRITICAL US COMPLIANCE
      // =========================
      {
        title: "3. Credits System (Prepaid Digital Units)",
        content:
          "Credits are prepaid digital units used to access platform features. Credits do not represent real currency, have no cash value, are non-transferable, non-resellable, and are consumed upon service execution. Credits may not be withdrawn or exchanged for money.",
      },
      {
        title: "4. No Subscription Billing",
        content:
          "CVMatch AI does not currently offer monthly subscription billing. Purchases are made as one-time digital credit purchases unless a different offer is clearly presented at checkout.",
      },
      {
        title: "5. Credits Pricing & Transparency",
        content:
          "All credit packages and prices are clearly displayed before purchase. Users are informed of exactly how many credits they receive and what services they unlock. Credits do not represent monetary value or financial instruments.",
      },
      {
        title: "6. Credit Expiration Policy",
        content:
          "Credits do not expire unless explicitly stated at the time of purchase. Any expiration policy will be clearly disclosed before checkout.",
      },
   
      {
        title: "7. Payments and Billing",
        content:
          "CVMatch AI may suspend or terminate accounts associated with fraudulent payments, unauthorized transactions, excessive disputes, chargebacks, or abuse of the payment system.",
      },
      {
        title: "8. Chargebacks and Fraud",
        content:
          "CVMatch AI may suspend or terminate accounts associated with fraudulent payments, unauthorized transactions, excessive disputes, chargebacks, or abuse of the payment system.",
      },
      {
        title: "9. Service Availability",
        content:
          "CVMatch AI may temporarily suspend access for maintenance, updates, security reasons, operational needs, or technical issues.",
      },
      {
        title: "10. Acceptable Use",
        content:
          "Users may not misuse the service, upload harmful content, or attempt unauthorized access.",
      },
      
      {
        title: "11. Disclaimer",
        content:
          "CVMatch AI provides AI-generated suggestions only and does not guarantee employment outcomes.",
      },
      {
        title: "12. No Employment Guarantee",
        content:
          "CVMatch AI does not guarantee interviews, job offers, hiring decisions, employment outcomes, or acceptance by any applicant tracking system.",
      },
       {
        title: "13. No Warranty",
        content:
          "The service is provided on an “as is” and “as available” basis without warranties of any kind, express or implied, to the maximum extent permitted by law.",
      },
      {
        title: "14. Limitation of Liability",
        content:
          "To the maximum extent permitted by law, CVMatch AI and its operators shall not be liable for indirect, incidental, consequential, special, punitive, or lost-profit damages arising from use of the platform.",
      },
      {
        title: "15. Export Compliance",
        content:
          "Users may not use CVMatch AI in violation of U.S. export control laws, sanctions regulations, or other applicable restrictions.",
      },
      {
        title: "16. Account Suspension",
        content:
          "We may suspend or terminate accounts involved in fraud, abuse, unlawful activity, security threats, or violations of these Terms.",
      },
      {
        title: "17. Governing Law",
        content:
          `These Terms are intended for use in connection with services offered to users in the ${GOVERNING_LAW}, subject to mandatory consumer protection laws.`,
      },
      {
        title: "18. Entire Agreement",
        content:
          "These Terms constitute the entire agreement between the user and CVMatch AI regarding use of the platform.",
      },
      {
        title: "19. Contact",
        content: `Questions about these Terms may be sent to ${SUPPORT_EMAIL}`,
      },
    ] ;
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="These Terms explain how users may access and use CVMatch AI services."
    >
      <ConsentBox />
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
       ))}
    </LegalLayout>
  );
}


export  function PrivacyPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  const sections = [
      {
        title: "1. Information Collected",
        content:
          "We may collect name, email address, account data, resume content, job descriptions, usage data, device data, analytics events, customer support messages, and payment status information.",
      },
      {
        title: "2. How We Use Data",
        content:
          "Information is used to provide resume optimization services, generate AI outputs, improve product quality, process purchases, prevent fraud, provide support, and communicate with users.",
      },
      {
        title: "3. Resume Data",
        content:
          "Uploaded resumes and job descriptions are processed to generate analysis, optimized resumes, cover letters, ATS compatibility insights, and related career materials.",
      },
      {
        title: "4. AI Processing",
        content:
          "By using CVMatch AI, users acknowledge that resumes, job descriptions, prompts, and related inputs may be processed by artificial intelligence systems and authorized infrastructure providers for service delivery.",
      },
      {
        title: "5. Sensitive Information",
        content:
          "Users should avoid uploading highly sensitive personal information, including social security numbers, banking information, medical records, government-issued identification documents, or unnecessary confidential data.",
      },
      {
        title: "6. Third-Party Services",
        content:
          "We may use third-party services for payments, authentication, analytics, email delivery, cloud hosting, customer support, and AI processing, including Stripe, Google, Meta, and infrastructure providers.",
      },
      {
        title: "7. Analytics and Tracking",
        content:
          "CVMatch AI may use analytics and tracking technologies to understand usage, measure marketing performance, improve the service, and protect the platform.",
      },
      {
        title: "8. California Privacy Rights",
        content:
          "California residents may request access, deletion, correction, and information about how personal data is used, subject to applicable exceptions.",
      },
      {
        title: "9. Do Not Sell My Personal Information",
        content:
          "CVMatch AI does not sell personal information. If this practice changes, we will update this policy and provide applicable opt-out rights.",
      },
      {
        title: "10. Marketing Communications",
        content:
          "Users may unsubscribe from non-essential marketing communications through unsubscribe links or by contacting support.",
      },
      {
        title: "11. Data Retention",
        content:
          "We retain personal information only as long as reasonably necessary to provide services, comply with legal obligations, resolve disputes, prevent fraud, and enforce agreements.",
      },
      {
        title: "12. International Transfers",
        content:
          "User information may be processed and stored in the United States or other countries where our service providers operate.",
      },
       {
        title: "13. Children’s Privacy",
        content:
          "CVMatch AI is not intended for children under 13 and does not knowingly collect personal information from children.",
      },

      {
        title: "14. Privacy Requests",
        content: `Privacy requests may be sent to ${SUPPORT_EMAIL}`,
      },
    ] ;
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="This Privacy Policy explains how CVMatch AI collects, uses, and protects user information."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
       ))}
    </LegalLayout>
  );
}

export function RefundPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const sections = [
      {
        title: "1. Digital Credit-Based Services",
        content:
          "CVMatch AI sells prepaid digital credits used to access resume analysis, optimization, cover letter generation, and AI-assisted career features.",
      },
      {
        title: "2. No Monthly Subscription",
        content:
          "Refund rules apply to one-time credit purchases. CVMatch AI does not currently charge recurring monthly subscription fees.",
      },
      {
        title: "3. Refund Eligibility",
        content:
          "Refunds may be reviewed for duplicate charges, payment processing errors, undelivered credits after successful payment, or technical failures that prevented use of purchased credits.",
      },
      {
        title: "4. Non-Refundable Situations",
        content:
          "Used credits, completed optimization sessions, successfully delivered AI outputs, and dissatisfaction after successful delivery of the digital service are generally non-refundable.",
      },
       {
        title: "5. Partial Use",
        content:
          "If a credit package has been partially used, CVMatch AI may deny a refund or issue a partial refund at its discretion, subject to applicable law.",
      },
      {
        title: "6. Chargebacks and Fraud",
        content:
          "Accounts associated with fraudulent payments, payment abuse, excessive disputes, or unauthorized chargebacks may be restricted, suspended, or terminated.",
      },
      {
        title: "7. Request Process",
        content:
          `Refund requests must include purchase details, account email, and issue description and should be sent to ${SUPPORT_EMAIL}`,
      },
      {
        title: "8. Review Timeline",
        content: "Refund requests are reviewed individually. Approved refunds are processed through the original payment method when technically possible.",
      },
    ] ;
  return (
    <LegalLayout
      title="Refund Policy"
      subtitle="This Refund Policy explains when refund requests may be reviewed for CVMatch AI digital credit purchases."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
      ))}
    </LegalLayout>
  );
}

export function CookiePage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const sections =[
      {
        title: "1. What Are Cookies",
        content:
          "Cookies are used for authentication, security, and improving user experience.",
      },
       {
        title: "2. Types of Cookies",
        content:
          "We may use essential cookies, analytics cookies, performance cookies, and advertising cookies where applicable.",
      },
      
      {
        title: "3. Third-Party Cookies",
        content:
          "Third-party providers such as Google Analytics, Meta Pixel, Stripe, or similar services may use cookies subject to their own policies.",
      },
      {
        title: "4. Managing Cookies",
        content:
          "Users may manage cookies through browser settings. Some features may not work properly if essential cookies are disabled.",
      },
      {
        title: "5. Analytics",
        content:
          "We use analytics tools to improve platform performance.",
      },
      {
        title: "6. Consent Banner",
        content:
          "Where required, CVMatch AI may display a cookie notice or consent banner allowing users to manage non-essential tracking preferences.",
      },
    ] ;

  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Explains cookies and tracking technologies."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
      ))}
    </LegalLayout>
  );
}

export function ContactSupportPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  const sections = [
      {
        title: "Business Name",
        content: BUSINESS_NAME,
      },
      {
        title: "Support Email",
        content: SUPPORT_EMAIL,
      },
      
      {
        title: "Billing and Refunds",
        content: `Billing and refund questions should be sent to ${SUPPORT_EMAIL} with the account email and purchase details.`,
     
      },
      {
        title: "Privacy Requests",
        content: `Access, correction, deletion, and privacy-related requests may be sent to ${SUPPORT_EMAIL}`,
      },
      {
        title: "Response Time",
        content: "We aim to respond to support, billing, privacy, and legal requests within 24–48 business hours.",
      },
    ];

  return (
    <LegalLayout
      title="Contact & Support"
      subtitle="Official support and legal contact information."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
      ))}
    </LegalLayout>
  );
}

export function SecurityPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const sections = [
      {
        title: "1. Encryption",
        content:
          "Data is encrypted in transit using modern security protocols.",
      },
      {
        title: "2. Authentication",
        content: "Secure authentication protects user accounts.",
      },
      {
        title: "3. Infrastructure",
        content:
          "Cloud providers maintain secure infrastructure and monitoring systems.",
      },
      {
        title: "4. Monitoring",
        content:
          "We monitor systems for abuse, fraud, and anomalies.",
      },
    ];
  return (
    <LegalLayout
      title="Security"
      subtitle="Security practices and infrastructure protection."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
      ))}
      
    </LegalLayout>
  );
}

export function AidisclaimerPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const sections = [
      {
        title: "AI-Generated Content",
        content:
          "CVMatch AI uses artificial intelligence to generate resume suggestions, ATS analysis, cover letters, and job-match recommendations.",
      },
      {
        title: "Accuracy Limitations",
        content: "AI outputs may be inaccurate, incomplete, outdated, biased, or unsuitable for a specific job application. Users must independently review all outputs.",
      },
      {
        title: "No Professional Advice",
        content:
          "CVMatch AI provides informational assistance only and does not provide legal, immigration, employment, financial, or professional career guarantees.",
      },
      {
        title: "No Hiring Decision",
        content:
          "CVMatch AI is not an employer, recruiter, staffing agency, background check provider, or hiring decision system. It does not make employment decisions.",
      },
      {
        title: "No Hiring Decision",
        content:
          "CVMatch AI is not an employer, recruiter, staffing agency, background check provider, or hiring decision system. It does not make employment decisions.",
      },
      {
        title: "User Review Required",
        content:
          "Users must confirm that generated resumes and cover letters are truthful, accurate, and do not misrepresent experience, education, credentials, or qualifications.",
      },
      {
        title: "No Guaranteed ATS Pass",
        content:
          "CVMatch AI may help improve resume alignment with job descriptions, but does not guarantee compatibility with every applicant tracking system.",
      },
    ];
  return (
    <LegalLayout
      title="Ai Disclaimer"
      subtitle="Important notice about AI-generated resume content."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
      ))}
      
    </LegalLayout>
  );
}

export function AcceptableUsePage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const sections = [
      {
        title: "Prohibited Conduct",
        content:
          "Users may not use CVMatch AI for unlawful, abusive, fraudulent, discriminatory, deceptive, or harmful activity.",
      },
      {
        title: "No Malware or Attacks",
        content: "Users may not upload malicious files, attempt unauthorized access, bypass security controls, scrape the platform, or overload systems.",
      },
      {
        title: "No Misrepresentation",
        content:
          "Users may not create fake resumes, impersonate others, fabricate credentials, or use generated content for fraud.",
      },
      {
        title: "Automated Abuse",
        content:
          "Bots, bulk automation, credential stuffing, scraping, or API abuse are prohibited without written authorization.",
      },
      {
        title: "Employment Integrity",
        content:
          "Users must not use CVMatch AI to falsify employment history, education, licenses, certifications, or legal eligibility to work.",
      },
      {
        title: "Enforcement",
        content:
          "Violations may result in account suspension, credit cancellation, service restriction, or legal action where appropriate.",
      }
    ];
  return (
    <LegalLayout
      title="Acceptable Use"
      subtitle="Rules preventing abuse, fraud, and harmful activity."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
      ))}
      
    </LegalLayout>
  );
}

export function DmcaPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const sections = [
      {
        title: "Copyright Respect",
        content:
          "CVMatch AI respects intellectual property rights and expects users to upload only content they own or are authorized to use.",
      },
      {
        title: "Takedown Requests",
        content: "Copyright complaints may be sent to assistance@cvmatchai.us with identification of the copyrighted work, location of the allegedly infringing material, contact details, and a good-faith statement.",
      },
      {
        title: "Counter Notices",
        content:
          "Where applicable, users may submit counter-notices if they believe material was removed by mistake or misidentification.",
      },
      {
        title: "Repeat Infringers",
        content:
          "Accounts repeatedly involved in copyright violations may be suspended or terminated.",
      }
    ];
  return (
    <LegalLayout
      title="DMCA / Copyright"
      subtitle="Copyright complaint and takedown process."
    >
      {sections.map((s, index) => (
        <Section key={ index} title={`${s.title}`}>
          <p>{s.content}</p>
        </Section>
      ))}
      
    </LegalLayout>
  );
}

function ConsentBox() {
  return (
    <div className="mb-10 consent-box  ">
      <div className="consent-icon"><AlertTriangle size={20} /></div>
      <div>
        <h3>Recommended consent logic</h3>
        <p>
          At signup and checkout, users should actively confirm: “I agree to the Terms of Service”,
          “I acknowledge the Privacy Policy”, and “I understand AI-generated outputs require human review”.
          Store consent timestamp, user ID, policy version, and IP/device metadata where appropriate.
        </p>
      </div>
    </div>
  );
}

function LegalLayout({ title, subtitle, children }) {
  const [activePage, setActivePage] = useState(title);
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: `radial-gradient(circle at 20% 10%, rgba(34,211,238,0.16), transparent 30%), radial-gradient(circle at 85% 15%, rgba(59,130,246,0.16), transparent 28%), linear-gradient(180deg,#FFFFFF,#dfe1ff)` }} >
      <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        {/* NAVIGATION */}
        <div className=" mb-5 rounded-2xl bg-white p-8">
          <h2 className="text-3xl font-black mb-6">Legal Navigation</h2>

          <div className="mb-10 flex flex-wrap gap-3">
            {navigation.map((item) => (
             
              <Link key={item.id} to={item.url} className={`px-4 py-2 rounded-xl font-bold ${
                  activePage === item.label ? "bg-slate-900 text-white" : "bg-slate-100"
                }`} >{item.label} </Link>
                            
            ))}
          </div>

          {/* <LegalPageView pageName={activePage} page={activeLegalPage} /> */}
        
          <div className="mb-2 rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl md:p-10">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">
              CVMatch AI Legal
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              {title}
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/60">
              {subtitle}
            </p>

            <p className="mt-5 text-sm font-bold text-white/45">
              Effective Date: {EFFECTIVE_DATE}
            </p>
          </div>
        </div>
        

        <article className="rounded-[2rem] bg-white p-6 leading-8 text-slate-700 shadow-sm md:p-10">
          {children}
        </article>
      </section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-9 last:mb-0">
      <h2 className="mb-3 text-2xl font-black text-slate-950">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}