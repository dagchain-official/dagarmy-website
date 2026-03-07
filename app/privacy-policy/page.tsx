"use client";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";

const sections = [
  {
    id: "overview",
    title: "1. Overview and Mission",
    content: `DAGChain Network ("the Company," "we," "us," or "our") operates the DAG Army platform (https://dagarmy.network). We recognize that privacy is a fundamental right. This Privacy Policy describes our standards for collecting, processing, and protecting your personal data when you use DAG Army — a structured AI Startup Ecosystem for builders, founders, and contributors across India, Pakistan, and Bangladesh.

This document is designed to meet the requirements of applicable data protection frameworks, including the EU General Data Protection Regulation (GDPR) and applicable laws in the jurisdictions we serve.`,
  },
  {
    id: "scope",
    title: "2. Scope and Applicability",
    content: `This policy applies to all users globally. It covers:

• The Platform: All interactions on https://dagarmy.network and related subdomains.
• DAG Army Services: Rank progression, referral systems, builder communities, bootcamps, and ecosystem tools.
• Support Channels: Any data provided via support@dagarmy.network.`,
  },
  {
    id: "data-collected",
    title: "3. Data We Collect",
    content: `3.1. User-Provided Data
We minimize data collection. We collect only what is necessary to deliver the platform:
• Identity Data: Full name, email address, and country of residence.
• Profile Data: Username, rank (Soldier / Lieutenant), referral code, and profile photo (optional).
• Payment Data: Subscription or upgrade transaction details processed securely via third-party gateways. We do not store card numbers.
• Support Data: Records of correspondence if you contact our support team.

3.2. Automated Technical Data
To ensure platform stability and security, our servers collect:
• Network Identifiers: IP addresses and approximate geolocation.
• Device Metadata: Browser type/version, operating system.
• Interaction Telemetry: Clickstream data, feature usage, session duration, and error logs.`,
  },
  {
    id: "how-we-use",
    title: "4. How We Use Your Data",
    content: `We use your data solely for the following purposes:
• To create and manage your DAG Army account.
• To process rank upgrades, referral rewards, and point transactions.
• To facilitate community features, builder sessions, and ecosystem participation.
• To send transactional emails (account activity, rank changes, reward notifications).
• To detect fraud, abuse, and ensure platform security.
• To improve platform features and user experience.
• To send marketing communications (only with your consent, which you may withdraw at any time).`,
  },
  {
    id: "gdpr",
    title: "5. GDPR Compliance (European Union & EEA)",
    content: `For users residing in the European Economic Area (EEA), we act as the Data Controller.

5.1. Legal Bases for Processing (Article 6 GDPR)
• Contractual Necessity: To provide the DAG Army services you requested.
• Legitimate Interests: To improve platform security, detect fraud, and maintain ecosystem integrity.
• Consent: For marketing communications (which you may withdraw at any time).

5.2. International Data Transfers (Article 46 GDPR)
As DAGChain Network operates internationally, data from EU users may be transferred outside the EEA. We ensure protection by using Standard Contractual Clauses (SCCs) approved by the European Commission and ensuring our infrastructure providers adhere to applicable data privacy frameworks.

5.3. Your Rights Under GDPR
EU users possess the following rights:
1. Right to Access: Request a copy of all data we hold about you.
2. Right to Rectification: Correct inaccurate personal details.
3. Right to Erasure ("Right to be Forgotten"): Request permanent deletion of your account and associated data.
4. Right to Data Portability: Receive your data in a structured, machine-readable format.
5. Right to Object: Object to processing based on our legitimate interests.

To exercise these rights, email: support@dagarmy.network. We will respond within 30 days.`,
  },
  {
    id: "sharing",
    title: "6. Data Sharing and Sub-Processors",
    content: `We do not sell your personal data. We share it only with sub-processors necessary for platform operation:

• Supabase — Database hosting and authentication (USA / Global)
• Stripe / Payment Gateway — Subscription billing and upgrade processing (USA / Global)
• Cloudflare — DDoS protection and CDN (Global)
• Email Service Provider — Transactional and notification emails (Global)

All sub-processors are contractually obligated to handle your data in accordance with applicable privacy laws.`,
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: `We retain data only as long as necessary:
• Active Accounts: Your profile, rank history, and contribution data are retained for the duration of your account.
• Deleted Accounts: Upon account deletion, all personal identifiers are purged within 60 days.
• Financial Records: Transaction data is retained for 7 years to comply with applicable tax and audit regulations.`,
  },
  {
    id: "security",
    title: "8. Security Measures",
    content: `We employ Privacy by Design principles and the following technical safeguards:
• Encryption: All data in transit is protected via TLS 1.3. Data at rest is encrypted using AES-256.
• Access Control: Role-Based Access Control (RBAC) ensures only authorized personnel can access technical systems.
• Authentication: Secure authentication flows with hashed password storage.
• Monitoring: Continuous monitoring for unauthorized access or anomalous activity.`,
  },
  {
    id: "cookies",
    title: "9. Cookies",
    content: `DAG Army uses cookies for essential platform functionality, analytics, and user preferences. For full details, please refer to our Cookies Policy at /cookies-policy.`,
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: `The DAG Army platform is intended for users aged 18 and older. We do not knowingly collect personal data from minors. If we discover a user is under 18, we will terminate the account and delete all associated data immediately. If you believe a minor has registered, please contact us at support@dagarmy.network.`,
  },
  {
    id: "amendments",
    title: "11. Amendments to This Policy",
    content: `We reserve the right to update this policy as regulations and platform features evolve. Significant changes will be communicated via the email address registered to your account at least 14 days before they take effect. Continued use of the platform after changes constitutes acceptance of the revised policy.`,
  },
  {
    id: "contact",
    title: "12. Contact Information",
    content: `For privacy-related inquiries, data requests, or concerns:

QHTECH SOLUTIONS L.L.C FZ
Meydan Grandstand, 6th floor, Meydan Road,
Nad Al Sheba, Dubai, U.A.E.
Email: support@dagarmy.network
Platform: https://dagarmy.network

We are committed to resolving any concerns promptly and transparently.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <div style={{ background: "#fff", minHeight: "100vh" }}>

            {/* Hero */}
            <div style={{ background: "#111", padding: "100px 0 64px" }}>
              <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", padding: "5px 14px",
                  borderRadius: 999, fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)", marginBottom: 24,
                }}>
                  Legal
                </div>
                <h1 style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900,
                  letterSpacing: "-0.04em", lineHeight: 1.1, color: "#fff", marginBottom: 16,
                }}>
                  Privacy Policy
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  Last Updated: March 8, 2026 &nbsp;·&nbsp; Effective Date: March 8, 2026
                  <br />
                  Entity: QHTECH SOLUTIONS L.L.C FZ
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 120px" }}>

              {/* Intro */}
              <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.8, marginBottom: 56, borderLeft: "3px solid #111", paddingLeft: 20 }}>
                DAG Army is a structured AI Startup Ecosystem built for serious builders and founders across South Asia. We take your privacy seriously. This policy explains exactly what data we collect, why we collect it, and how we protect it.
              </p>

              {/* Sections */}
              <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                {sections.map((s) => (
                  <div key={s.id} id={s.id}>
                    <h2 style={{
                      fontSize: "18px", fontWeight: 800, color: "#111",
                      letterSpacing: "-0.02em", marginBottom: 16,
                      paddingBottom: 12, borderBottom: "1px solid #f0f0f0",
                    }}>
                      {s.title}
                    </h2>
                    <p style={{
                      fontSize: "14px", color: "#555", lineHeight: 1.85,
                      whiteSpace: "pre-line",
                    }}>
                      {s.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div style={{
                marginTop: 64, padding: "24px 28px", background: "#fafafa",
                border: "1px solid #f0f0f0", borderRadius: 16,
              }}>
                <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.7, margin: 0 }}>
                  This Privacy Policy is part of our Legal framework alongside our{" "}
                  <a href="/terms-of-service" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Terms of Service</a>{" "}
                  and{" "}
                  <a href="/cookies-policy" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Cookies Policy</a>.
                  If you have any questions, contact us at{" "}
                  <a href="mailto:support@dagarmy.network" style={{ color: "#111", fontWeight: 600 }}>support@dagarmy.network</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    </>
  );
}
