/**
 * medical-context.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds the patient-specific medical context that Gemini receives alongside
 * ChromaDB knowledge-base chunks.
 *
 * Current data source:
 *   • Structured MedicalRecord rows from Prisma (title, type, description,
 *     date, doctorName, hospitalName)
 *
 * Future data sources (plug in here when ready):
 *   • OCR-extracted JSON from uploaded report files (fileUrl field)
 *   • Parsed lab values / vitals from OCR pipeline
 *   • Wearable sensor data
 *
 * The function returns BOTH a formatted string for the AI prompt AND a
 * structured array of source references shown to the user in the UI.
 */

import { prisma } from '@/lib/prisma';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MedicalRecordSource {
  id: string;
  label: string;       // e.g. "Blood Report — 12 Jan 2024"
  type: string;        // e.g. "LAB_RESULT"
  fromOcr: boolean;    // true once OCR pipeline is active
}

export interface PatientMedicalContext {
  /** Formatted text block injected into Gemini's system prompt */
  contextText: string;
  /** Structured list for the UI source panel */
  sources: MedicalRecordSource[];
  /** True when at least one record was found */
  hasData: boolean;
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Fetch and format the patient's medical records for Gemini context.
 * Always resolves (never throws) — returns empty context on error so
 * the chat route degrades gracefully.
 */
export async function getPatientMedicalContext(
  userId: string,
): Promise<PatientMedicalContext> {
  if (!userId) {
    return { contextText: '', sources: [], hasData: false };
  }

  try {
    const records = await prisma.medicalRecord.findMany({
      where: { patientId: userId },
      orderBy: { createdAt: 'desc' },
      take: 10, // cap at 10 most-recent records to keep the prompt sane
    });

    if (records.length === 0) {
      return { contextText: '', sources: [], hasData: false };
    }

    const sources: MedicalRecordSource[] = [];
    const lines: string[] = ['== PATIENT MEDICAL RECORDS =='];

    for (const rec of records) {
      const label = `${rec.title} — ${rec.date}`;
      sources.push({
        id: rec.id,
        label,
        type: rec.type,
        fromOcr: false, // TODO: set to true when ocrData field is populated
      });

      lines.push(`\n[Record: ${label}]`);
      lines.push(`Type: ${rec.type}`);
      if (rec.doctorName)   lines.push(`Doctor: ${rec.doctorName}`);
      if (rec.hospitalName) lines.push(`Hospital: ${rec.hospitalName}`);
      if (rec.description)  lines.push(`Details: ${rec.description}`);

      // ── FUTURE OCR DATA SLOT ──────────────────────────────────────────────
      // When the OCR pipeline is active, each MedicalRecord will have an
      // `ocrData` JSON field (or enriched `description`) containing structured
      // values extracted from the uploaded PDF/image (e.g., lab values, vitals,
      // diagnoses). Insert it here:
      //
      // if (rec.ocrData) {
      //   const parsed = JSON.parse(rec.ocrData as string);
      //   lines.push(`Extracted Data: ${JSON.stringify(parsed, null, 2)}`);
      //   sources[sources.length - 1].fromOcr = true;
      // }
      // ─────────────────────────────────────────────────────────────────────
    }

    lines.push('\n== END PATIENT RECORDS ==');

    return {
      contextText: lines.join('\n'),
      sources,
      hasData: true,
    };
  } catch (err) {
    console.error('[MedicalContext] Failed to fetch records:', err);
    return { contextText: '', sources: [], hasData: false };
  }
}
