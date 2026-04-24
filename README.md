# Decyde

**Decide if AI should exist before you build it.**

Decyde is a production-grade AI Deployment Intelligence System. You give it a
real-world workflow, and it decides whether that workflow should become an
**AI Agent**, a **Copilot**, a **Workflow Automation**, an **Analytics-Only**
surface — or whether it should **not be automated at all**.

Most "AI strategy" tools sell you AI. Decyde is built to be skeptical. It thinks
like a senior AI Product Manager, a Systems Architect, an Operations Strategist,
and a Risk & Governance reviewer all at once — and it refuses to blindly
recommend AI when a simpler answer fits.

---

## Why It Matters

Companies are spending billions on "AI transformation" without ever asking the
prior question: *should this workflow be AI in the first place?* A huge share of
AI projects stall or get shut down because they were built on a weak premise —
low volume, unacceptable blast radius, no measurable ROI, or a deterministic
solution that would have worked better.

Decyde is the **decision-grade review layer** that belongs in front of every AI
investment. It turns a messy workflow description into:

- A calibrated **AI Fit Score** (0–100)
- A concrete **recommendation** with a justification you can defend in a steering
  committee
- A ranked list of **bottlenecks, decision points, risks, and guardrails**
- An **ROI estimate** (hours saved, cost impact, complexity, adoption risk)
- A **PM-ready PRD** with user stories, success metrics, an MVP roadmap, and
  prioritized backlog

It is built to be shown to hiring managers, demoed live, and shipped.

---

## Features

- **Senior-PM persona prompting.** The model is anchored as a product manager,
  architect, operator, and risk reviewer — not a generic chat assistant.
- **Strict JSON contract.** The API route validates the model's output against a
  TypeScript schema; malformed responses are rejected, not rendered.
- **Dark, premium SaaS UI.** Black + electric-blue, glassmorphism, animated
  gauge, framer-motion transitions, shadcn/ui primitives.
- **Split-view workspace.** Input on the left, live dashboard on the right.
- **One-click sample workflows.** Healthcare Call Center, Finance Month-End
  Close, and Recruiting — demo-ready.
- **Graceful error handling.** Missing API key, bad input, upstream errors,
  timeouts, and parse failures all surface clearly.
- **Vercel-native.** Deploys with zero config.

---

## Architecture

```
User ──▶ DecydeForm (client)
           │ POST /api/analyze
           ▼
      Next.js API Route  ──▶  Anthropic Messages API
      (Node runtime)           (claude-3-5-sonnet-20241022, fetch-based)
           │
           ▼
      Schema validation (lib/types.ts · isDecydeAnalysis)
           │
           ▼
      ResultsDashboard
        ├─ ScoreCard         (AI Fit Score, animated ring)
        ├─ RecommendationCard (AI Agent / Copilot / Automation / …)
        ├─ WorkflowBreakdown (steps, bottlenecks, decision points)
        ├─ RiskCard          (risks + guardrails)
        ├─ ROICard           (hours, $, complexity, adoption)
        └─ PMOutputCard      (PRD: summary, stories, metrics, roadmap, backlog)
```

**Tech stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui,
lucide-react, framer-motion, Anthropic Messages API (via `fetch`).

**Directory layout:**

```
app/
  api/analyze/route.ts       # Server-only Anthropic call + JSON validation
  globals.css                # Tailwind base + Decyde theme tokens
  layout.tsx                 # Root layout, dark mode
  page.tsx                   # Home: form + dashboard
components/
  DecydeForm.tsx             # Input form + sample workflows
  ResultsDashboard.tsx       # Composes all result cards
  ScoreCard.tsx              # Animated AI Fit Score gauge
  RecommendationCard.tsx     # Recommendation badge + rationale
  RiskCard.tsx               # Risks + guardrails
  PMOutputCard.tsx           # PRD output
  ui/                        # shadcn/ui primitives
lib/
  prompt.ts                  # System + user prompts; model config
  types.ts                   # Shared types + schema guard
  utils.ts                   # cn(), score color ramp, style helpers
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-handle/decyde.git
cd decyde
npm install
```

### 2. Configure environment

Copy the example file and add your Anthropic API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```ini
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022   # optional; default is claude-3-5-sonnet-20241022
ANTHROPIC_TIMEOUT_MS=45000                   # optional
```

Get a key at [console.anthropic.com](https://console.anthropic.com/).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Type-check and build

```bash
npm run type-check
npm run build
npm run start
```

---

## Environment Variables

| Variable               | Required | Default                        | Purpose                                  |
| ---------------------- | -------- | ------------------------------ | ---------------------------------------- |
| `ANTHROPIC_API_KEY`    | ✅       | —                              | Server-side Anthropic key                |
| `ANTHROPIC_MODEL`      | ⛔       | `claude-3-5-sonnet-20241022`   | Override the Claude model                |
| `ANTHROPIC_TIMEOUT_MS` | ⛔       | `45000`                        | Upstream timeout before returning `504`  |

`ANTHROPIC_API_KEY` is read **only** inside the `/api/analyze` route on the
server. It is never shipped to the browser.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import Git Repository**.
3. Framework preset is auto-detected as Next.js.
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` (required)
   - `ANTHROPIC_MODEL` (optional)
5. Click **Deploy**. First build takes ~60 seconds.
6. Your app is live at `https://<project>.vercel.app`.

No additional config is required — the API route uses the Node runtime by
default and has `dynamic = 'force-dynamic'` set to avoid caching analyses.

---

## Resume Bullet

> **Decyde — AI Deployment Intelligence System.** Designed and shipped a
> production-grade Next.js 14 + TypeScript SaaS that evaluates real-world
> workflows and decides whether to deploy an AI Agent, Copilot, workflow
> automation, analytics view, or no AI at all. Architected a strict-JSON
> prompting contract with server-side Anthropic Claude integration, schema
> validation,
> and graceful failure handling; built a premium dark-mode dashboard
> (Tailwind, shadcn/ui, framer-motion) rendering fit score, recommendation,
> risks/guardrails, ROI estimate, and a PM-ready PRD.

---

## Demo Pitch Script (60 seconds)

> "Most companies are spending millions on AI without asking the prior question:
> *should this workflow be AI at all?* This is Decyde — an AI Deployment
> Intelligence System. I describe a workflow — let's use a healthcare call
> center — and click Analyze. Decyde is instructed to think like a senior AI
> PM, a systems architect, and a risk reviewer. It breaks the workflow into
> steps, flags the real bottlenecks, scores AI feasibility on a calibrated
> 0-to-100 scale, and picks between AI Agent, Copilot, workflow automation,
> analytics only, or do-not-automate. Notice it didn't default to 'build an
> agent' — it recommended a copilot because the blast radius is too high for
> autonomy. On the right I get risks, guardrails, a hours-saved ROI estimate,
> and a PM-ready PRD with user stories, success metrics, and an MVP roadmap I
> can paste into Notion tomorrow. The whole thing is Next.js 14 with a
> server-side Anthropic Claude call and a strict JSON contract, deployed on
> Vercel."

---

## License

MIT — use, fork, and ship.
