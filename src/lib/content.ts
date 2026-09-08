import pins from "./ncr-pins.json";

// Single source of truth for every word and number on the site.
// Change it here, it changes everywhere.

export const person = {
  name: "Anmol Sethi",
  role: "Product Ops",
  tagline: "I build the data pipelines products get judged on.",
  location: "Delhi NCR / Bengaluru",
  email: "anmolsethi911@gmail.com",
  phone: "+91 97295 81361",
  github: "https://github.com/Anmolas1402",
  linkedin: "https://linkedin.com/in/anmol-sethi-79ba03228",
  resume: "/Anmol-Sethi-Resume.pdf",
  /** Drop a square headshot at public/anmol.jpg, then set this to "/anmol.jpg". */
  photo: "/anmol.png",
  intro:
    "Two years in product ops at MathonGo, an EdTech platform built around data-driven decisions. I built the pipelines behind its most detailed exam analysis, scaled the test-series lineup from 1 exam to 14, and drove the feature work that grew Marks App from nothing into a product with real DAU targets.",
} as const;

/** The numbers that run in the hero marquee. Each one is defensible. */
export const metrics = [
  { value: "500K+", label: "students covered by the pipelines I built" },
  { value: "1 → 14", label: "exams in the test-series lineup", segments: { from: 1, to: 14 } },
  { value: "99.4%", label: "College Predictor data accuracy at rollout", ratio: 0.994 },
  { value: "~10 L", label: "hits on College Predictor in 3 months" },
  { value: "30+", label: "team managed across three subsidiaries" },
  { value: "100+", label: "interns hired and onboarded" },
  { value: "2 L", label: "paying students on Digital Books" },
  { value: "1,500+", label: "listeners per podcast episode" },
] as const;

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  blurb: string;
  /** Problem → decision → outcome. The part recruiters actually read. */
  detail: string[];
  stat: { value: string; label: string };
  tags: string[];
  href?: string;
  hrefLabel?: string;
  live?: boolean;
};

export const projects: Project[] = [
  {
    id: "ncrhiring",
    index: "001",
    title: "NCR Hiring Map",
    kicker: "Built solo · live in production",
    blurb:
      `An interactive map of every startup and VC firm hiring across Delhi NCR. ${pins.total.toLocaleString()} companies, ${pins.openJobs.toLocaleString()} open roles, built from a reproducible scraping pipeline instead of a hand-typed spreadsheet.`,
    detail: [
      "Bangalore had a startup map. NCR did not, and the obvious way to build one is to type companies into a sheet until you get bored.",
      "I built a pipeline instead: scrape live job postings, verify addresses against Google Maps, drop anything outside the NCR bounding box, and derive the area facet from address text.",
      `The honest part is the interesting part. ${pins.verified} pins are verified against real street addresses. The rest are city-level guesses from job postings — drawn as hollow dots and labelled as approximate. A guessed pin never gets shown as a verified one.`,
    ],
    stat: { value: pins.total.toLocaleString(), label: "companies mapped" },
    tags: ["Next.js 16", "Leaflet", "Data pipeline", "Scraping", "Tailwind v4"],
    href: "https://ncrhiring.in",
    hrefLabel: "ncrhiring.in",
    live: true,
  },
  {
    id: "college-predictor",
    index: "002",
    title: "College Predictor",
    kicker: "MathonGo · owned end to end",
    blurb:
      "Score-to-seat prediction for JoSAA, JAC and BITSAT, wired into the score calculator so a student goes from marks to predicted college in one flow.",
    detail: [
      "Students had a score and no idea what it was worth. The two halves of the answer lived in two different tools.",
      "I owned the product side end to end: sourcing the admission data, validating whether it was usable at all, and deciding what belonged in the model and what was noise.",
      "Then I stress-tested it with Product and Engineering before every release — boundary ranks, category-specific seats, the edge cases that quietly embarrass you at scale. 99.4% accuracy before it went to 500K+ users.",
    ],
    stat: { value: "~10 L", label: "hits in 3 months" },
    tags: ["Product ownership", "Data validation", "UAT", "Edge cases"],
  },
  {
    id: "buildability",
    index: "003",
    title: "App Buildability Research",
    kicker: "Agent-built research pipeline",
    blurb:
      "Which of 100 third-party apps can you actually integrate, and what stops you? Every claim carries an evidence URL and a confidence score.",
    detail: [
      "The finding that surprised me: auth is basically solved. 94 of 100 apps use an API key, OAuth 2.0, or both.",
      "The real bottleneck is paperwork. Of 65 apps with a blocker, 30 are approval gates — app review, partner programmes, sales contracts. Only 12 are architectural. Ads platforms need a BD motion, not more engineers.",
      "I sampled 20 apps for manual verification to put a number on my own reliability: 92.5% claim accuracy. A research report without an error bar is a blog post.",
    ],
    stat: { value: "92.5%", label: "verified claim accuracy" },
    tags: ["Research design", "Evidence tracking", "AI-assisted analysis"],
    href: "https://anmolas1402.github.io/composio-app-buildability/",
    hrefLabel: "Read the report",
  },
  {
    id: "ticket-triage",
    index: "004",
    title: "Ticket Triage",
    kicker: "Full stack + eval harness",
    blurb:
      "Classifies inbound support tickets with a forced-function-call to the OpenAI API, persists to Postgres, and reviews them in a filterable dashboard.",
    detail: [
      "The classifier is the easy half. The half people skip is knowing whether it works.",
      "So it ships with an eval: 100 labelled tickets, scored per prompt version, accuracy printed for each. You can tell whether a prompt change helped or just felt better.",
      "FastAPI + SQLAlchemy 2.0 + Postgres on the back, React + Vite + Tailwind on the front, full audit trail on every classification.",
    ],
    stat: { value: "100", label: "labelled tickets in the eval set" },
    tags: ["FastAPI", "OpenAI", "PostgreSQL", "React", "Evals"],
  },
];

