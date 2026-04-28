// =========================
// Types
// =========================

// Replace the old TelemetryPayload interface with this:
export interface TelemetryPayload {
  voltageA: number;
  voltageB: number;
  voltageC: number;
  currentA: number;
  currentB: number;
  currentC: number;
  seqPositive: number;
  seqNegative: number;
  seqZero: number;
  activePower: number;
  reactivePower: number;
  sysVoltageLevel: number;
  xrRatio: number;
  nominalFreq: number;
  faultMVA: number;
}

// Keep your function signature the same, it will now expect the new keys:
// export const runDiagnosticAnalysis = async (payload: TelemetryPayload): Promise<DiagnosticResponse> => { ... }
export interface DiagnosticResponse {
  status: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NORMAL";
  confidence: number;
  fault_localization: string;
  diagnostic_reasoning: string[];
  analysis: string;
  recommended_actions: { action: string; urgency: string }[];
}

// =========================
// Environment Helper
// =========================

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL_V2 ?? "";

// =========================
// API Call
// =========================

export async function runDiagnosticAnalysis(
  payload: TelemetryPayload,
): Promise<DiagnosticResponse> {
  const response = await fetch(API_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AWS Error Response:", errorText);
    throw new Error(
      errorText || `Request failed with status ${response.status}`,
    );
  }

  // Strongly type the JSON response
  const data: DiagnosticResponse = await response.json();

  return data;
}
