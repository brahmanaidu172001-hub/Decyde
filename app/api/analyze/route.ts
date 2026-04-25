import { NextRequest, NextResponse } from 'next/server';
import type { AnalyzeResponse, DecydeInput } from '@/lib/types';
import {
  ANTHROPIC_MODEL,
  REQUEST_TIMEOUT_MS,
  buildPrompt,
} from '@/lib/prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

/** Mask an API key for safe logging: prefix plus last 4. */
function maskKey(key: string | undefined): string {
  if (!key) return '(missing)';
  if (key.length < 12) return '***';
  return `${key.slice(0, 8)}…${key.slice(-4)}`;
}

/** Best-effort JSON extraction: raw object, ```json fenced, or embedded. */
function extractJson(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith('{') && t.endsWith('}')) return t;
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) return fenced[1].trim();
  const s = t.indexOf('{');
  const e = t.lastIndexOf('}');
  if (s !== -1 && e !== -1 && e > s) return t.slice(s, e + 1);
  return null;
}

interface AnthropicResponse {
  model?: string;
  content?: Array<{ type: string; text?: string }>;
  error?: { type: string; message: string };
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<AnalyzeResponse>> {
  const reqId = Math.random().toString(36).slice(2, 8);
  const started = Date.now();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  console.log(`[Decyde:${reqId}] request received`, {
    hasKey: !!apiKey,
    keyPreview: maskKey(apiKey),
    model: ANTHROPIC_MODEL,
  });

  if (!apiKey) {
    return NextResponse.json<AnalyzeResponse>(
      {
        ok: false,
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
      { ok: false, error: 'Request body is not valid JSON.' },
      { status: 400 },
    );
  }

  const b = (body ?? {}) as Partial<DecydeInput>;
  const workflowDescription =
    typeof b.workflowDescription === 'string' ? b.workflowDescription.trim() : '';

  if (!workflowDescription) {
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, error: 'workflowDescription is required.' },
      { status: 400 },
    );
  }

  const input: DecydeInput = {
    workflowDescription,
    industry: typeof b.industry === 'string' ? b.industry : '',
    currentProcess: typeof b.currentProcess === 'string' ? b.currentProcess : '',
    painPoint: typeof b.painPoint === 'string' ? b.painPoint : '',
    desiredOutcome:
      typeof b.desiredOutcome === 'string' ? b.desiredOutcome : '',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(ANTHROPIC_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1200,
        temperature: 0,
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: buildPrompt(input) }],
          },
        ],
      }),
    });
    clearTimeout(timeoutId);

    const data = (await res.json().catch(() => null)) as
      | AnthropicResponse
      | null;

    console.log(`[Decyde:${reqId}] anthropic responded`, {
      status: res.status,
      ok: res.ok,
      elapsedMs: Date.now() - started,
    });

    if (!res.ok) {
      const msg =
        data?.error?.message ?? `Anthropic API returned HTTP ${res.status}.`;
      console.error(`[Decyde:${reqId}] upstream error`, {
        status: res.status,
        msg,
      });
      return NextResponse.json<AnalyzeResponse>(
        { ok: false, error: msg },
        { status: 502 },
      );
    }

    const rawText = data?.content?.[0]?.text ?? '';
    console.log(`[Decyde:${reqId}] raw preview`, {
      length: rawText.length,
      preview: rawText.slice(0, 200),
    });

    if (!rawText) {
      return NextResponse.json<AnalyzeResponse>(
        { ok: false, error: 'Anthropic returned an empty response.' },
        { status: 502 },
      );
    }

    const jsonStr = extractJson(rawText);
    if (!jsonStr) {
      return NextResponse.json<AnalyzeResponse>(
        {
          ok: true,
          analysis: null,
          rawText,
          warning: 'Model returned non-JSON output',
        },
        { status: 200 },
      );
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json<AnalyzeResponse>(
        { ok: true, analysis: parsed, rawText },
        { status: 200 },
      );
    } catch (err) {
      console.warn(`[Decyde:${reqId}] JSON.parse failed`, {
        error: (err as Error).message,
      });
      return NextResponse.json<AnalyzeResponse>(
        {
          ok: true,
          analysis: null,
          rawText,
          warning: 'Model returned non-JSON output',
        },
        { status: 200 },
      );
    }
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const e = err as { name?: string; message?: string };
    const isTimeout =
      e?.name === 'AbortError' || /aborted|timeout/i.test(e?.message ?? '');
    console.error(`[Decyde:${reqId}] error`, {
      name: e?.name,
      message: e?.message,
      elapsedMs: Date.now() - started,
    });
    return NextResponse.json<AnalyzeResponse>(
      {
        ok: false,
        error: isTimeout
          ? 'Request timed out. Try a shorter workflow or test again.'
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
  });
}
