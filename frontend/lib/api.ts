const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${path} failed (${res.status}): ${detail}`);
  }
  return res.json();
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${path} failed (${res.status}): ${detail}`);
  }
  return res.json();
}

export interface MessageAnalysis {
  risk_score: number;
  is_likely_scam: boolean;
  reasoning: string;
  red_flags: string[];
}

export interface Guidance {
  risk_level: string;
  steps: string[];
}

export interface RedteamSample {
  sample_text: string;
  attack_type: string;
}

export interface TransactionScore {
  risk_score: number;
  is_anomalous: boolean;
}

export interface ExampleTransaction {
  key: string;
  label: string;
  features: number[];
}

export function analyzeMessage(text: string) {
  return post<MessageAnalysis>("/api/messages/analyze", { text });
}

export function getGuidance(riskScore: number, context: string) {
  return post<Guidance>("/api/guidance/", { risk_score: riskScore, context });
}

export function generateRedteamSample() {
  return post<RedteamSample>("/api/redteam/generate", {});
}

export function getTransactionExamples() {
  return get<ExampleTransaction[]>("/api/transactions/examples");
}

export function scoreTransaction(features: number[]) {
  return post<TransactionScore>("/api/transactions/score", { features });
}
