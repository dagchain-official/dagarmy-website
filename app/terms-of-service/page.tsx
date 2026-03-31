"use client";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import "../cookies-policy/policy.css";

const sections = [
  {
    id: "agreement",
    title: "1. Agreement to Terms",
    content: `By accessing or using the DAG Army platform (https://dagarmy.network), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the platform.

These Terms constitute a legally binding agreement between you ("User," "you," or "your") and QHTECH SOLUTIONS L.L.C FZ ("the Company," "we," "us," or "our"), operating the DAG Army platform. We reserve the right to update these Terms at any time, with notice provided via email to your registered address.`,
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: `DAG Army is a structured AI Startup Ecosystem designed to help builders, founders, and contributors across India, Pakistan, and Bangladesh build, launch, and scale AI ventures.

The platform provides:
• Rank-based membership tiers (Soldier, Lieutenant, and above).
• Referral and reward systems based on contribution.
• Community features including builder sessions, idea validation rooms, and peer accountability.
• Bootcamp programs, cohort-based learning, and founder resources.
• A points-based contribution tracking system.`,
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    content: `To use DAG Army, you must:
• Be at least 18 years of age.
• Have the legal capacity to enter into a binding agreement.
• Not be prohibited from using the platform under applicable laws in your jurisdiction.

By registering, you represent and warrant that you meet all eligibility requirements. We reserve the right to terminate accounts that do not comply.`,
  },
  {
    id: "accounts",
    title: "4. User Accounts",
    content: `4.1. Registration
You must register with accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.

4.2. Account Security
You are solely responsible for all activity that occurs under your account. Notify us immediately at support@dagarmy.network if you suspect unauthorized access.

4.3. One Account Per User
Each user may maintain only one active account. Creating duplicate accounts to circumvent restrictions or game referral/reward systems is strictly prohibited and will result in permanent termination.`,
  },
  {
    id: "ranks-rewards",
    title: "5. Ranks, Referrals, and Rewards",
    content: `5.1. Rank System
DAG Army operates a contribution-based rank system. Ranks (Soldier, Lieutenant, and higher) are earned through verified contributions, referrals, and ecosystem participation — not solely through payment.

5.2. Referral Program
The referral program is designed to reward genuine network growth. Any attempt to game, manipulate, or artificially inflate referral counts — including self-referrals, fake accounts, or coordinated abuse — will result in forfeiture of all associated rewards and permanent account suspension.

5.3. Reward Points
Points earned through contributions and referrals hold no monetary value outside the DAG Army platform. We reserve the right to adjust, revoke, or modify point values and reward structures at any time with reasonable notice.

5.4. Upgrades and Payments
Rank upgrades (e.g., Soldier to Lieutenant) may require a one-time fee. All payments are final and non-refundable unless required by applicable consumer protection law. Payment processing is handled by third-party gateways; by completing a transaction, you also agree to their terms.`,
  },
  {
    id: "conduct",
    title: "6. Acceptable Use and Prohibited Conduct",
    content: `You agree not to:
• Use the platform for any unlawful, fraudulent, or abusive purpose.
• Harass, threaten, or harm other community members.
• Post content that is defamatory, obscene, or infringes third-party intellectual property rights.
• Attempt to reverse-engineer, scrape, or exploit the platform's systems or APIs.
• Impersonate DAG Army staff, mentors, or other community members.
• Use automated tools (bots, scripts) to generate fake activity, referrals, or points.
• Share, sell, or transfer your account to another person.

Violation of these rules may result in immediate account suspension or permanent termination without refund.`,
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    content: `7.1. Our Content
All platform content — including the DAG Army brand, logos, course materials, design assets, and software — is the exclusive property of DAGChain Network and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.

7.2. Your Content
You retain ownership of any original content you contribute to the platform (e.g., ideas posted for validation, project descriptions). By submitting content, you grant DAGChain Network a non-exclusive, royalty-free, worldwide license to display and promote that content within the platform ecosystem.`,
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers and Limitation of Liability",
    content: `8.1. No Guarantee of Outcomes
DAG Army provides tools, community, and structure — but we make no guarantees of income, business success, startup outcomes, or employment. Results depend entirely on the effort, skill, and execution of each individual member.

8.2. Platform Availability
We strive for high uptime but do not guarantee uninterrupted access. We are not liable for any losses resulting from temporary platform unavailability.

8.3. Limitation of Liability
To the maximum extent permitted by law, QHTECH SOLUTIONS L.L.C FZ shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the 3 months preceding the claim.`,
  },
  {
    id: "termination",
    title: "9. Termination",
    content: `We reserve the right to suspend or terminate your account at any time for violation of these Terms. You may also delete your account at any time by contacting support@dagarmy.network.

Upon termination:
• Your access to the platform will be revoked immediately.
• Accumulated points and rank status will be forfeited.
• Any pending referral rewards not yet confirmed will be cancelled.
• Data deletion will follow our Privacy Policy retention schedule.`,
  },
  {
    id: "governing-law",
    title: "10. Governing Law and Disputes",
    content: `These Terms are governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of the platform shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration or the appropriate courts of jurisdiction.`,
  },
  {
    id: "amendments",
    title: "11. Amendments",
    content: `We may update these Terms periodically. Material changes will be communicated via email to your registered address at least 14 days before taking effect. Continued use of the platform after the effective date constitutes acceptance of the revised Terms.`,
  },
  {
    id: "contact",
    title: "12. Contact",
    content: `For questions about these Terms:

QHTECH SOLUTIONS L.L.C FZ
Meydan Grandstand, 6th floor, Meydan Road,
Nad Al Sheba, Dubai, U.A.E.
Email: support@dagarmy.network
Platform: https://dagarmy.network`,
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <div style={{ background: "#fff", minHeight: "100vh" }}>

            {/* Hero */}
            <div className="policy-hero" style={{ background: "#111", padding: "100px 0 64px" }}>
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
                  Terms of Service
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
                Please read these Terms carefully before using DAG Army. These Terms govern your access to and use of our platform, community, rank system, referral program, and all associated services.
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
                  These Terms of Service work alongside our{" "}
                  <a href="/privacy-policy" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Privacy Policy</a>{" "}
                  and{" "}
                  <a href="/cookies-policy" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Cookies Policy</a>.
                  Questions? Contact{" "}
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
