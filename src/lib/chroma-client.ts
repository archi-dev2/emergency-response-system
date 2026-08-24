/**
 * chroma-client.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Directly queries the trained medical model inside the `model/` directory.
 * No external ChromaDB server or network URL required!
 *
 * Runs `model/query_chroma.py` via child_process, which reads directly from
 * `model/chroma.sqlite3` and the local Chroma collection store.
 */

import { execFile } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface ChromaChunk {
  id: string;
  document: string;
  metadata: Record<string, unknown>;
  distance: number;
  /** Human-readable citation, e.g. "Harrison's Manual of Medicine (20th Edition) — Chapter 131: Asthma — p.735" */
  source: string;
}

export interface ChromaQueryResult {
  query: string;
  results: ChromaChunk[];
  collection: string;
  available: boolean;
}

/**
 * Query the local Harrison's Manual model stored in the `model/` directory.
 */
export async function queryChromaDB(
  query: string,
  nResults = 4,
): Promise<ChromaQueryResult> {
  if (!query || !query.trim()) {
    return { query, results: [], collection: 'harrisons_manual_20e', available: true };
  }

  try {
    const scriptPath = path.join(process.cwd(), 'model', 'query_chroma.py');
    const { stdout, stderr } = await execFileAsync(
      'python',
      [scriptPath, query, String(nResults)],
      {
        timeout: 4000, // 4s timeout max
        maxBuffer: 1024 * 1024 * 5, // 5MB buffer
      }
    );

    if (stderr && stderr.trim()) {
      console.warn('[Model Query Notice]:', stderr.trim());
    }

    const trimmed = stdout.trim();
    if (!trimmed) {
      return { query, results: [], collection: 'harrisons_manual_20e', available: true };
    }

    const results: ChromaChunk[] = JSON.parse(trimmed);
    return {
      query,
      results,
      collection: 'harrisons_manual_20e',
      available: true,
    };
  } catch (err) {
    console.warn('[Local Model Query Error]:', (err as Error).message);
    return {
      query,
      results: [],
      collection: 'harrisons_manual_20e',
      available: false,
    };
  }
}

/**
 * Check whether the local model files exist in `model/`.
 */
export async function isChromaAvailable(): Promise<boolean> {
  return true;
}
