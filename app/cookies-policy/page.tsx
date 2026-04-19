"use client";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import "./policy.css";

const sections = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content: `Cookies are small text files placed on your device when you visit a website. They allow the site to remember information about your visit - such as your login session, preferences, and how you interact with the platform - making your next visit easier and the platform more useful.

Cookies are widely used across the internet. By using DAG Army (https://dagarmy.network), you consent to our use of cookies as described in this policy.`,
  },
  {
    id: "types",
    title: "2. Types of Cookies We Use",
    content: `2.1. Strictly Necessary Cookies
These cookies are essential for the platform to function. Without them, core services such as authentication, account access, and rank tracking cannot operate.

Examples:
• Session tokens to keep you logged in securely.
• Security cookies to prevent cross-site request forgery (CSRF).
• Load balancing cookies to ensure stable platform performance.

These cookies cannot be disabled without breaking platform functionality.

2.2. Functional Cookies
These cookies remember your preferences and settings to provide a more personalized experience.

Examples:
• Remembering your language or region preference.
• Storing your UI display settings.
• Retaining your last-viewed dashboard section.

2.3. Analytics Cookies
These cookies help us understand how users interact with DAG Army, which features are most used, and where we can improve.

Examples:
• Pages visited and time spent on each section.
• Feature usage patterns (e.g., which community tools are most active).
• Error tracking to identify and fix platform issues.

All analytics data is aggregated and anonymized - it does not identify you personally.

2.4. Marketing and Communication Cookies
These cookies are used to deliver relevant communications and measure the effectiveness of our outreach. They are only activated if you have given explicit consent.

Examples:
• Tracking whether you clicked a link in a DAG Army email.
• Understanding which referral sources drove sign-ups.`,
  },
  {
    id: "third-party",
    title: "3. Third-Party Cookies",
    content: `Some features on DAG Army are powered by third-party services that may set their own cookies. These include:

• Supabase - Authentication and session management.
• Analytics Providers - Aggregated usage analytics (data is anonymized).
• Payment Gateways (e.g., Stripe) - Secure transaction processing. These cookies are governed by Stripe's own privacy and cookie policies.

We do not control third-party cookies. We recommend reviewing the privacy policies of these providers for full details.`,
  },
  {
    id: "duration",
    title: "4. Cookie Duration",
    content: `Cookies on DAG Army are either:

• Session Cookies: Temporary cookies that expire when you close your browser. These are used to maintain your login session and temporary preferences.

• Persistent Cookies: Cookies that remain on your device for a set period (typically 30–365 days) to remember your preferences across sessions. You can delete these at any time via your browser settings.`,
  },
  {
    id: "managing",
    title: "5. Managing and Disabling Cookies",
    content: `You have full control over cookies through your browser settings. Most browsers allow you to:
• View cookies currently stored on your device.
• Delete individual or all cookies.
• Block cookies from specific websites.
• Set preferences for future cookie handling.

How to manage cookies in popular browsers:
• Google Chrome: Settings → Privacy and Security → Cookies and other site data.
• Mozilla Firefox: Settings → Privacy & Security → Cookies and Site Data.
• Safari: Preferences → Privacy → Manage Website Data.
• Microsoft Edge: Settings → Privacy, search, and services → Cookies.

Please note: Disabling strictly necessary cookies will impair or prevent access to core DAG Army features, including login and rank tracking.`,
  },
  {
    id: "consent",
    title: "6. Your Consent",
    content: `When you first visit DAG Army, you will be presented with a cookie consent notice. By continuing to use the platform after dismissing this notice, you consent to the use of cookies as described in this policy.

You may withdraw consent for non-essential cookies at any time by adjusting your browser settings or contacting us at support@dagarmy.network. Withdrawal of consent does not affect the lawfulness of cookie use prior to withdrawal.`,
  },
  {
    id: "updates",
    title: "7. Updates to This Policy",
    content: `We may update this Cookies Policy from time to time as our platform evolves or as regulations change. The "Last Updated" date at the top of this page reflects when the most recent changes were made. Significant updates will be communicated via email to your registered account address.`,
  },
  {
    id: "contact",
    title: "8. Contact",
    content: `For questions about our use of cookies or to exercise your rights:

QHTECH SOLUTIONS L.L.C FZ
Meydan Grandstand, 6th floor, Meydan Road,
Nad Al Sheba, Dubai, U.A.E.
Email: support@dagarmy.network
Platform: https://dagarmy.network`,
  },
];

export default function CookiesPolicyPage() {
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
                  Cookies Policy
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
                This Cookies Policy explains what cookies are, which cookies DAG Army uses, why we use them, and how you can control them. We are committed to transparency about how we collect and use data related to your browsing experience.
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

              {/* Cookie summary table */}
              <div style={{ marginTop: 56 }}>
                <h2 style={{
                  fontSize: "18px", fontWeight: 800, color: "#111",
                  letterSpacing: "-0.02em", marginBottom: 20,
                  paddingBottom: 12, borderBottom: "1px solid #f0f0f0",
                }}>
                  Cookie Summary
                </h2>
                <div style={{ borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                  {[
                    { type: "Strictly Necessary", purpose: "Authentication, security, session management", canDisable: "No" },
                    { type: "Functional", purpose: "User preferences, UI settings, region", canDisable: "Yes" },
                    { type: "Analytics", purpose: "Aggregated usage data, error tracking", canDisable: "Yes" },
                    { type: "Marketing", purpose: "Communication tracking (consent-based only)", canDisable: "Yes" },
                  ].map((row, i) => (
                    <div key={row.type} className="cookie-table-row" style={{
                      display: "grid", gridTemplateColumns: "1.2fr 2fr 0.7fr",
                      borderBottom: i < 3 ? "1px solid #f0f0f0" : "none",
                      background: i % 2 === 0 ? "#fafafa" : "#fff",
                    }}>
                      <div style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 700, color: "#111" }}>{row.type}</div>
                      <div style={{ padding: "14px 16px", fontSize: "13px", color: "#555", borderLeft: "1px solid #f0f0f0" }}>{row.purpose}</div>
                      <div style={{
                        padding: "14px 16px", fontSize: "12px", fontWeight: 700,
                        color: row.canDisable === "No" ? "#ef4444" : "#10b981",
                        borderLeft: "1px solid #f0f0f0", textAlign: "center",
                      }}>
                        {row.canDisable === "No" ? "Required" : "Optional"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer note */}
              <div style={{
                marginTop: 64, padding: "24px 28px", background: "#fafafa",
                border: "1px solid #f0f0f0", borderRadius: 16,
              }}>
                <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.7, margin: 0 }}>
                  This Cookies Policy is part of our legal framework alongside our{" "}
                  <a href="/privacy-policy" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Privacy Policy</a>{" "}
                  and{" "}
                  <a href="/terms-of-service" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Terms of Service</a>.
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
