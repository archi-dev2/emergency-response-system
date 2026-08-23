/**
 * chroma-client.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin TypeScript wrapper around the LifeLink ChromaDB HTTP sidecar.
 * The sidecar (model/chroma_server.py) must be running on CHROMA_SERVER_URL.
 *
 * Usage:
 *   import { queryChromaDB } from '@/lib/chroma-client';
 *   const results = await queryChromaDB('fever management', 4);
 */

export interface ChromaChunk {
  id: string;
  document: string;
  metadata: Record<string, unknown>;
  distance: number;
  /** Human-readable citation, e.g. "Harrison's Manual 20e — Infectious Disease, p.123" */
  source: string;
}

export interface ChromaQueryResult {
  query: string;
  results: ChromaChunk[];
  collection: string;
  available: boolean; // false when sidecar is unreachable (graceful degradation)
}

const CHROMA_URL = process.env.CHROMA_SERVER_URL ?? 'http://localhost:8001';

/**
 * Query the Harrison's Manual ChromaDB knowledge base.
 * Returns an empty result set (never throws) when the sidecar is unavailable,
 * so the chat route degrades gracefully to Gemini-only mode.
 */
export async function queryChromaDB(
  query: string,
  nResults = 4,
): Promise<ChromaQueryResult> {
  try {
    const res = await fetch(`${CHROMA_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, n_results: nResults }),
      signal: AbortSignal.timeout(5_000), // 5 s timeout — don't block chat
    });

    if (!res.ok) {
      console.warn(`[ChromaDB] Sidecar returned ${res.status}; degrading gracefully`);
      return { query, results: [], collection: 'unavailable', available: false };
    }

    const data = await res.json();
    return { ...data, available: true };
  } catch (err) {
    // Sidecar not running or network error — degrade silently
    console.warn('[ChromaDB] Sidecar unreachable:', (err as Error).message);
    return { query, results: [], collection: 'unavailable', available: false };
  }
}

/**
 * Check whether the ChromaDB sidecar is online.
 */
export async function isChromaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${CHROMA_URL}/health`, {
      signal: AbortSignal.timeout(2_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
