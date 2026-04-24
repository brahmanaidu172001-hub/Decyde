/**
 * Decyde — /api/analyze
 *
 * ─── OneDrive / Windows warning ────────────────────────────────────────────
 * This project currently lives under a OneDrive-synced path. OneDrive will
 * try to sync every file in `node_modules/` (tens of thousands of small
 * files), which causes:
 *   - npm install errors like ENOTEMPTY / "Operation not permitted" during
 *     rename-and-cleanup steps.
 *   - Editor and `next dev` file-watcher hangs.
 *   - Stale / partially-synced files the Node runtime cannot read.
 *
 * Recommended fix (no code change required):
 *   1. Close the dev server and IDE.
 *   2. Move the project to a NON-OneDrive path, e.g. `C:\Projects\Decyde`.
 *   3. In that location, delete any existing `node_modules` and run
 *      `npm install` fresh.
 *   4. If you must keep the project under OneDrive, exclude `node_modules`
 *      from sync (OneDrive → Settings → Account → Choose folders).
 *
 * Do NOT commit `.env.local`. If it ever got created as a FOLDER by mistake,
 * delete it (`rmdir /s /q .env.local`) and recreate it as a FILE by copying
 * `.env.example` to `.env.local`.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  AnalyzeResponse,
  DecydeInput,
  isDecydeAnalysis,
  RiskLevel,
} from '@/lib/types';
import {
  DEFAULT_MODEL,
  REQUEST_TIMEOUT_MS,
  SYSTEM_PROMPT,
  buildUserPrompt,
} from '@/lib/prompt';

/** Mask an API key for safe logging: shows only prefix + last 4 chars. */
function maskKey(key: string | undefined): string {
  if (!key) return '(missing)';
  if (key.length < 12) return '***';
  return `${key.slice(0, 8)}…${key.slice(-4)}`;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_RISK: RiskLevel[] = ['Low', 'Medium', 'High'];
const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

function validate(body: unknown): DecydeInput | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Request body must be a JSON object.' };
  }
  const b = body as Record<string, unknown>;
  const str = (k: string) =>
    typeof b[k] === 'string' ? (b[k] as string).trim() : '';

  const input: DecydeInput = {
    workflowDescription: str('workflowDescription'),
    industry: str('industry'),
    currentProcess: str('currentProcess'),
    painPoint: str('painPoint'),
    monthlyVolume: str('monthlyVolume'),
    riskLevel: (VALID_RISK.includes(b.riskLevel as RiskLevel)
      ? (b.riskLevel as RiskLevel)
      : 'Medium') as RiskLevel,
    currentTools: str('currentTools'),
    desiredOutcome: str('desiredOutcome'),
  };

  if (!input.workflowDescription) {
    return { error: 'workflowDescription is required.' };
  }
  if (input.workflowDescription.length < 20) {
    return {
      error:
        'workflowDescription is too short — please describe the workflow in at least a sentence or two.',
    };
  }
  if (input.workflowDescription.length > 8000) {
    return { error: 'workflowDescription exceeds the 8000-character limit.' };
  }
  return input;
}

function extractJson(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) return fenced[1].trim();

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return null;
}

interface AnthropicResponse {
  id?: string;
  type?: string;
  role?: string;
  model?: string;
  content?: Array<{ type: string; text?: string }>;
  stop_reason?: string;
  error?: { type: string; message: string };
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  const reqId = Math.random().toString(36).slice(2, 8);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  console.log(`[Decyde:${reqId}] analyze request received`, {
    hasKey: !!apiKey,
    keyPreview: maskKey(apiKey),
    model: DEFAULT_MODEL,
    timeoutMs: REQUEST_TIMEOUT_MS,
  });

  if (!apiKey) {
    console.error(
      `[Decyde:${reqId}] ANTHROPIC_API_KEY is missing — check .env.local is a FILE (not a folder) and contains the key.`,
    );
    return NextResponse.json<AnalyzeResponse>(
      {
        ok: false,
        code: 'MISSING_KEY',
        error:
          'Server is missing ANTHROPIC_API_KEY. Set it in .env.local or your Vercel project settings.',
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, code: 'INVALID_INPUT', error: 'Request body is not valid JSON.' },
      { status: 400 },
    );
  }

