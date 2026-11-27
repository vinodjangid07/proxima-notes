export const HOME_SITE = {
  name: "Proxima",
  tagline: "Local-first markdown workspace",
  url: "https://proxima.vinodjangid.site",
  hero: {
    headlineStart: "Write at the speed",
    headlineItalic: "of thought.",
    subhead:
      "A quiet, local-first workspace. Writes straight to your browser in open Markdown, works offline without an account, and syncs across devices when you sign in.",
    primaryCta: "Continue with Google",
    signingInCta: "Signing in...",
    secondaryCta: "Try as guest",
    signedInCta: "Open workspace",
  },
  specs: [
    {
      metric: "14 ms",
      label: "IndexedDB read speed",
      detail:
        "Notes load directly from your device memory. Zero API wait, zero spinners, zero round-trip latency.",
    },
    {
      metric: "100%",
      label: "Local-first storage",
      detail:
        "Every keystroke commits to on-device Dexie storage first. Internet connectivity remains optional.",
    },
    {
      metric: "0",
      label: "Account walls",
      detail:
        "Open the workspace and start drafting as a guest immediately. Sign in later and local notes migrate automatically.",
    },
  ],
  chapters: [
    {
      id: "draft",
      title: "Capture before context shifts",
      summary:
        "No workspaces to configure, no loading overlays. Open an untitled note and put words on disk in a single frame.",
      noteTitle: "Quiet notes at midnight",
      noteBody:
        "Good tools stay out of the way until you call on them. Writes hit local IndexedDB between keystrokes without waiting on a server.",
      meta: "23 words  ·  saved locally in 12 ms",
    },
    {
      id: "structure",
      title: "Structure inside plain text",
      summary:
        "Standard Markdown syntax resolves headings, checklists, and code blocks naturally as you write.",
      noteTitle: "Release readiness checklist",
      tasks: [
        { id: "t1", label: "Verify IndexedDB offline write path", done: true },
        { id: "t2", label: "Calibrate light and dark pastel grounds", done: true },
        { id: "t3", label: "Test batch Markdown archive export", done: false },
      ],
    },
    {
      id: "offline",
      title: "Continue without a signal",
      summary:
        "Write freely on flights or in dead zones. Local queues reconcile quietly into Cloud Firestore once your connection returns.",
      draftTitle: "Flight 412 architectural draft",
      draftBody:
        "Edited four sections while disconnected over the Atlantic. Pending operations sit safely in Dexie syncQueue ready for immediate flush.",
      queueStatus: "1 operation queued locally",
    },
    {
      id: "retain",
      title: "Own every file forever",
      summary:
        "Export your entire library as standard .md files or structured JSON anytime. Open your words anywhere for decades.",
      filename: "strategy.md",
      rawMarkdown: `---
title: Quiet Systems
updated: 2026-11-27
tags: [architecture, local-first]
---

# Core Principles
- [x] Instant Dexie.js local storage
- [x] Pure GitHub Flavored Markdown
- [ ] Optional cloud synchronization`,
    },
  ],
  floodSection: {
    heading: "Color as calm, never noise.",
    body: "Nine designer-calibrated grounds tuned for sunlit paper and midnight contrast. Select any mood to wash the canvas.",
    notes: {
      default: {
        title: "Obsidian & Chalk Slate",
        body: "When nothing should pull focus from the sentence you are forming right now.",
        tag: "#neutral",
      },
      peach: {
        title: "Coral Peach",
        body: "Warm morning light for personal reflections, weekly reading notes, and unhurried drafts.",
        tag: "#morning",
      },
      sand: {
        title: "Warm Honey",
        body: "Soft parchment warmth suited for morning routines, grocery checklists, and travel logs.",
        tag: "#routine",
      },
      mint: {
        title: "Sage Mint",
        body: "Quiet botanical calm built for clear-headed engineering specs and launch milestones.",
        tag: "#craft",
      },
      sky: {
        title: "Sky Blue",
        body: "Open horizon tone tuned for technical study notes, architecture diagrams, and reading queues.",
        tag: "#research",
      },
      lavender: {
        title: "Iris Lavender",
        body: "Subtle twilight register that separates creative ideas and Sunday writing from daily work.",
        tag: "#ideas",
      },
      rose: {
        title: "Blush Rose",
        body: "Gentle contrast designed for design critiques, typography studies, and editorial snippets.",
        tag: "#design",
      },
      teal: {
        title: "Fresh Teal",
        body: "Crisp clarity tailored for sprint objectives, bug triage lists, and release verification.",
        tag: "#shipping",
      },
      clay: {
        title: "Warm Clay",
        body: "Grounded archival stone for permanent references, core rules, and enduring principles.",
        tag: "#principles",
      },
    },
  },
  commands: {
    heading: "Built for hands that stay on the keys.",
    body: "Every core action maps directly to muscle memory. Try any command row live below.",
    sampleNotes: [
      { id: "c1", title: "Local-first storage specification", tags: ["core"], content: "Dexie IndexedDB and real-time sync" },
      { id: "c2", title: "Typography proportions for long reads", tags: ["type"], content: "Negative display tracking with breathable measure" },
      { id: "c3", title: "Markdown batch export checklist", tags: ["data"], content: "Pure UTF-8 markdown files with zero lock-in" },
      { id: "c4", title: "Guest workspace flow without login", tags: ["ux"], content: "Write immediately, migrate later" },
    ],
  },
  markdownSplit: {
    heading: "Your words stay plain text.",
    body: "No proprietary binary blobs, no gated export paywalls. Proxima stores plain UTF-8 GitHub Flavored Markdown compatible with Obsidian, VS Code, Neovim, or any plain text editor.",
    filename: "journal-2026.md",
    raw: `# 2026 Priorities

- [x] Eliminate analytics and telemetry
- [x] Commit every edit offline first
- [ ] Keep raw .md files portable forever

> Simplicity is prerequisite for reliability.`,
  },
  finalCta: {
    heading: "Begin with one quiet page.",
    body: "No onboarding questionnaires, no subscriptions, no delay. Step straight into your local workspace.",
    cta: "Open workspace",
    googleCta: "Continue with Google",
    guestLink: "Try as guest",
  },
  footer: {
    colophon: "Set in Switzer & JetBrains Mono",
    links: [
      { label: "Workspace", to: "/notes" },
      { label: "Sign in", to: "/login" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
};
