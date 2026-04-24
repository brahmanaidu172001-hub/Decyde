'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Github, ExternalLink } from 'lucide-react';
import { DecydeForm } from '@/components/DecydeForm';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import type { AnalyzeResponse, DecydeAnalysis, DecydeInput } from '@/lib/types';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DecydeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(input: DecydeInput) {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    // Hard client-side timeout so the spinner can NEVER hang forever,
    // even if the network stalls and the server never responds.
    // Must be longer than the server-side ANTHROPIC_TIMEOUT_MS (default 45s).
    const CLIENT_TIMEOUT_MS = 60_000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => null)) as
        | AnalyzeResponse
        | null;
      if (!data) {
        setError(
          `Server returned a non-JSON response (HTTP ${res.status}). Check the server logs.`,
        );
        return;
      }
      if (!data.ok) {
        setError(data.error);
        return;
      }
      setAnalysis(data.analysis);
    } catch (e) {
      const err = e as Error;
      if (err?.name === 'AbortError') {
        setError(
          'Request timed out after 60 seconds. The model may be slow or the server is unreachable — please try again.',
        );
      } else {
        setError(
          err?.message ??
            'Network error while contacting the Decyde API.',
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen">
      {/* Ambient grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern bg-[size:48px_48px] opacity-40"
      />

      <Header />

      <section className="container pb-24 pt-6">
        <Hero />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <DecydeForm
              onSubmit={handleAnalyze}
              loading={loading}
              error={error}
            />
          </div>
          <div>
            <ResultsDashboard analysis={analysis} loading={loading} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-white/5">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-electric-500/15 ring-1 ring-electric-500/30">
            <Brain className="h-4 w-4 text-electric-400" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            Decyde
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            • AI Deployment Intelligence System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-electric-300"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl pt-14 text-center"
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/5 px-3 py-1 text-xs text-electric-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-400" />
        Senior-PM-grade analysis, not a chatbot
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Decide if <span className="text-gradient">AI should exist</span> before
        you build it.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
        Decyde evaluates any real-world workflow and tells you whether to build
        an AI Agent, a Copilot, plain workflow automation, an analytics view — or
        nothing at all.
      </p>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-6">
      <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <span>
          © {new Date().getFullYear()} Decyde. Built with Next.js 14, TypeScript,
          Tailwind, and Anthropic Claude.
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Production-ready deployment
        </span>
      </div>
    </footer>
  );
}
