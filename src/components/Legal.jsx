import React from "react";
import { useEffect } from "react";
const SUPPORT_EMAIL = "assistance@cvmatchai.us";
const EFFECTIVE_DATE = "May 2026";


export  function TermsPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="These Terms explain how users may access and use CVMatch AI services."
    >
      <Section title="1. Services">
        <p>
          CVMatch AI provides AI-assisted resume analysis and optimization tools,
          including ATS compatibility analysis, resume optimization, resume matching
          against job descriptions, cover letter generation, and credit-based resume services.
        </p>
      </Section>

      <Section title="2. User Accounts">
        <p>
          Users may create an account using supported authentication methods. Users agree to
          provide accurate information, maintain account security, and keep login credentials confidential.
        </p>
      </Section>

      <Section title="3. Credits and Purchases">
        <ul className="ml-6 list-disc space-y-2">
          <li>Credits are purchased through authorized payment providers.</li>
          <li>Credits are consumed when optimization services are used.</li>
          <li>Credits have no monetary value outside the platform.</li>
          <li>Credits may not be transferred or resold.</li>
        </ul>
      </Section>

      <Section title="4. Acceptable Use">
        <p>Users agree not to upload malicious content, use the service unlawfully, attempt unauthorized access, or abuse automated systems.</p>
      </Section>

      <Section title="5. Intellectual Property">
        <p>
          CVMatch AI and its content, branding, software, and technology remain the property
          of Business Help Consulting or its applicable rights holders.
        </p>
      </Section>

      <Section title="6. Disclaimer">
        <p>
          CVMatch AI provides AI-generated recommendations and optimization assistance. We do not
          guarantee employment, interviews, or hiring outcomes. Users remain responsible for reviewing
          and validating generated content before submitting job applications.
        </p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>
          CVMatch AI shall not be liable for indirect, incidental, or consequential damages arising from use of the service.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          For questions about these Terms, contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-cyan-600">
            {SUPPORT_EMAIL}
          </a>.
        </p>
      </Section>
    </LegalLayout>
  );
}


export  function PrivacyPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="This Privacy Policy explains how CVMatch AI collects, uses, and protects user information."
    >
      <Section title="1. Information Collected">
        <p>We may collect information required to provide the service, including:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Name and email address</li>
          <li>Resume content uploaded by users</li>
          <li>Job descriptions submitted by users</li>
          <li>Usage, device, and analytics information</li>
          <li>Payment status information from payment providers</li>
        </ul>
      </Section>

      <Section title="2. How Information Is Used">
        <p>Information may be used to provide resume optimization services, improve the platform, monitor performance, process payments, and communicate with users.</p>
      </Section>

      <Section title="3. Resume Data">
        <p>
          Uploaded resumes and job descriptions are processed to generate analysis, optimization results,
          and related application materials. Users should review all generated content before use.
        </p>
      </Section>

      <Section title="4. Analytics and Tracking">
        <p>
          CVMatch AI may use analytics and tracking tools such as Google Analytics, Meta Pixel,
          and similar performance tools to understand usage and improve the service.
        </p>
      </Section>

      <Section title="5. Third-Party Services">
        <p>We may use third-party services for payment processing, authentication, analytics, and infrastructure, including Paddle, Google, and Meta.</p>
      </Section>

      <Section title="6. Data Security">
        <p>
          Reasonable technical and organizational measures are used to protect user data. However,
          no online service can guarantee absolute security.
        </p>
      </Section>

      <Section title="7. User Rights">
        <p>
          Users may request access, correction, or deletion of personal data by contacting us.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          For privacy requests, contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-cyan-600">
            {SUPPORT_EMAIL}
          </a>.
        </p>
      </Section>
    </LegalLayout>
  );
}

export function RefundPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <LegalLayout
      title="Refund Policy"
      subtitle="This Refund Policy explains when refund requests may be reviewed for CVMatch AI digital credit purchases."
    >
      <Section title="1. Digital Credit-Based Services">
        <p>
          CVMatch AI sells digital credit-based services. Credits are used to access resume
          analysis, resume optimization, and related AI-assisted features.
        </p>
      </Section>

      <Section title="2. Refund Eligibility">
        <p>Refund requests may be considered in cases such as:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Duplicate charges</li>
          <li>Payment processing errors</li>
          <li>Credits not delivered correctly after a successful payment</li>
          <li>Technical failures that prevented use of purchased credits</li>
        </ul>
      </Section>

      <Section title="3. Non-Refundable Situations">
        <p>Refunds are generally not available for:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Used credits</li>
          <li>Completed resume optimization sessions</li>
          <li>User dissatisfaction after successful delivery of the digital service</li>
        </ul>
      </Section>

      <Section title="4. Request Process">
        <p>
          Refund requests should include the purchase information, account email, and a description
          of the issue. Requests may be submitted to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-cyan-600">
            {SUPPORT_EMAIL}
          </a>.
        </p>
      </Section>

      <Section title="5. Review">
        <p>
          Each request is reviewed individually. Approved refunds will be processed through the original payment method.
        </p>
      </Section>
    </LegalLayout>
  );
}

function LegalLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen" style={{ background: "#F8F7F3" }}>
      <section className="mx-auto max-w-5xl px-4 py-14 md:py-20">
        <div className="mb-10 rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl md:p-10">
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