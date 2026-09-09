import pins from "./ncr-pins.json";

// Single source of truth for every word and number on the site.
// Change it here, it changes everywhere.

/**
 * The mapped-company count, formatted once. The hero pill drifted to a stale
 * 1,878 against the map's own 948 because it was typed by hand; deriving it
 * from the same snapshot the map reads means the two can no longer disagree.
 */
export const pinCount = pins.total.toLocaleString();

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
  /** Larger portrait for the About polaroid. */
  portrait: "/anmol-portrait.jpg",
  intro:
    "Two years in product ops at MathonGo, an EdTech platform built around data-driven decisions. I built the pipelines behind its most detailed exam analysis, scaled the test-series lineup from 1 exam to 14, and drove the feature work that grew Marks App from nothing into a product with real DAU targets.",
} as const;

/** The numbers that run in the hero marquee. Each one is defensible. */
/**
 * Gmail's compose window, addressed and titled.
 *
 * Every "Get in Touch" control uses this rather than mailto:, which silently
 * does nothing on a machine with no mail client configured — the click looks
 * broken. The address is a Gmail one, and this works on desktop and hands off
 * to the app on mobile. The plain address further down stays a mailto: for
 * people who do have a native client.
 */
export const composeUrl =
  "https://mail.google.com/mail/?view=cm&fs=1" +
  `&to=${encodeURIComponent(person.email)}` +
  `&su=${encodeURIComponent("Hello Anmol")}`;

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
  /** Square-ish mark in public/logos. Falls back to a monogram when absent. */
  logo?: string;
  /** Tile colour behind the mark — dark logos need a light plate. */
  logoBg?: string;
  title: string;
  period: string;
  place?: string;
  /** One sentence, verb first, ending on the outcome — the reference's shape. */
  summary: string;
  tags: string[];
};

export const experience: Role[] = [
  {
    org: "MathonGo",
    logo: "/logos/mathongo-mark.png",
    title: "Operations Manager (Intern)",
    period: "Dec 2023 – Jan 2026",
    place: "Bengaluru, India",
    summary:
      "Built the data pipelines behind exam analysis for 500,000+ students, scaled the test series from one exam to fourteen, and ran hiring and onboarding for 100+ interns across a 30-member team.",
    tags: ["Product Ops", "Data pipelines", "Hiring", "SOPs", "Team leadership"],
  },
  {
    org: "Alumni Relations Cell, TIET",
    logo: "/logos/arc.png",
    logoBg: "#ffffff",
    title: "President",
    period: "Sept 2025 – Jan 2026",
    summary:
      "Led a 40-person executive team running alumni engagement, outreach and day-to-day operations, and hosted two podcasts that reached 1,500+ listeners an episode.",
    tags: ["Leadership", "Ops", "Podcasting"],
  },
];

export const education = [
  {
    org: "Thapar Institute",
    logo: "/logos/thapar.png",
    logoBg: "#ffffff",
    title: "B.Tech — Electronics and Computer Engineering",
    period: "Expected 2027",
    summary:
      "Electronics and Computer Engineering at Thapar, Patiala, alongside the MathonGo role and the Alumni Relations Cell presidency.",
  },
  {
    org: "Sant Gyaneshwar Model School",
    title: "Senior Secondary (CBSE)",
    period: "2022",
    summary: "Senior Secondary, CBSE. Delhi.",
  },
];

/**
 * The six things the work actually consists of, for the scattered pile in
 * "What I do". Each caption is evidence for its label, not a restatement of it:
 * the label says the discipline, the caption says what I did in it.
 *
 * Tints are deliberately pale so the cards read as paper scraps against the
 * dark ground, the way the physics pills up top do.
 */
export const disciplines = [
  {
    label: "Product Ops",
    caption: "0 → 1 features, end to end",
    tint: "#ebe9e1",
  },
  {
    label: "Hiring",
    caption: "100+ interns onboarded",
    tint: "#e6e2ef",
  },
  {
    label: "Data Analysis",
    caption: "pipelines to decisions",
    tint: "#dfe4e5",
  },
  {
    label: "Process Design",
    caption: "SOPs that survive scale",
    tint: "#f2f1ef",
  },
  {
    label: "Stakeholders",
    caption: "founders to interns",
    tint: "#ece7ea",
  },
  {
    label: "Quality",
    caption: "break it before users do",
    tint: "#ebe9e1",
  },
] as const;

/**
 * Read word by word as the section scrolls past. Kept to one sentence: the
 * reveal is what holds attention, and a second sentence outlasts it.
 */
export const disciplineStatement =
  "My work spans product ops, data and hiring \u2014 turning messy, manual processes into systems that still hold up when the volume goes up.";

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
    "Python",
    "Power BI",
    "Advanced Excel",
    "Google Sheets",
    "Dashboarding",
    "Data Validation",
    "Root Cause Analysis",
    "Cohort Analysis",
    "Funnel Analysis",
    "KPI Definition",
    "Data Storytelling",
    "AI-assisted analysis",
  ],
  "Business & consulting": [
    "Business Analysis",
    "Stakeholder Management",
    "Process Mapping",
    "Market Research",
    "Competitive Analysis",
    "Forecasting",
    "Decision Memos",
  ],
  Collaboration: [
    "Team Leadership",
    "Process Optimization",
    "Structured Documentation",
    "SOPs",
    "AI-assisted documentation",
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

export type Testimonial = {
  /** Verbatim. Never paraphrased, never written on someone's behalf. */
  quote: string;
  /**
   * The closing clause to render at full brightness, with the rest muted —
   * emphasis only, so it must appear in `quote` exactly. If it doesn't, the
   * whole quote renders muted rather than silently showing altered words.
   */
  emphasise?: string;
  name: string;
  /** Their title at the time, and how they knew the work. */
  role: string;
  relationship?: string;
  source?: string;
};

/**
 * Only statements the person actually wrote. Kunal's is his LinkedIn
 * recommendation, quoted as written.
 *
 * To add one: ask the person for two or three lines, paste what they send
 * here unedited, and credit them properly. Do not write these.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Anmol is a cool-headed guy who can manage a big team at such a young age. Started working at a young age. I worked with Anmol on multiple products from scratch at MathonGo for a good 1.5 years. Highly recommend Anmol for management, consulting and product roles.",
    emphasise:
      "Highly recommend Anmol for management, consulting and product roles.",
    name: "Kunal Taneja",
    role: "Founder, Canvas Classes · Ex-Head of Content (founding team), MathonGo",
    relationship: "Managed Anmol directly",
    source: "LinkedIn recommendation, May 2026",
  },
];