  const validated = validate(body);
  if ('error' in validated) {
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, code: 'INVALID_INPUT', error: validated.error },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(
      `[Decyde:${reqId}] upstream timeout after ${REQUEST_TIMEOUT_MS}ms — aborting`,
    );
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    console.log(`[Decyde:${reqId}] calling Anthropic →`, {
      endpoint: ANTHROPIC_ENDPOINT,
      model: DEFAULT_MODEL,
    });
    const upstream = await fetch(ANTHROPIC_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 3000,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: buildUserPrompt(validated) },
        ],
      }),
    });

    clearTimeout(timeoutId);

    console.log(`[Decyde:${reqId}] Anthropic responded`, {
      status: upstream.status,
      ok: upstream.ok,
      elapsedMs: Date.now() - started,
    });

    const data = (await upstream.json().catch(() => null)) as
      | AnthropicResponse
      | null;

    if (!upstream.ok) {
      const msg =
        data?.error?.message ??
        `Anthropic API returned HTTP ${upstream.status}.`;
      console.error(`[Decyde:${reqId}] upstream error`, { status: upstream.status, msg });
      return NextResponse.json<AnalyzeResponse>(
        { ok: false, code: 'UPSTREAM_ERROR', error: msg },
        { status: 502 },
      );
    }

    const raw = data?.content?.[0]?.text ?? '';
    if (!raw) {
      console.error(`[Decyde:${reqId}] empty response from Anthropic`);
      return NextResponse.json<AnalyzeResponse>(
        { ok: false, code: 'UPSTREAM_ERROR', error: 'Anthropic returned an empty response.' },
        { status: 502 },
      );
    }

    const json = extractJson(raw);
    if (!json) {
      console.error(`[Decyde:${reqId}] no JSON object found in response`, {
        preview: raw.slice(0, 160),
      });
      return NextResponse.json<AnalyzeResponse>(
        { ok: false, code: 'PARSE_ERROR', error: 'Could not locate a JSON object in the model response.' },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch (err) {
      console.error(`[Decyde:${reqId}] JSON.parse failed`, {
        error: (err as Error).message,
        preview: json.slice(0, 160),
      });
      return NextResponse.json<AnalyzeResponse>(
        {
          ok: false,
          code: 'PARSE_ERROR',
          error: `Failed to parse model JSON: ${(err as Error).message}`,
        },
        { status: 502 },
      );
    }

    if (!isDecydeAnalysis(parsed)) {
      console.error(`[Decyde:${reqId}] schema validation failed — model returned wrong shape`);
      return NextResponse.json<AnalyzeResponse>(
        { ok: false, code: 'PARSE_ERROR', error: 'Model response did not match the required Decyde schema.' },
        { status: 502 },
      );
    }

    console.log(`[Decyde:${reqId}] parse + validate OK`, {
      totalMs: Date.now() - started,
      recommendation: parsed.recommendation?.type,
      score: parsed.aiFitScore?.score,
    });

    return NextResponse.json<AnalyzeResponse>(
      {
        ok: true,
        analysis: parsed,
        model: data?.model ?? DEFAULT_MODEL,
        latencyMs: Date.now() - started,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const e = err as { name?: string; message?: string };
    const isTimeout =
      e?.name === 'AbortError' || /aborted|timeout/i.test(e?.message ?? '');
    console.error(`[Decyde:${reqId}] ${isTimeout ? 'TIMEOUT' : 'UPSTREAM_ERROR'}`, {
      name: e?.name,
      message: e?.message,
      elapsedMs: Date.now() - started,
    });
    return NextResponse.json<AnalyzeResponse>(
      {
        ok: false,
        code: isTimeout ? 'TIMEOUT' : 'UPSTREAM_ERROR',
        error: isTimeout
          ? `Request exceeded ${REQUEST_TIMEOUT_MS}ms timeout. Please try again.`
          : e?.message ?? 'Unknown error calling Anthropic.',
      },
      { status: isTimeout ? 504 : 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Decyde',
    endpoint: '/api/analyze',
    method: 'POST',
    provider: 'Anthropic',
    hint: 'POST a DecydeInput JSON body to receive a structured analysis.',
  });
}
