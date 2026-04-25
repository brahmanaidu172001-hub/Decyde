Decyde

Decide if AI should exist before you build it.

Decyde is an AI Deployment Intelligence System. You describe a real-world business workflow, and Decyde determines whether it should become an AI Agent, a Copilot, a Workflow Automation, an Analytics-Only surface — or whether it should not be automated at all.

Most teams ask, “How do we add AI?”
Decyde asks the harder question:
should AI exist here at all?
<img width="1920" height="939" alt="Screenshot 2026-04-25 150925" src="https://github.com/user-attachments/assets/0b901218-3f47-48b8-af47-70dcbede9e94" />

Why it matters

A significant share of AI projects stall or fail because they were built on a weak premise — low volume, high risk, unclear ROI, or problems better solved with deterministic automation.

Decyde acts as a decision layer before implementation, turning a messy workflow description into:

A calibrated AI Fit Score (0–100)
A concrete recommended approach with reasoning
A focused set of bottlenecks, risks, and guardrails
A clear ROI / impact perspective<img width="1920" height="938" alt="Screenshot 2026-04-25 151033" src="https://github.com/user-attachments/assets/b02bf2be-eedb-48e7-8dfb-db666f17525d" />

An actionable MVP roadmap
Features
Decision-first system (not a chatbot)
Claude is prompted as a senior AI Product Manager, automation strategist, and risk reviewer.
Anthropic-only backend
Single Next.js API route using native fetch. No SDK, no database, no auth.
Fail-safe output handling
Always returns something — structured output, raw fallback, or clear error. No infinite loading.
Preloaded real workflows
Healthcare Call Center, Finance Month-End Close, Recruiting.<img width="1653" height="834" alt="Screenshot 2026-04-25 151213" src="https://github.com/user-attachments/assets/efc1a6dc-f943-4d58-bf7c-ed502d6497e4" />

Clean SaaS UI
Dark mode, electric cyan accents, built with Tailwind.
Production-ready
GitHub + Vercel deployable with minimal setup.
Tech Stack
Next.js 14 (App Router)
TypeScript
Tailwind CSS
Anthropic Messages API (via native fetch)

Model: claude-3-haiku-20240307

Setup
1. Clone and install
git clone https://github.com/brahmanaidu172001-hub/Decyde.git
cd Decyde
npm install

Tip: avoid OneDrive paths — they can interfere with node_modules and cause install issues.

2. Create .env.local
cp .env.example .env.local

Add your key:

ANTHROPIC_API_KEY=sk-ant-...

Get a key from: https://console.anthropic.com

3. Run locally
npm run dev

Open: http://localhost:3000

4. Build
npm run type-check
npm run build
npm start
Environment Variables
Variable	Required	Purpose
ANTHROPIC_API_KEY	Yes	Server-side Anthropic API key

The key is used only in the backend and is never exposed to the client.

Deploy to Vercel
Push repo to GitHub
Import into Vercel

Add environment variable:

ANTHROPIC_API_KEY
Deploy

Live in ~60 seconds.

GitHub Portfolio Description

Decyde — an AI Deployment Intelligence System built with Next.js and Anthropic Claude. It evaluates real-world workflows and determines whether to implement AI agents, copilots, automation, analytics, or no AI at all. Designed as a decision system focused on business impact and risk-aware automation.

Resume Bullet

Built Decyde, an AI Deployment Intelligence System that evaluates workflows and determines whether to deploy AI agents, copilots, or automation. Designed a decision-first architecture using Next.js and Anthropic Claude, incorporating risk analysis, ROI evaluation, and MVP planning into a production-ready web app deployed on Vercel.

60-second Demo Pitch

“Most teams invest in AI without questioning if AI should exist in the workflow. Decyde solves that. You describe a workflow, and it evaluates whether it should become an AI agent, copilot, automation, analytics layer, or nothing at all. It scores AI fit, explains the reasoning, highlights risks and guardrails, and outlines an MVP roadmap. It’s built as a decision system—not a chatbot.”

License

MIT — use, fork, and ship.

Repository

https://github.com/brahmanaidu172001-hub/Decyde
