"use client";
import React, { useState } from "react";
import Link from "next/link";

const FAQ_SECTIONS = [
  {
    id: "about",
    label: "About DAGARMY",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    color: { bg: "#eff6ff", accent: "#2563eb", border: "#bfdbfe", light: "#dbeafe" },
    faqs: [
      {
        q: "What is DAGARMY and what does it offer?",
        a: "DAG Army is a global community building the infrastructure for a decentralized, AI-powered future. It sits at the intersection of three products: DAG Army (the community movement), DAGGPT (a multi-module AI platform), and DAGChain (an AI-native Layer 1 blockchain). Members learn, build, earn rewards, and participate in a real ecosystem — not just a course platform."
      },
      {
        q: "Who can join DAGARMY?",
        a: "DAGARMY is open to anyone — students, builders, creators, developers, and professionals. There are no credential or experience requirements to join. You start as a DAG Soldier (entry level) and progress through the ranks — DAG Lieutenant, DAG Captain, DAG General — based on your contribution and activity."
      },
      {
        q: "Is DAGARMY a course platform or a community?",
        a: "Neither exclusively. DAGARMY is a collaborative AI founder network designed to turn skill into startups. It combines structured learning (courses in AI, Blockchain, and Data Visualisation), real community building, a referral and rewards system, ambassador opportunities, and the Udaan Initiative. The goal is execution, not just content consumption."
      },
      {
        q: "What is DAGChain and how is it connected to DAGARMY?",
        a: "DAGChain is the AI-native Layer 1 blockchain that underpins the ecosystem. DAGARMY is the community and education arm of DAGChain. Your DAGARMY account is synced with DAGChain, giving you access to validator nodes, storage nodes, and on-chain ecosystem activity as the network grows."
      },
      {
        q: "What is DAGGPT?",
        a: "DAGGPT is the ecosystem's multi-module AI platform — one subscription gives you access to all tools. It is one of the three core products ambassadors represent, alongside DAG Army and DAGChain."
      },
      {
        q: "What is DAGARMY's vision for 2030?",
        a: "By 2030, DAGARMY aims to enable 100,000 AI startup founders across India, Pakistan, and Bangladesh — builders creating products, companies, and economic impact from their cities, towns, and communities. The focus is on turning AI skill into ownership, not just employment."
      },
      {
        q: "What are the membership ranks inside DAGARMY?",
        a: "DAGARMY has four ranks: DAG Soldier (entry point — open network access, weekly sessions, community resources), DAG Lieutenant (Builder Circle — structured mentorship, cohort acceleration, accountability), DAG Captain (proven builder — mentors others, leads initiatives, requires 2+ AI products launched), and DAG General (ecosystem leader — builds sustainable ventures and leads regional chapters)."
      }
    ]
  },
  {
    id: "careers",
    label: "Careers",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    color: { bg: "#f0fdf4", accent: "#16a34a", border: "#bbf7d0", light: "#dcfce7" },
    faqs: [
      {
        q: "What roles is DAGARMY currently hiring for?",
        a: "Current open roles include: Developer Relations Manager (Full-time, India), Developer Relations Manager (Full-time, Southeast Asia), Developer Relations Manager (Full-time, Middle East & Africa), Developer Relations Lead (Full-time, Global), and Sales Intern (Internship, Global). All roles are fully remote."
      },
      {
        q: "What does a Developer Relations Manager do at DAGARMY?",
        a: "DevRel Managers are the bridge between DAGARMY and the Web3 developer community in their region. Responsibilities include building relationships with blockchain developers and universities, creating technical content (tutorials, blog posts, video walkthroughs), representing DAGARMY at meetups and hackathons, onboarding developers onto DAGChain and DAGARMY platforms, and running regional coding challenges."
      },
      {
        q: "What are the requirements for a Developer Relations role?",
        a: "You need 2+ years in developer relations, community management, or software engineering; strong communication skills in English and at least one regional language; hands-on experience with blockchain technology (Ethereum, Solidity, or similar); and an active presence in developer communities on GitHub, X (Twitter), Discord, or Telegram. Regional roles require you to be based in that region."
      },
      {
        q: "What does the Sales Intern role involve?",
        a: "Sales Interns support the growth team with user acquisition and partnerships. Responsibilities include identifying B2B partners and community leads, managing CRM pipelines, creating sales decks and pitch materials, conducting market research on Web3 trends, participating in discovery calls, and preparing weekly reports. The role is remote and globally open."
      },
      {
        q: "What are the requirements for the Sales Intern role?",
        a: "You should be currently enrolled in or recently graduated from a relevant degree program, have strong communication skills, be a self-starter with genuine interest in Web3 or blockchain, and be comfortable working in a fast-paced remote-first environment. Knowledge of CRM tools and an existing network in the Web3 space are a bonus but not required."
      }
    ]
  },
  {
    id: "courses",
    label: "Courses",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    color: { bg: "#fdf4ff", accent: "#9333ea", border: "#e9d5ff", light: "#f3e8ff" },
    faqs: [
      {
        q: "What are the three course streams on DAGARMY?",
        a: "DAGARMY currently offers three learning streams: (1) Artificial Intelligence — the 'Vibe Coder' track covering AI tools, no-code SaaS, prompt engineering, generative filmmaking, automation, and more. (2) Blockchain — the 'Web3 Soldier' track covering DeFi, NFTs, smart contracts, DAOs, tokenomics, and blockchain gaming. (3) Data Mastery & Visual Storytelling — covering Power BI, Tableau, Excel dashboards, and data design."
      },
      {
        q: "Which courses are free and which require DAG Lieutenant access?",
        a: "Several courses in each stream are completely free and accessible to all members (DAG Soldier and above), including Vibe Coding 101, The AI Creative Director, Blockchain Foundations, The Crypto Economy, NFT Strategy & Launch, Mastering DeFi, Smart Contract Logic for Non-Coders, and the Excel-to-Dashboard and Power BI courses. Advanced and specialised courses require DAG Lieutenant access."
      },
      {
        q: "Do I receive a certificate after completing a course?",
        a: "Yes. Every DAGARMY course includes a certificate upon completion. Certificates come with Lifetime Access to course materials."
      },
      {
        q: "How long are the courses?",
        a: "Course durations range from 5 to 10 hours depending on the topic and level. Each course is broken into structured lessons — typically 8 to 15 lessons per course. All courses are self-paced so you can progress on your own schedule."
      },
      {
        q: "What level are the courses aimed at?",
        a: "DAGARMY offers courses across three levels: Beginner, Intermediate, and Advanced. Entry-level courses like Vibe Coding 101 and Blockchain Foundations require no prior experience. Intermediate courses build on fundamentals, and advanced courses — such as Tokenomics 101, Custom GPT & Agent Building, and Cyber Security in Web3 — assume solid prior knowledge in the subject area."
      }
    ]
  },
  {
    id: "ambassador",
    label: "Ambassador Program",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: { bg: "#fff7ed", accent: "#ea580c", border: "#fed7aa", light: "#ffedd5" },
    faqs: [
      {
        q: "What is the DAG Army Ambassador Program?",
        a: "The Ambassador Program is the official program for creators, educators, and community leaders who want to represent the future of AI and blockchain. Ambassadors create educational content about DAGGPT and DAGChain, share their unique referral link, introduce new users to the ecosystem, support regional community growth, and tag official community pages in their posts."
      },
      {
        q: "Who can apply to become an ambassador?",
        a: "DAGARMY looks for creators with a real, engaged audience on at least one platform. Eligible profiles include: YouTubers (1,000+ subscribers), Instagram Creators (1,000+ followers), Facebook Creators (1,000+ followers), AI Educators (any platform), Blockchain Analysts, Web3 Influencers, Tech Community Leaders (Discord, Telegram), and Regional Creators in all languages. The key requirements are having an active audience, publishing content consistently, and being able to explain AI or blockchain concepts clearly."
      },
      {
        q: "Is there a joining fee for the Ambassador Program?",
        a: "No. Applying and joining is completely free. There is no mandatory investment or payment required to become a DAG Army Ambassador."
      },
      {
        q: "What are the Ambassador tiers and what do they offer?",
        a: "There are three tiers: Silver (1,000+ followers) — standard referral rewards, free DAGGPT access, official ambassador badge, private community access. Gold (50,000+ followers) — enhanced reward rate, performance bonuses, featured website profile, priority support, early ecosystem access. Platinum (100,000+ followers) — custom partnership terms, regional leadership role, revenue-share agreements, direct executive access, co-branded campaigns."
      },
      {
        q: "What benefits do all ambassadors receive?",
        a: "All approved ambassadors receive: free DAGGPT access, referral earnings tied to real ecosystem activity (subscriptions, validator & storage nodes, upgrades), DAG points redeemable for GasCoin, credits, or premium features, an official verified badge, and access to the private ambassador network for collaboration and opportunities."
      },
      {
        q: "How long does the application review take?",
        a: "The team reviews applications personally within 5–10 business days. Shortlisted candidates are contacted directly via email. Applications are for the 2026 cohort and are currently open."
      }
    ]
  },
  {
    id: "udaan",
    label: "Udaan Initiative",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    color: { bg: "#f0f9ff", accent: "#0284c7", border: "#bae6fd", light: "#e0f2fe" },
    faqs: [
      {
        q: "What is the Udaan Initiative?",
        a: "Udaan is DAGARMY's movement to enable 100,000 AI startup founders across India, Pakistan, and Bangladesh by 2030. It is not a course, an institute, or a coaching center — it is a collaborative AI founder network designed to turn skill into startups. The focus is on builders from South Asia's Tier-2 cities, towns, and communities that don't usually make TechCrunch."
      },
      {
        q: "Who is Udaan designed for?",
        a: "Udaan is for founders — not passive learners. It is designed for people who want to build AI startups and need a structured ecosystem around them. The initiative specifically targets talent from India, Pakistan, and Bangladesh who have the ambition to create AI-powered ventures but lack a coordinated support network to turn that skill into ownership."
      },
      {
        q: "What is the difference between the Open Network and the Builder Circle?",
        a: "The Open Network is open to anyone. It provides weekly founder sessions, collaborative problem-solving spaces, idea validation rooms, and peer-driven discussions. There's no gatekeeping — knowledge flows horizontally. The Builder Circle is for those ready to build seriously. It provides structured mentorship, cohort-based acceleration, execution frameworks, demo opportunities, and accountability systems. It exists for founders who are no longer experimenting — they are launching."
      },
      {
        q: "What does Udaan promise — and what doesn't it promise?",
        a: "Udaan does not promise overnight income, does not guarantee outcomes, and does not sell shortcuts. It builds founders who understand leverage, ownership, and disciplined execution. The Founder Pledge captures this: 'I will build. I will support others. I will not wait for opportunity. I will create it.'"
      },
      {
        q: "How does Udaan differ from other AI education programs?",
        a: "Most programs teach AI tools — Udaan focuses on building AI ventures. Most communities reward attendance — Udaan rewards contribution. Most platforms stop at education — Udaan begins at execution. Rank inside the movement is earned through contribution, not payment. Influence is built through action, not noise."
      }
    ]
  },
  {
    id: "rewards",
    label: "Rewards at DAGARMY",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    color: { bg: "#fffbeb", accent: "#d97706", border: "#fde68a", light: "#fef3c7" },
    faqs: [
      {
        q: "What is the DAGARMY rewards philosophy?",
        a: "DAGARMY rewards Proof of Work — not Proof of Hype. The system values what you actually contribute, not just when you joined. Points are earned through verified activity: signing up, completing courses, referring members, upgrading your tier, and contributing to the ecosystem."
      },
      {
        q: "What is the difference between DAG Soldier and DAG Lieutenant?",
        a: "DAG Soldier is the entry tier — every new member starts here and receives a 500-point signup bonus with access to the open network, weekly sessions, and community resources. DAG Lieutenant is the Builder Circle tier — it unlocks structured mentorship, cohort acceleration, and accountability systems. Upgrading to Lieutenant requires demonstrating commitment, joining the Builder Circle, and shipping products."
      },
      {
        q: "How do referral rewards work for Soldiers vs Lieutenants?",
        a: "As a DAG Soldier: you earn 500 points when a referred member joins, and an additional 2,500 points if that referral upgrades to Lieutenant. As a DAG Lieutenant: you earn 600 points when a referred member joins (500 base + 20% bonus), and 3,000 points when a referral upgrades to Lieutenant (2,500 base + 20% bonus)."
      },
      {
        q: "What happens to my points when I upgrade to DAG Lieutenant?",
        a: "When you upgrade to DAG Lieutenant, you receive 2,500 base upgrade points plus a 500-point bonus (20% of 2,500), for a total of 3,000 upgrade points on top of your existing balance. Combined with the 500-point signup bonus you already have, a new Lieutenant has a starting total of 3,500 points."
      },
      {
        q: "What can DAG points be redeemed for?",
        a: "DAG points can be redeemed for GasCoin, platform credits, and premium features within the DAGARMY and DAGChain ecosystem. The rewards system is designed around real ecosystem activity — subscriptions, validator nodes, storage nodes, and product upgrades all contribute to and benefit from the points system."
      },
      {
        q: "How do I track my rewards and referral activity?",
        a: "After logging in, your full rewards dashboard shows your current DAG point balance, transaction history (points earned per action), your referral tree showing who you've referred and their activity, your current tier status, and any pending rewards. The system is transparent — every point has a source."
      }
    ]
  }
];

function ChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function FAQItem({ q, a, isOpen, onToggle, accent }) {
  return (
    <div
      onClick={onToggle}
      style={{
        borderRadius: '12px',
        border: isOpen ? `1.5px solid ${accent}40` : '1.5px solid #e5e7eb',
        background: isOpen ? '#fff' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
        boxShadow: isOpen ? `0 4px 24px ${accent}18` : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '20px 24px',
        userSelect: 'none',
      }}>
        <span style={{
          fontSize: '15px',
          fontWeight: '600',
          color: isOpen ? '#111827' : '#374151',
          lineHeight: '1.5',
          flex: 1,
        }}>{q}</span>
        <span style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isOpen ? accent : '#f3f4f6',
          color: isOpen ? '#fff' : '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <ChevronDown />
        </span>
      </div>
      {isOpen && (
        <div style={{
          padding: '0 24px 22px 24px',
        }}>
          <div style={{
            width: '40px',
            height: '2px',
            background: `${accent}50`,
            borderRadius: '2px',
            marginBottom: '14px',
          }} />
          <p style={{
            fontSize: '14.5px',
            color: '#4b5563',
            lineHeight: '1.75',
            margin: 0,
          }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState("about");
  const [openIndex, setOpenIndex] = useState(0);

  const currentSection = FAQ_SECTIONS.find(s => s.id === activeSection);

  const handleSectionChange = (id) => {
    setActiveSection(id);
    setOpenIndex(0);
  };

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: 'clamp(72px, 10vw, 120px) 24px clamp(48px, 7vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative background blobs */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', left: '-40px',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)',
          }} />
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ color: '#93c5fd', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>
              HELP &amp; SUPPORT
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: '800',
            color: '#fff',
            lineHeight: '1.15',
            margin: '0 0 20px',
            letterSpacing: '-0.5px',
          }}>
            Frequently Asked <span style={{
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Questions</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: '#94a3b8',
            lineHeight: '1.7',
            maxWidth: '560px',
            margin: '0 auto 32px',
          }}>
            Everything you need to know about DAGARMY — from courses and careers to rewards and the Udaan initiative.
          </p>

          {/* Search hint */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px', padding: '10px 20px',
            color: '#64748b', fontSize: '14px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Browse by section below or{' '}
            <Link href="/blog" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '600' }}>visit our blog</Link>
            {' '}for detailed guides
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 64px) 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 280px) 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Sidebar nav */}
          <aside style={{
            position: 'sticky',
            top: '100px',
          }}>
            <p style={{
              fontSize: '11px', fontWeight: '700', letterSpacing: '1.2px',
              color: '#9ca3af', textTransform: 'uppercase',
              margin: '0 0 12px 4px',
            }}>SECTIONS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {FAQ_SECTIONS.map((section) => {
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.2s ease',
                      background: active ? section.color.bg : 'transparent',
                      color: active ? section.color.accent : '#374151',
                      fontWeight: active ? '700' : '500',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  >
                    <span style={{
                      color: active ? section.color.accent : '#9ca3af',
                      flexShrink: 0,
                      transition: 'color 0.2s ease',
                    }}>
                      {section.icon}
                    </span>
                    {section.label}
                    {active && (
                      <span style={{
                        marginLeft: 'auto',
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: section.color.accent, flexShrink: 0,
                      }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Still have questions */}
            <div style={{
              marginTop: '28px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: '#fff',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(96,165,250,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 6px', color: '#fff' }}>
                Still have questions?
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px', lineHeight: '1.6' }}>
                Can't find the answer you're looking for? Reach out to our team.
              </p>
              <a
                href="mailto:support@dagchain.network"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#2563eb', color: '#fff',
                  borderRadius: '8px', padding: '9px 16px',
                  fontSize: '13px', fontWeight: '600',
                  textDecoration: 'none', transition: 'background 0.2s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact Support
              </a>
            </div>
          </aside>

          {/* FAQ panel */}
          <div>
            {/* Section header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              marginBottom: '28px',
              padding: '20px 24px',
              background: currentSection.color.bg,
              borderRadius: '14px',
              border: `1.5px solid ${currentSection.color.border}`,
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: currentSection.color.light,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: currentSection.color.accent, flexShrink: 0,
              }}>
                {currentSection.icon}
              </div>
              <div>
                <h2 style={{
                  fontSize: '18px', fontWeight: '800', color: '#111827',
                  margin: '0 0 2px',
                }}>{currentSection.label}</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                  {currentSection.faqs.length} frequently asked questions
                </p>
              </div>
            </div>

            {/* FAQ list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentSection.faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  accent={currentSection.color.accent}
                />
              ))}
            </div>

            {/* All sections quick nav */}
            <div style={{
              marginTop: '48px',
              padding: '28px',
              background: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #e5e7eb',
            }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Explore other sections
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {FAQ_SECTIONS.filter(s => s.id !== activeSection).map(section => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '8px 14px', borderRadius: '8px',
                      border: `1.5px solid ${section.color.border}`,
                      background: section.color.bg,
                      color: section.color.accent,
                      fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .faq-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
