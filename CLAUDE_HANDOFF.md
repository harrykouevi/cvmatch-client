# CVMatch AI — Claude Handoff

Goal: audit and improve crawlability, product reliability, security, funnel, and production readiness.

Hard constraints:
- PRODUCTION DESIGN LOCKED.
- Preserve current production design from https://cvmatchai.us.
- Do not redesign.
- Do not change layout, colors, spacing, components, visual structure.
- PRICING LOCKED.
- ABSOLUTE RULE: any pricing change is forbidden. If a task requires pricing changes, stop and report "pricing locked".
- Do not add/remove pricing plans.
- Do not change checkout, credits, paywall, or payment logic unless explicitly requested.
- No secrets should be added to code.
- Do not use real user data, real resumes, logs, or production database files.

Focus areas:
1. Crawlability without visual redesign:
   - ensure visible hero text exists in initial HTML when possible
   - title/meta/canonical/Open Graph/schema/sitemap/robots
   - no hidden SEO text, no keyword stuffing

2. Reliability:
   - upload validation
   - error states
   - queue/worker behavior
   - API fallbacks

3. Security:
   - no sensitive logging
   - no resume/JD in analytics payload
   - ownership checks
   - webhook verification

4. Funnel:
   - CTA links
   - scan flow
   - partial/full result logic
   - payment/unlock flow using existing pricing only

5. Production readiness:
   - npm build
   - audits
   - environment docs
   - deployment checklist
