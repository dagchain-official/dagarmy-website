export const nextGenProgram = {
  id: 1,
  title: "The Next-Gen Tech Architect Program",
  subtitle: "One Unified Journey: AI + Blockchain + Data Visualization",
  mission: "Transforming Tier 2/3 Talent into Market-Ready Tech Leaders through Community Service Resources (CSR)",
  totalDuration: "32 Hours",
  format: "8 Integrated Modules (4 Hours per Module)",
  totalModules: 8,
  enrolledStudents: 0,
  rating: 4.9,
  level: "Beginner to Advanced",
  language: "English",
  certificate: true,
  certificateType: "On-Chain (NFT) Verified Credentials",
  
  tracks: [
    { name: "Yellow Track", duration: "2 Weeks (04 Days)", modules: [1, 2] },
    { name: "Green Track", duration: "2 Weeks (04 Days)", modules: [3, 4, 5, 6] },
    { name: "Blue Track", duration: "1 Week (02 Days)", modules: [7, 8] }
  ],

  modules: [
    {
      id: 1,
      number: 1,
      title: "The AI Briefing & Vibe Coding Philosophy",
      duration: "4 Hours",
      track: "Yellow",
      focus: "Understanding the shift from Syntax to Semantics",
      lessons: [
        {
          id: "1.1",
          title: "Theory: The Death of Syntax",
          type: "theory",
          description: "Evolution of programming from Binary to Natural Language. Why 'Vibing' is a technical skill.",
          duration: "1 Hour"
        },
        {
          id: "1.2",
          title: "Theory: LLM Architecture for Non-Coders",
          type: "theory",
          description: "How AI models 'think' and why prompt structure (R.I.P.E.) dictates output quality.",
          duration: "1 Hour"
        },
        {
          id: "1.3",
          title: "The Drill: UI Alchemy",
          type: "drill",
          description: "Utilizing v0.dev and DAGGPT to generate world-class, responsive web interfaces via text.",
          duration: "1 Hour"
        },
        {
          id: "1.4",
          title: "The Drill: Visual Branding",
          type: "drill",
          description: "Creating consistent brand identities using Midjourney Leonardo Ai, Sora and DAGGPT.",
          duration: "1 Hour"
        }
      ]
    },
    {
      id: 2,
      number: 2,
      title: "Full-Stack Product Engineering",
      duration: "4 Hours",
      track: "Yellow",
      focus: "The logic of software and its real-world deployment",
      lessons: [
        {
          id: "2.1",
          title: "Theory: Anatomy of a Web App",
          type: "theory",
          description: "Understanding the relationship between the Client (Frontend), the Server (Logic), and the Database (Memory).",
          duration: "1 Hour"
        },
        {
          id: "2.2",
          title: "The Drill: The Replit Agent Workflow",
          type: "drill",
          description: "Watching an AI manage environment variables, file structures, and cloud hosting.",
          duration: "1 Hour"
        },
        {
          id: "2.3",
          title: "The Drill: Persistence Layer",
          type: "drill",
          description: "Connecting Supabase for user authentication—making your app 'remember' who users are.",
          duration: "1 Hour"
        },
        {
          id: "2.4",
          title: "The Drill: The Live Launch",
          type: "drill",
          description: "Troubleshooting 'Vibe-Logic' errors and deploying to a global URL.",
          duration: "1 Hour"
        }
      ]
    },
    {
      id: 3,
      number: 3,
      title: "Autonomous Systems & Agentic Future",
      duration: "4 Hours",
      track: "Green",
      focus: "Theory of automation and the 'One-Person Agency' model",
      lessons: [
        {
          id: "3.1",
          title: "Theory: The AI Agent Economy",
          type: "theory",
          description: "Moving from 'Chatbots' to 'Autonomous Agents.' Understanding the impact on global labor markets.",
          duration: "1 Hour"
        },
        {
          id: "3.2",
          title: "The Drill: Agentic Workflows",
          type: "drill",
          description: "Building n8n/Zapier loops that connect AI to real-world business tools (Gmail, Slack, Sheets).",
          duration: "1 Hour"
        },
        {
          id: "3.3",
          title: "The Drill: Cinematic Ad Production",
          type: "drill",
          description: "Producing high-end marketing media with Runway Gen-3 and ElevenLabs.",
          duration: "1 Hour"
        },
        {
          id: "3.4",
          title: "Strategy: The Micro-SaaS Blueprint",
          type: "strategy",
          description: "How to identify 'Small Problems' in Tier 2/3 cities and solve them with a 48-hour build.",
          duration: "1 Hour"
        }
      ]
    },
    {
      id: 4,
      number: 4,
      title: "Web3 Mechanics & The Trust Economy",
      duration: "4 Hours",
      track: "Green",
      focus: "Why Blockchain is the foundation of the future Internet",
      lessons: [
        {
          id: "4.1",
          title: "Theory: The Ledger Revolution",
          type: "theory",
          description: "Understanding Decentralization, Consensus Mechanisms (PoW vs. PoS), and why Web3 matters.",
          duration: "1 Hour"
        },
        {
          id: "4.2",
          title: "Theory: The Multi-Chain Map",
          type: "theory",
          description: "Comparing Ecosystems: Ethereum (The Standard), Solana (The Speed), and L2s (The Scalability).",
          duration: "1 Hour"
        },
        {
          id: "4.3",
          title: "The Drill: The Wallet Arsenal",
          type: "drill",
          description: "Advanced custody (Metamask/Phantom) and the logic of Hardware vs. Software wallets.",
          duration: "1 Hour"
        },
        {
          id: "4.4",
          title: "The Drill: On-Chain Forensics",
          type: "drill",
          description: "Using Etherscan and Solscan to verify 'Truth' and detect scams (Rug-pulls/Honey-pots).",
          duration: "1 Hour"
        }
      ]
    },
    {
      id: 5,
      number: 5,
      title: "Smart Contracts, Tokens & Security",
      duration: "4 Hours",
      track: "Green",
      focus: "Creating and securing decentralized value",
      lessons: [
        {
          id: "5.1",
          title: "Theory: The 'Code is Law' Philosophy",
          type: "theory",
          description: "What are Smart Contracts? The logic of self-executing digital agreements.",
          duration: "1 Hour"
        },
        {
          id: "5.2",
          title: "The Drill: Tokenization Mastery",
          type: "drill",
          description: "Minting your first custom Token (ERC-20/SPL) and designing its 'Tokenomics' (Supply/Inflation).",
          duration: "1 Hour"
        },
        {
          id: "5.3",
          title: "The Drill: No-Code Smart Contracts",
          type: "drill",
          description: "Deploying business logic via Thirdweb/OpenZeppelin without writing Solidity.",
          duration: "1 Hour"
        },
        {
          id: "5.4",
          title: "Strategy: Battle-Hardened Security",
          type: "strategy",
          description: "Best practices for building: Auditing contract permissions and protecting project liquidity.",
          duration: "1 Hour"
        }
      ]
    },
    {
      id: 6,
      number: 6,
      title: "Strategic Deployment & Ethical Frontiers",
      duration: "4 Hours",
      track: "Green",
      focus: "Synthesizing the 3 streams into a global career strategy",
      lessons: [
        {
          id: "6.1",
          title: "Theory: The Intersection of AI & Blockchain",
          type: "theory",
          description: "How decentralized compute and AI agents will define the next decade (2026-2036).",
          duration: "1.5 Hours"
        },
        {
          id: "6.2",
          title: "Theory: Ethics & The CSR Mission",
          type: "theory",
          description: "The responsibility of a 'Digital Architect' in an automated world. Data privacy and AI transparency.",
          duration: "1.5 Hours"
        },
        {
          id: "6.3",
          title: "Strategy: Career Narrative & Placement",
          type: "strategy",
          description: "Navigating the 'Experience Gap.' How to present a 32-hour portfolio as proof of professional excellence.",
          duration: "1 Hour"
        }
      ]
    },
    {
      id: 7,
      number: 7,
      title: "Data Engineering & Visual Storytelling",
      duration: "4 Hours",
      track: "Blue",
      focus: "The theory of information hierarchy and Data 'Vibe'",
      lessons: [
        {
          id: "7.1",
          title: "Theory: The Psychology of Data",
          type: "theory",
          description: "Why humans trust visuals over rows. Introduction to UX/UI for Data Visualization.",
          duration: "1 Hour"
        },
        {
          id: "7.2",
          title: "The Drill: The Data Bridge",
          type: "drill",
          description: "Using Power Query to clean and structure messy Excel/CSV files for 'Executive Grade' reports.",
          duration: "1 Hour"
        },
        {
          id: "7.3",
          title: "The Drill: Power BI Artistry",
          type: "drill",
          description: "Designing cinematic, high-contrast dashboards that make complex data instantly readable.",
          duration: "1 Hour"
        },
        {
          id: "7.4",
          title: "The Drill: Interactive Narrative",
          type: "drill",
          description: "Building 'Drill-Down' flows that allow users to explore the 'Why' behind the 'What.'",
          duration: "1 Hour"
        }
      ]
    },
    {
      id: 8,
      number: 8,
      title: "Business Intelligence & Cloud Ecosystems",
      duration: "4 Hours",
      track: "Blue",
      focus: "Building self-sustaining 'War Rooms' for businesses",
      lessons: [
        {
          id: "8.1",
          title: "Theory: The Automated Dashboard Life-Cycle",
          type: "theory",
          description: "Moving from static files to live, cloud-synced intelligence.",
          duration: "0.8 Hours"
        },
        {
          id: "8.2",
          title: "The Drill: The Tableau Narrative",
          type: "drill",
          description: "Building map-based visuals to track global logistics and geographical trends.",
          duration: "0.8 Hours"
        },
        {
          id: "8.3",
          title: "The Drill: Founder 'North Star' Tracking",
          type: "drill",
          description: "Visualizing critical startup metrics: CAC, LTV, Burn Rate, and Churn.",
          duration: "0.8 Hours"
        },
        {
          id: "8.4",
          title: "The Drill: AI-Data Fusion",
          type: "drill",
          description: "Utilizing AI to predict future trends and Power BI to present them to stakeholders.",
          duration: "0.8 Hours"
        },
        {
          id: "8.5",
          title: "Graduation: The Final Briefing",
          type: "graduation",
          description: "Final briefing on the Global Market. Awarding of On-Chain (NFT) Verified Credentials.",
          duration: "0.8 Hours"
        }
      ]
    }
  ],

  glossary: {
    "R.I.P.E.": {
      name: "R.I.P.E. Methodology",
      description: "A structured prompting methodology used in the Next-Gen Tech Architect Program to ensure AI models generate high-quality, bug-free code",
      components: [
        { name: "Role", description: "Assigning a specific persona to the AI (e.g., 'Senior Full-Stack Developer')" },
        { name: "Input", description: "Providing the raw data, context, or specific requirements for the task" },
        { name: "Parameters", description: "Setting constraints such as the tech stack, design style, or performance limits" },
        { name: "Expectation", description: "Defining the exact criteria for a successful and completed output" }
      ]
    }
  },

  outcomes: [
    "Master AI-driven development and prompt engineering",
    "Build full-stack applications with modern frameworks",
    "Understand blockchain fundamentals and Web3 ecosystems",
    "Create and deploy smart contracts and tokens",
    "Design professional data visualizations and dashboards",
    "Develop autonomous AI agent workflows",
    "Receive On-Chain NFT verified credentials"
  ],

  prerequisites: [
    "Basic computer literacy",
    "Willingness to learn and adapt",
    "No prior coding experience required"
  ]
};
