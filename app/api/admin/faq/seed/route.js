import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SEED_DATA = [
  {
    label: "About DAGARMY",
    icon_key: "home",
    color_accent: "#2563eb",
    sort_order: 0,
    questions: [
      { sort_order: 0, question: "What is DAGARMY and what does it offer?", answer: "DAG Army is a global community building the infrastructure for a decentralized, AI-powered future. It sits at the intersection of three products: DAG Army (the community movement), DAGGPT (a multi-module AI platform), and DAGChain (an AI-native Layer 1 blockchain). Members learn, build, earn rewards, and participate in a real ecosystem - not just a course platform." },
      { sort_order: 1, question: "Who can join DAGARMY?", answer: "DAGARMY is open to anyone - students, builders, creators, developers, and professionals. There are no credential or experience requirements to join. You start as a DAG Soldier (entry level) and progress through the ranks - DAG Lieutenant, DAG Captain, DAG General - based on your contribution and activity." },
      { sort_order: 2, question: "Is DAGARMY a course platform or a community?", answer: "Neither exclusively. DAGARMY is a collaborative AI founder network designed to turn skill into startups. It combines structured learning (courses in AI, Blockchain, and Data Visualisation), real community building, a referral and rewards system, ambassador opportunities, and the Udaan Initiative. The goal is execution, not just content consumption." },
      { sort_order: 3, question: "What is DAGChain and how is it connected to DAGARMY?", answer: "DAGChain is the AI-native Layer 1 blockchain that underpins the ecosystem. DAGARMY is the community and education arm of DAGChain. Your DAGARMY account is synced with DAGChain, giving you access to validator nodes, storage nodes, and on-chain ecosystem activity as the network grows." },
      { sort_order: 4, question: "What is DAGGPT?", answer: "DAGGPT is the ecosystem's multi-module AI platform - one subscription gives you access to all tools. It is one of the three core products ambassadors represent, alongside DAG Army and DAGChain." },
      { sort_order: 5, question: "What is DAGARMY's vision for 2030?", answer: "By 2030, DAGARMY aims to enable 100,000 AI startup founders across India, Pakistan, and Bangladesh - builders creating products, companies, and economic impact from their cities, towns, and communities. The focus is on turning AI skill into ownership, not just employment." },
      { sort_order: 6, question: "What are the membership ranks inside DAGARMY?", answer: "DAGARMY has four ranks: DAG Soldier (entry point - open network access, weekly sessions, community resources), DAG Lieutenant (Builder Circle - structured mentorship, cohort acceleration, accountability), DAG Captain (proven builder - mentors others, leads initiatives, requires 2+ AI products launched), and DAG General (ecosystem leader - builds sustainable ventures and leads regional chapters)." },
    ],
  },
  {
    label: "Careers",
    icon_key: "briefcase",
    color_accent: "#16a34a",
    sort_order: 1,
    questions: [
      { sort_order: 0, question: "What roles is DAGARMY currently hiring for?", answer: "Current open roles include: Developer Relations Manager (Full-time, India), Developer Relations Manager (Full-time, Southeast Asia), Developer Relations Manager (Full-time, Middle East & Africa), Developer Relations Lead (Full-time, Global), and Sales Intern (Internship, Global). All roles are fully remote." },
      { sort_order: 1, question: "What does a Developer Relations Manager do at DAGARMY?", answer: "DevRel Managers are the bridge between DAGARMY and the Web3 developer community in their region. Responsibilities include building relationships with blockchain developers and universities, creating technical content (tutorials, blog posts, video walkthroughs), representing DAGARMY at meetups and hackathons, onboarding developers onto DAGChain and DAGARMY platforms, and running regional coding challenges." },
      { sort_order: 2, question: "What are the requirements for a Developer Relations role?", answer: "You need 2+ years in developer relations, community management, or software engineering; strong communication skills in English and at least one regional language; hands-on experience with blockchain technology (Ethereum, Solidity, or similar); and an active presence in developer communities on GitHub, X (Twitter), Discord, or Telegram. Regional roles require you to be based in that region." },
      { sort_order: 3, question: "What does the Sales Intern role involve?", answer: "Sales Interns support the growth team with user acquisition and partnerships. Responsibilities include identifying B2B partners and community leads, managing CRM pipelines, creating sales decks and pitch materials, conducting market research on Web3 trends, participating in discovery calls, and preparing weekly reports. The role is remote and globally open." },
      { sort_order: 4, question: "What are the requirements for the Sales Intern role?", answer: "You should be currently enrolled in or recently graduated from a relevant degree program, have strong communication skills, be a self-starter with genuine interest in Web3 or blockchain, and be comfortable working in a fast-paced remote-first environment. Knowledge of CRM tools and an existing network in the Web3 space are a bonus but not required." },
    ],
  },
  {
    label: "Courses",
    icon_key: "book",
    color_accent: "#9333ea",
    sort_order: 2,
    questions: [
      { sort_order: 0, question: "What are the three course streams on DAGARMY?", answer: "DAGARMY currently offers three learning streams: (1) Artificial Intelligence - the 'Vibe Coder' track covering AI tools, no-code SaaS, prompt engineering, generative filmmaking, automation, and more. (2) Blockchain - the 'Web3 Soldier' track covering DeFi, NFTs, smart contracts, DAOs, tokenomics, and blockchain gaming. (3) Data Mastery & Visual Storytelling - covering Power BI, Tableau, Excel dashboards, and data design." },
      { sort_order: 1, question: "Which courses are free and which require DAG Lieutenant access?", answer: "Several courses in each stream are completely free and accessible to all members (DAG Soldier and above), including Vibe Coding 101, The AI Creative Director, Blockchain Foundations, The Crypto Economy, NFT Strategy & Launch, Mastering DeFi, Smart Contract Logic for Non-Coders, and the Excel-to-Dashboard and Power BI courses. Advanced and specialised courses require DAG Lieutenant access." },
      { sort_order: 2, question: "Do I receive a certificate after completing a course?", answer: "Yes. Every DAGARMY course includes a certificate upon completion. Certificates come with Lifetime Access to course materials." },
      { sort_order: 3, question: "How long are the courses?", answer: "Course durations range from 5 to 10 hours depending on the topic and level. Each course is broken into structured lessons - typically 8 to 15 lessons per course. All courses are self-paced so you can progress on your own schedule." },
      { sort_order: 4, question: "What level are the courses aimed at?", answer: "DAGARMY offers courses across three levels: Beginner, Intermediate, and Advanced. Entry-level courses like Vibe Coding 101 and Blockchain Foundations require no prior experience. Intermediate courses build on fundamentals, and advanced courses - such as Tokenomics 101, Custom GPT & Agent Building, and Cyber Security in Web3 - assume solid prior knowledge in the subject area." },
    ],
  },
  {
    label: "Ambassador Program",
    icon_key: "users",
    color_accent: "#ea580c",
    sort_order: 3,
    questions: [
      { sort_order: 0, question: "What is the DAG Army Ambassador Program?", answer: "The Ambassador Program is the official program for creators, educators, and community leaders who want to represent the future of AI and blockchain. Ambassadors create educational content about DAGGPT and DAGChain, share their unique referral link, introduce new users to the ecosystem, support regional community growth, and tag official community pages in their posts." },
      { sort_order: 1, question: "Who can apply to become an ambassador?", answer: "DAGARMY looks for creators with a real, engaged audience on at least one platform. Eligible profiles include: YouTubers (1,000+ subscribers), Instagram Creators (1,000+ followers), Facebook Creators (1,000+ followers), AI Educators (any platform), Blockchain Analysts, Web3 Influencers, Tech Community Leaders (Discord, Telegram), and Regional Creators in all languages. The key requirements are having an active audience, publishing content consistently, and being able to explain AI or blockchain concepts clearly." },
      { sort_order: 2, question: "Is there a joining fee for the Ambassador Program?", answer: "No. Applying and joining is completely free. There is no mandatory investment or payment required to become a DAG Army Ambassador." },
      { sort_order: 3, question: "What are the Ambassador tiers and what do they offer?", answer: "There are three tiers: Silver (1,000+ followers) - standard referral rewards, free DAGGPT access, official ambassador badge, private community access. Gold (50,000+ followers) - enhanced reward rate, performance bonuses, featured website profile, priority support, early ecosystem access. Platinum (100,000+ followers) - custom partnership terms, regional leadership role, revenue-share agreements, direct executive access, co-branded campaigns." },
      { sort_order: 4, question: "What benefits do all ambassadors receive?", answer: "All approved ambassadors receive: free DAGGPT access, referral earnings tied to real ecosystem activity (subscriptions, validator & storage nodes, upgrades), DAG points redeemable for GasCoin, credits, or premium features, an official verified badge, and access to the private ambassador network for collaboration and opportunities." },
      { sort_order: 5, question: "How long does the application review take?", answer: "The team reviews applications personally within 5–10 business days. Shortlisted candidates are contacted directly via email. Applications are for the 2026 cohort and are currently open." },
    ],
  },
  {
    label: "Udaan Initiative",
    icon_key: "layers",
    color_accent: "#0284c7",
    sort_order: 4,
    questions: [
      { sort_order: 0, question: "What is the Udaan Initiative?", answer: "Udaan is DAGARMY's movement to enable 100,000 AI startup founders across India, Pakistan, and Bangladesh by 2030. It is not a course, an institute, or a coaching center - it is a collaborative AI founder network designed to turn skill into startups. The focus is on builders from South Asia's Tier-2 cities, towns, and communities that don't usually make TechCrunch." },
      { sort_order: 1, question: "Who is Udaan designed for?", answer: "Udaan is for founders - not passive learners. It is designed for people who want to build AI startups and need a structured ecosystem around them. The initiative specifically targets talent from India, Pakistan, and Bangladesh who have the ambition to create AI-powered ventures but lack a coordinated support network to turn that skill into ownership." },
      { sort_order: 2, question: "What is the difference between the Open Network and the Builder Circle?", answer: "The Open Network is open to anyone. It provides weekly founder sessions, collaborative problem-solving spaces, idea validation rooms, and peer-driven discussions. There's no gatekeeping - knowledge flows horizontally. The Builder Circle is for those ready to build seriously. It provides structured mentorship, cohort-based acceleration, execution frameworks, demo opportunities, and accountability systems. It exists for founders who are no longer experimenting - they are launching." },
      { sort_order: 3, question: "What does Udaan promise - and what doesn't it promise?", answer: "Udaan does not promise overnight income, does not guarantee outcomes, and does not sell shortcuts. It builds founders who understand leverage, ownership, and disciplined execution. The Founder Pledge captures this: 'I will build. I will support others. I will not wait for opportunity. I will create it.'" },
      { sort_order: 4, question: "How does Udaan differ from other AI education programs?", answer: "Most programs teach AI tools - Udaan focuses on building AI ventures. Most communities reward attendance - Udaan rewards contribution. Most platforms stop at education - Udaan begins at execution. Rank inside the movement is earned through contribution, not payment. Influence is built through action, not noise." },
    ],
  },
  {
    label: "Rewards at DAGARMY",
    icon_key: "award",
    color_accent: "#d97706",
    sort_order: 5,
    questions: [
      { sort_order: 0, question: "What is the DAGARMY rewards philosophy?", answer: "DAGARMY rewards Proof of Work - not Proof of Hype. The system values what you actually contribute, not just when you joined. Points are earned through verified activity: signing up, completing courses, referring members, upgrading your tier, and contributing to the ecosystem." },
      { sort_order: 1, question: "What is the difference between DAG Soldier and DAG Lieutenant?", answer: "DAG Soldier is the entry tier - every new member starts here and receives a 500-point signup bonus with access to the open network, weekly sessions, and community resources. DAG Lieutenant is the Builder Circle tier - it unlocks structured mentorship, cohort acceleration, and accountability systems. Upgrading to Lieutenant requires demonstrating commitment, joining the Builder Circle, and shipping products." },
      { sort_order: 2, question: "How do referral rewards work for Soldiers vs Lieutenants?", answer: "As a DAG Soldier: you earn 500 points when a referred member joins, and an additional 2,500 points if that referral upgrades to Lieutenant. As a DAG Lieutenant: you earn 600 points when a referred member joins (500 base + 20% bonus), and 3,000 points when a referral upgrades to Lieutenant (2,500 base + 20% bonus)." },
      { sort_order: 3, question: "What happens to my points when I upgrade to DAG Lieutenant?", answer: "When you upgrade to DAG Lieutenant, you receive 2,500 base upgrade points plus a 500-point bonus (20% of 2,500), for a total of 3,000 upgrade points on top of your existing balance. Combined with the 500-point signup bonus you already have, a new Lieutenant has a starting total of 3,500 points." },
      { sort_order: 4, question: "What can DAG points be redeemed for?", answer: "DAG points can be redeemed for GasCoin, platform credits, and premium features within the DAGARMY and DAGChain ecosystem. The rewards system is designed around real ecosystem activity - subscriptions, validator nodes, storage nodes, and product upgrades all contribute to and benefit from the points system." },
      { sort_order: 5, question: "How do I track my rewards and referral activity?", answer: "After logging in, your full rewards dashboard shows your current DAG point balance, transaction history (points earned per action), your referral tree showing who you've referred and their activity, your current tier status, and any pending rewards. The system is transparent - every point has a source." },
    ],
  },
];

export async function POST(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Guard: don't seed if data already exists
  const { count } = await supabaseAdmin
    .from('faq_sections')
    .select('*', { count: 'exact', head: true });

  if (count > 0) {
    return NextResponse.json({ error: 'FAQ data already exists. Use the admin panel to edit entries.' }, { status: 409 });
  }

  const results = { sections: 0, questions: 0, errors: [] };

  for (const sec of SEED_DATA) {
    const { questions, ...sectionData } = sec;

    const { data: section, error: secErr } = await supabaseAdmin
      .from('faq_sections')
      .insert(sectionData)
      .select()
      .single();

    if (secErr) {
      results.errors.push(`Section "${sec.label}": ${secErr.message}`);
      continue;
    }

    results.sections++;

    const questionsWithSectionId = questions.map(q => ({ ...q, section_id: section.id }));
    const { error: qErr } = await supabaseAdmin
      .from('faq_questions')
      .insert(questionsWithSectionId);

    if (qErr) {
      results.errors.push(`Questions for "${sec.label}": ${qErr.message}`);
    } else {
      results.questions += questions.length;
    }
  }

  return NextResponse.json({
    success: results.errors.length === 0,
    sections_created: results.sections,
    questions_created: results.questions,
    errors: results.errors,
  });
}