export type Role = {
  org: string;
  title: string;
  period: string;
  place?: string;
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    org: "MathonGo",
    title: "Operations Manager (Intern)",
    period: "Dec 2023 — Jan 2026",
    place: "Bengaluru, India",
    points: [
      "Built the data pipelines behind MathonGo's exam analysis, covering 500K+ students across every exam we supported.",
      "Managed a 30+ member team across three subsidiaries, split into sub-manager tiers, and ran hiring for 100+ interns over two years — writing the SOPs that got new people up to speed fast.",
      "Scaled the test-series lineup from 1 exam (JEE Main) to 14, owning the question-bank architecture and analysis pipeline for each launch.",
      "Marks App didn't exist when I joined. I owned the features and initiatives that shaped it, aimed squarely at growing daily active users.",
    ],
    tags: ["Product Ops", "Data pipelines", "Hiring", "SOPs", "Team leadership"],
  },
  {
    org: "Alumni Relations Cell, TIET",
    title: "President",
    period: "Sept 2025 — Jan 2026",
    points: [
      "Led a 40-person executive team running alumni engagement, outreach and day-to-day operations for the cell.",
      "Hosted Engineers Beyond Engineering and Insider Bench — two podcasts reaching 1,500+ listeners per episode.",
    ],
    tags: ["Leadership", "Ops", "Podcasting"],
  },
  {
    org: "Lead Society, TIET",
    title: "Joint Secretary",
    period: "Oct 2024 — Apr 2025",
    points: [
      "Directed cross-functional student squads to execute campus initiatives end to end — planning, budgeting and coordinating across departments to get things delivered.",
    ],
    tags: ["Cross-functional", "Budgeting"],
  },
];

export const education = [
  {
    org: "Thapar Institute of Engineering and Technology",
    title: "B.Tech — Electronics and Computer Engineering",
    period: "Expected 2027",
  },
  {
    org: "Sant Gyaneshwar Model School, Delhi",
    title: "Senior Secondary (CBSE)",
    period: "2022",
  },
];

export const skills = {
  "Cross-functional execution": [
    "Product Thinking",
    "Ops Design",
    "GTM Support",
    "Feature Validation",
    "User Research",
    "PRD Writing",
    "UAT",
    "Workflow Design",
    "Requirement Analysis",
  ],
  "Data & analytics": [
    "SQL",
    "Power BI",
    "Advanced Excel",
    "Google Sheets",
    "Dashboarding",
    "Data Validation",
    "Root Cause Analysis",
  ],
  "AI & automation": ["AI-assisted analysis", "AI-assisted documentation"],
  Collaboration: [
    "Team Leadership",
    "Process Optimization",
    "Structured Documentation",
    "SOPs",
  ],
} as const;

/** Scrolling strip under the hero. Short, punchy, all true. */
export const marqueeWords = [
  "DATA PIPELINES",
  "PRODUCT OPS",
  "500K STUDENTS",
  "SQL",
  "1 → 14 EXAMS",
  "SOPs THAT STICK",
  "99.4% ACCURATE",
  "HIRING AT SCALE",
  "SHIPS THINGS",
  "EDGE CASES",
] as const;
