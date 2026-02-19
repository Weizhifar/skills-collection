# Presentation-Style Guide App (Step-by-Step Onboarding)

This document describes how to design and implement a “presentation-like” web guide (not PPT), similar to your screenshots:

- header with title + `Step x / N`
- two-panel layout (left: instructions, right: image/web)
- bottom dots + Previous/Next
- optional tabs (Windows/macOS) + copy code blocks

---

## 1. Goals & Non-Goals

### Goals

- Build a **step-based guide** that feels like slides but is **web-native and interactive**
- Support:
  - Step navigation (buttons + dots + keyboard)
  - Left instructions panel (rich text, lists, callouts, links)
  - Right panel (image / video / embedded webpage)
  - Step counter (e.g., `Step 3 / 9`)
  - Optional “tabs” (Windows/macOS) for OS-specific commands
  - “Copy” button for command snippets
- Deployable to **Vercel** (static-compatible)

### Non-Goals

- Not a PPT exporter
- Not Reveal.js deck (unless you explicitly want slide syntax)
- No authentication required initially

---

## 2. UX / UI Spec

### 2.1 Page Layout (Desktop)

- Background: soft/pastel (e.g., lavender)
- Center container: fixed max width (e.g., 1100–1400px)
- Top header bar:
  - Left: app title (e.g., “Agent Skills 指南 (Claude Code版)”)
  - Right: pill showing `Step x / N`
- Main content area: **2-column**
  - Left panel: instruction card
  - Right panel: screenshot / embed card
- Bottom bar:
  - Left: Previous (disabled on first step)
  - Center: dots (step indicators)
  - Right: Next (disabled on last step)

### 2.2 Mobile Layout

- Single column:
  - Header
  - Right panel first (optional) then left text, or reverse
  - Dots + buttons at bottom
- Swipe gesture optional (nice-to-have)

### 2.3 Interaction Requirements

- Previous/Next navigation
- Dot click navigation
- Keyboard shortcuts:
  - `←` previous, `→` next
  - `Home` first, `End` last
- Step state persists (optional):
  - localStorage `currentStep`

---

## 3. Information Architecture (Core Concept)

This is a state-driven app.
Everything renders based on `currentStepIndex`.

**Component tree**

- `<AppShell>`
  - `<Header title stepCounter />`
  - `<Main>`
    - `<LeftPanel content />`
    - `<RightPanel media />`
  - `<Footer nav dots />`

---

## 4. Data Model

### 4.1 Step Schema

Use a single source of truth: `steps.ts`.

```ts
export type Step = {
  id: string; // "install-antigravity"
  order: number; // 1..N
  stepLabel?: string; // optional "1. 安装 Antigravity"
  title: string; // shown in left panel header
  subtitle?: string;

  left: {
    blocks: ContentBlock[]; // rich instruction content
  };

  right: {
    type: "image" | "video" | "iframe" | "custom";
    src?: string; // /images/xxx.png or URL
    alt?: string;
    iframeUrl?: string;
    aspect?: "16:9" | "4:3" | "auto";
  };

  meta?: {
    tags?: string[];
    estimatedMinutes?: number;
  };
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; style: "ordered" | "unordered"; items: string[] }
  | { type: "callout"; tone: "info" | "warning" | "success"; text: string }
  | { type: "link"; text: string; href: string }
  | {
      type: "codeTabs";
      tabs: { label: string; code: string; lang?: string }[];
    };
```
