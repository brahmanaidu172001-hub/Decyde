# Decyde

**Decide if AI should exist before you build it.**

Decyde is an AI Deployment Intelligence System. You describe a real-world
business workflow, and Decyde tells you whether it should become an **AI
Agent**, a **Copilot**, a **Workflow Automation**, an **Analytics-Only**
surface — or whether it should **not be automated at all**.

Most teams ask, "How do we add AI?" Decyde asks the harder question:
*should AI exist here at all?*
<img width="1920" height="939" alt="Screenshot 2026-04-25 150925" src="https://github.com/user-attachments/assets/9183ae12-4442-4567-8354-09b23f38be32" />

---

## Why it matters

A significant share of AI projects stall or get shut down because they were
built on a weak premise — low volume, unacceptable blast radius, no
measurable ROI, or a deterministic solution that would have worked better.
Decyde is the decision-grade review layer that belongs in front of every AI
investment. It turns a messy workflow description into:

- A calibrated **AI Fit Score** (0–100)
- A concrete **recommended approach** with a defensible justification
- A short list of **bottlenecks, risks, and guardrails**
- An **ROI / impact** read
- An ordered **MVP roadmap**

---

## Features

- Senior-PM persona prompting — Claude acts as product manager, automation
  strategist, risk reviewer, and systems thinker, not a generic chat bot.
- Anthropic-only backend — single Next.js route, no SDK, no database, no auth.
- Lenient JSON handling — the UI always renders something: a structured
  dashboard on success, the raw text on non-JSON output, and a clear error
  on failure. No infinite loading.
- One-click sample workflows — Healthcare Call Center, Finance Month-End
  Close, Recruiting.
- Clean dark SaaS UI — black background, electric cyan accent, plain
  Tailwind.
- Vercel-ready, GitHub-portfolio-ready.<img width="1920" height="938" alt="Screenshot 2026-04-25 151033" src="https://github.com/user-attachments/assets/17ed0438-98aa-466a-b00f-37b20a41d0dc" />


---

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic Messages API via native `fetch`
- Deployable on Vercel with zero config

Model: `claude-3-haiku-20240307`.

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/brahmanaidu172001-hub/Decyde.git
cd Decyde
npm install
```

> Tip: keep the repo out of a OneDrive-synced path. OneDrive tries to sync
> every file in `node_modules/` and will break `npm install` with
> `ENOTEMPTY` / "Operation not permitted" errors.

### 2. Create `.env.local`

Copy the template and add your Anthropic API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```ini
ANTHROPIC_API_KEY=sk-ant-...
```

Grab a key at [console.anthropic.com](https://console.anthropic.com/).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click one of the
sample buttons to try it.

### 4. Type-check and build

```bash
npm run type-check
npm run build
npm run start
```

---

## Environment variables

| Variable            | Required | Purpose                                 |
| ------------------- | -------- | --------------------------------------- |
| `ANTHROPIC_API_KEY` | yes      | Server-side Anthropic Messages API key  |

The key is read only inside `app/api/analyze/route.ts` on the server. It is
never shipped to the browser.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import Git Repository**.
3. Framework preset is auto-detected as Next.js — keep defaults.
4. Under **Environment Variables**, add `ANTHROPIC_API_KEY`.
5. Click **Deploy**. First build takes ~60 seconds.
6. Your app is live at `https://<project>.vercel.app`.

No additional config required. The API route uses the Node runtime and sets
`dynamic = 'force-dynamic'` to avoid caching analyses.

---

## How it works

```
User ─▶ app/page.tsx
         │ POST /api/analyze
         ▼
     app/api/analyze/route.ts  ──▶  Anthropic Messages API
     (Node runtime, fetch)          (claude-3-haiku-20240307)
         │
         ▼
     JSON.parse best-effort
         │
         ▼
     { ok, analysis, rawText, warning? }  ─▶  Dashboard
```

The API route always returns a shaped response:

- On parse success: `{ ok: true, analysis, rawText }`
- On non-JSON output: `{ ok: true, analysis: null, rawText, warning: "..." }`
- On failure: `{ ok: false, error: "..." }`

The frontend covers every state: empty, loading, success, raw-fallback, and
error. A 35-second client-side timeout ensures the spinner always stops.

---

## GitHub portfolio description

> Decyde — an AI Deployment Intelligence System built on Next.js 14 and the
> Anthropic Messages API. Describe a workflow and Decyde evaluates whether
> it should become an AI Agent, Copilot, workflow automation, analytics
> view, or none at all. Opinionated, skeptical, and designed for AI PMs and
> operations leaders.

---

## Resume bullet

> **Decyde — AI Deployment Intelligence System.** Designed and shipped a
> production-ready Next.js 14 + TypeScript web app that evaluates real-world
> workflows and decides whether to deploy an AI Agent, Copilot, workflow
> automation, analytics-only view, or no AI at all. Built a single-route
> Anthropic Claude integration with tight timeouts, lenient JSON handling,
> and a dark-mode dashboard surfacing fit score, recommendation, risks,
> guardrails, ROI impact, and an MVP roadmap. Deployed on Vercel.

---

## 60-second demo pitch

> "Most teams are spending real money on AI without ever asking whether the
> workflow should be AI in the first place. This is Decyde — an AI
> Deployment Intelligence System. I describe a workflow — let's use a
> healthcare call center — and click Analyze. Decyde calls Claude as a
> senior AI PM, automation strategist, and risk reviewer. It scores AI fit
> on a calibrated 0-to-100 scale and picks between AI Agent, Copilot,
> workflow automation, analytics only, or do-not-automate. Notice it didn't
> default to 'build an agent' — it recommended a copilot because the blast
> radius is too high for autonomy. On the right I get the bottlenecks,
> risks paired with guardrails, an ROI read, and an MVP roadmap. The whole
> thing is Next.js 14 with a server-side Anthropic Messages API call and a
> strict-but-lenient JSON contract, deployable on Vercel."

---

## License

MIT — use, fork, and ship.

Repository: [https://github.com/brahmanaidu172001-hub/Decyde](https://github.com/brahmanaidu172001-hub/Decyde)
