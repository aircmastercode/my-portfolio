// Single source of truth for the portfolio content AND the AI agent's knowledge.
// Every visible section and the AI persona are derived from this file.

export const profile = {
  name: "Tanush Singhal",
  initials: "TS",
  roleLine: "Backend & AI Engineer",
  tagline: "Build products, then prove they worked — with real numbers.",
  triple: ["Builder", "Measurer", "Finisher"],
  location: "Ghaziabad, India",
  availability: "Open to SDE / AI engineering internships · willing to relocate",
  email: "its.tanush.hq@gmail.com",
  phone: "+91-9650350920",
  resumeUrl: "/resume.pdf",
  calLink: process.env.NEXT_PUBLIC_CAL_LINK || "tanushsinghal/30min",
  socials: {
    linkedin: "https://www.linkedin.com/in/tanushsinghal/",
    github: "https://github.com/aircmastercode",
    medium: "https://medium.com/@tanushsinghal22082004",
  },

  // Handles for the coding activity heatmap (edit if yours differ).
  codingPlatforms: {
    github: "aircmastercode",
    leetcode: "aircmastercode",
    codeforces: "aircmastercode42",
  },

  intro:
    "Computer Science undergraduate and backend-leaning software engineer who delivers end-to-end. Two engineering internships (USA + Indian Railways) building scalable services on AWS and PostgreSQL, plus a 1st-place hackathon win out of 50+ teams. The focus: production-quality, tested code — then proof it worked with real numbers.",

  about: {
    headline: "Closing the loop between building and measuring.",
    paragraphs: [
      "A builder who finishes. In every project, the interesting part is the decisions — what to build, what to cut, and how to measure whether it moved the needle. Engineering is the unfair advantage; instrumentation is what stands out.",
      "Across two internships and a hackathon win: event-driven services, 40+ REST APIs, a serverless voice assistant, and a published benchmark study. Impact isn't claimed — it's instrumented, defended with numbers, and written about in public.",
      "Currently a remote Software Engineering Intern at Software Tree (USA), building a 24/7 inventory-monitoring agent on a JSON-RPC backend, while studying CS at BITS Pilani and Data Science at IIT Madras simultaneously.",
    ],
    funFacts: [
      "Published a 33-minute benchmark essay on the hidden cost of AI database access.",
      "Audited the railway system like a stranger would — the proudest feature turned out to be the biggest bottleneck.",
      "Removed the LLM from the monitoring loop after measuring that arithmetic beat aesthetics.",
    ],
  },

  education: [
    {
      school: "BITS Pilani — Pilani Campus",
      degree: "B.E. Computer Science Engineering",
      period: "2023 — 2027",
      note: "ID: 2023A7PS0586P",
    },
    {
      school: "IIT Madras",
      degree: "B.S. Data Science & Applications (Online)",
      period: "2023 — 2027",
      note: "Pursued simultaneously with BITS",
    },
  ],

  experience: [
    {
      company: "Software Tree, LLC",
      location: "USA · Remote",
      role: "Software Engineering Intern",
      period: "Oct 2025 — Present",
      stack: ["Python", "LangChain", "LangGraph", "PostgreSQL", "JSON-RPC", "Docker"],
      highlights: [
        "Owned end-to-end design of a 24/7 inventory-monitoring service — an event-driven agent over a JSON-RPC backend that auto-detects low-stock items, computes reorder quantity, and dispatches alerts, replacing manual stock checks.",
        "Designed and ran a 20-session controlled benchmark across 4 tasks on GPT-5.4 + Claude-4.6, instrumenting tokens, cost and latency, and cut token (compute) cost by up to 58% for graph-shaped workloads.",
        "Built a reusable Python JSON-RPC client with Server-Sent Events streaming and session handling, giving the team typed, schema-safe data access in place of raw SQL.",
        "Raised release quality across 9 release iterations on live PostgreSQL / Oracle / MySQL / H2; root-caused a reproducible defect with a workaround and surfaced 2 JDBC blockers.",
      ],
    },
    {
      company: "Centre for Railway Information Systems (CRIS)",
      location: "India",
      role: "Software Development Intern",
      period: "May 2025 — Jul 2025",
      stack: ["Node.js", "Express", "Sequelize", "SQLite", "JWT", "Docker Compose", "React"],
      highlights: [
        "Designed and shipped a full-stack Parcel Management System end-to-end: 40+ REST APIs across 6 modules over a 5-table relational schema, JWT role-based access for 3 roles, and Docker Compose deployment with durable volumes.",
        "Engineered password-less OTP login with a 3-tier email failover (Gmail → Postmark → RapidAPI) that keeps authentication working when any single provider fails, plus a network-wide audit log.",
      ],
    },
  ],

  projects: [
    {
      id: "voice-ai",
      title: "P2P Lending Voice AI Assistant",
      badge: "1st of 50+ Teams",
      period: "Jun 2025",
      summary:
        "Led a 4-member team to a 1st-place win at the LenDenClub FinTech hackathon: a serverless, event-driven voice assistant that replaces a lender's first sales conversation.",
      stack: ["AWS Lambda", "API Gateway WebSocket", "Bedrock", "ElevenLabs", "RAG"],
      bullets: [
        "Architected API Gateway WebSocket → Lambda → Bedrock Claude with retrieval-grounded answers and token streaming for sub-second replies.",
        "Tested robotic vs human voice with 5 users at the venue — 5/5 chose natural; shipped ElevenLabs with a static fallback so the live demo couldn't break.",
        "Delivered a working live demo in a 48-hour sprint, winning 1st place out of 50+ teams.",
      ],
      principle:
        "The right unit is cost per convinced customer, not cost per minute.",
      links: {},
    },
    {
      id: "watchdog",
      title: "Inventory Watchdog Agent",
      badge: "Production · Software Tree",
      period: "Oct 2025 — Present",
      summary:
        "A 24/7 agent that detects low-stock SKUs, computes reorder quantity, and emails HTML alerts to admins and suppliers — with no spec given, so the success metrics were defined from scratch.",
      stack: ["Python", "LangGraph", "ReAct", "PostgreSQL", "JSON-RPC"],
      bullets: [
        "Defined the success metrics (alert threshold, monitoring interval, delivery reliability) with no brief.",
        "Removed the LLM from the continuous monitoring loop after measuring per-check cost and latency — kept deterministic SQL in the loop, LLM only on demand.",
        "Published the decision rubric as a Medium article with a companion YouTube + podcast walkthrough.",
      ],
      principle:
        "Rules where you need vigilance, AI where you need judgment — decide by arithmetic, not aesthetics.",
      links: {},
    },
    {
      id: "parcel",
      title: "Railway Parcel Management System",
      badge: "CRIS · Indian Railways",
      period: "May 2025 — Jul 2025",
      summary:
        "Replaced a paper-based, 30–45-minute booking process with a full-stack system — then capacity-planned it for the real 7,000+ station network and audited the design for scale.",
      stack: ["React 18", "Express", "Sequelize", "SQLite", "JWT", "Docker"],
      bullets: [
        "Built end-to-end: 40+ REST endpoints, 5-table schema, OTP login with 3-provider fallback, QR-based public tracking with safe field projection.",
        "Capacity-planned for 7,000+ stations / 1.2M tons/yr (~100 event-writes/sec peak).",
        "Found the proudest feature — broadcasting every update to every station — would be the biggest bottleneck (~3B rows/day); redesigned it as an append-only event log with targeted routing.",
      ],
      principle:
        "Ask what breaks at 100× before shipping — and audit your own work like a stranger would.",
      links: {},
    },
    {
      id: "fraud",
      title: "AI Interview Integrity & Fraud Detection",
      badge: "APOGEE 2026",
      period: "Apr 2026",
      summary:
        "A recruiter-facing system that flags interview fraud but never auto-rejects — every flagged person is owed a reason.",
      stack: ["Python", "FastAPI", "SQLite", "scikit-learn", "Streamlit"],
      bullets: [
        "FastAPI backend with 30+ endpoints, 5 SQLite tables and HMAC-verified webhooks.",
        "Hybrid explainable scoring: linguistic (TF-IDF drift, readability) + behavioral (latency, WPM) fused with experience-calibrated thresholds.",
        "Deterministic flags are merged into Claude's final JSON report by construction, so the LLM can't silently drop a triggered signal.",
      ],
      principle:
        "When a false positive costs a career, AI advises and humans decide.",
      links: {},
    },
  ],

  skills: [
    {
      group: "Languages",
      items: ["Python", "Java", "C/C++", "SQL", "JavaScript", "TypeScript", "Bash"],
    },
    {
      group: "Backend & Systems",
      items: [
        "System Design",
        "Distributed Systems",
        "Microservices",
        "REST / WebSocket",
        "FastAPI",
        "Node / Express",
        "Concurrency",
        "DSA",
      ],
    },
    {
      group: "Data & AI",
      items: [
        "LLMs",
        "LangChain / LangGraph",
        "ReAct Agents",
        "RAG",
        "MCP",
        "Prompt Engineering",
        "LLM Evaluation",
        "scikit-learn",
        "pandas",
      ],
    },
    {
      group: "Cloud & Tooling",
      items: ["AWS (Lambda, API Gateway, Bedrock, S3)", "PostgreSQL", "Docker", "Git/CI-CD", "Linux"],
    },
  ],

  writing: [
    {
      title: "The Hidden Tax of AI Database Access",
      blurb: "A 33-minute benchmark essay on token cost across MCP database tools.",
      tag: "Benchmark · Apr 2026",
      href: "https://medium.com/@tanushsinghal22082004",
    },
    {
      title: "Building an AI-Powered Inventory Watchdog",
      blurb: "Why the LLM left the monitoring loop — a decision rubric.",
      tag: "Architecture · Nov 2025",
      href: "https://medium.com/@tanushsinghal22082004",
    },
  ],

  achievements: [
    "1st Place / 50+ Teams — Matrix Protocol AI Hackathon (LenDenClub, FinTech).",
    "Technical Author on Medium — 2 long-form engineering essays with YouTube + podcast walkthroughs.",
    "Shipped production code across two internships (USA + Indian Railways).",
  ],

  // A short editorial "by the numbers" band.
  stats: [
    { value: "1st", label: "of 50+ teams", sub: "FinTech hackathon" },
    { value: "40+", label: "REST APIs", sub: "shipped end-to-end" },
    { value: "58%", label: "token cost cut", sub: "graph workloads" },
    { value: "2", label: "internships", sub: "USA + Indian Railways" },
  ],

  // The "how I think" statement + decision principles (classic editorial pull-quotes).
  approach: {
    manifesto:
      "Ambiguous problems become shipped systems — across logistics, fintech, and AI.",
    statement:
      "Engineering is a series of decisions, not a pile of features. Build the smallest honest version, measure whether it worked, and let the number — not the aesthetics — make the call.",
    principles: [
      {
        quote: "Rules where you need vigilance, AI where you need judgment.",
        context: "On removing the LLM from the monitoring loop.",
      },
      {
        quote: "Ask what breaks at 100× before shipping — and audit your own work like a stranger would.",
        context: "On finding the proudest feature was the system's biggest bottleneck.",
      },
      {
        quote: "The right unit is cost per convinced customer, not cost per minute.",
        context: "On choosing a human voice over a free robotic one, and winning the room.",
      },
      {
        quote: "When a false positive costs a career, AI advises and humans decide.",
        context: "On a fraud-detection system that never auto-rejects a candidate.",
      },
    ],
  },

  // Personal timeline — milestones across education, work, projects, and writing.
  timeline: [
    {
      date: "Aug 2023",
      sortKey: "2023-08",
      title: "Started at BITS Pilani",
      subtitle: "B.E. Computer Science Engineering — Pilani Campus",
      category: "education",
    },
    {
      date: "Aug 2023",
      sortKey: "2023-08",
      title: "Enrolled at IIT Madras",
      subtitle: "B.S. Data Science & Applications (online), pursued alongside BITS",
      category: "education",
    },
    {
      date: "May 2025",
      sortKey: "2025-05",
      title: "CRIS internship begins",
      subtitle: "Full-stack Parcel Management System for Indian Railways",
      category: "work",
    },
    {
      date: "Jun 2025",
      sortKey: "2025-06",
      title: "1st of 50+ teams — LenDenClub hackathon",
      subtitle: "Led a 4-member team; shipped a serverless voice AI assistant in 48 hours",
      category: "milestone",
    },
    {
      date: "Jul 2025",
      sortKey: "2025-07",
      title: "Railway PMS shipped",
      subtitle: "40+ REST APIs, JWT auth, Docker Compose — capacity-planned for 7,000+ stations",
      category: "project",
    },
    {
      date: "Oct 2025",
      sortKey: "2025-10",
      title: "Software Tree internship",
      subtitle: "Remote SDE intern (USA) — building the Inventory Watchdog agent",
      category: "work",
    },
    {
      date: "Nov 2025",
      sortKey: "2025-11",
      title: "Published Inventory Watchdog essay",
      subtitle: "Medium architecture deep-dive — why the LLM left the monitoring loop",
      category: "writing",
    },
    {
      date: "Apr 2026",
      sortKey: "2026-04",
      title: "APOGEE 2026 — fraud detection system",
      subtitle: "Hybrid explainable scoring; AI advises, humans decide",
      category: "project",
    },
    {
      date: "Apr 2026",
      sortKey: "2026-04",
      title: "Published MCP benchmark study",
      subtitle: "33-minute essay on the hidden tax of AI database access",
      category: "writing",
    },
    {
      date: "Present",
      sortKey: "2026-06",
      title: "Building in public",
      subtitle: "Shipping agentic backends, benchmarking LLM tooling, open to SDE / AI internships",
      category: "milestone",
    },
  ],

  // What people say. `company` matches an experience.company exactly so the
  // quote also surfaces inline under that role in the Experience section.
  testimonials: [
    {
      quote:
        "Your work during the internship has been exceptional — not just technically strong, but also thoughtful, reliable, and mature in execution. The contributions you made around ORMCP, Gilhari, JDX, LLM systems, and agent workflows stood out, and several times you operated well beyond what I'd normally expect from an intern. Your work on the Inventory Watchdog project, the related YouTube video and podcast, and the benchmark article have been outstanding. More importantly, you approached problems with curiosity, ownership, and a strong learning mindset, which has made working with you a pleasure. I genuinely believe you have a very strong profile for roles in GenAI, backend infrastructure, AI systems engineering, and intelligent usage of AI tools, and I'm confident you'll do very well wherever you go next. You've made a real impact here.",
      name: "Damodar Periwal",
      role: "Founder, Software Tree",
      company: "Software Tree, LLC",
      relationship: "Internship manager · USA",
    },
  ],

  // Certificates & credentials. To add one: drop the image/PDF in
  // `public/certificates/` and add an entry: { title, issuer, date, href, company }.
  // `company` (optional) links a certificate to an experience so a
  // "View certificate" link appears inline on that role.
  certificates: [] as {
    title: string;
    issuer: string;
    date: string;
    href: string;
    company: string;
  }[],
} as const;

export type Profile = typeof profile;
export type Project = (typeof profile.projects)[number];

// Section anchors the AI agent can navigate to.
export const SECTION_IDS = [
  "hero",
  "about",
  "experience",
  "timeline",
  "projects",
  "skills",
  "activity",
  "writing",
  "testimonials",
  "contact",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
