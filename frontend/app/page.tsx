"use client";

import { useState } from "react";
import {
  analyzeMessage,
  getGuidance,
  type MessageAnalysis,
  type Guidance,
} from "@/lib/api";

function riskColor(score: number) {
  if (score >= 0.7) return "text-red-400 border-red-500/40 bg-red-500/10";
  if (score >= 0.3) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
  return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
}

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MessageAnalysis | null>(null);
  const [guidance, setGuidance] = useState<Guidance | null>(null);

  async function handleAnalyze() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setGuidance(null);
    try {
      const result = await analyzeMessage(text);
      setAnalysis(result);
      const g = await getGuidance(result.risk_score, text);
      setGuidance(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "분석 중 오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">의심스러운 문자·메시지 분석</h1>
        <p className="text-slate-400 mt-1 text-sm">
          받은 문자, 투자 리딩방 홍보, 카카오톡 메시지 등을 그대로 붙여넣으면
          AI가 사기/피싱 위험도를 분석하고 대응 요령을 안내합니다.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="예: [긴급] OO증권 리딩방 특별 초대! 3일만에 원금 300% 보장..."
        rows={6}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm outline-none focus:border-slate-500"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="self-start rounded-lg bg-slate-100 text-slate-900 px-5 py-2 text-sm font-medium disabled:opacity-40"
      >
        {loading ? "분석 중..." : "분석하기"}
      </button>

      {error && (
        <p className="text-sm text-red-400 border border-red-500/40 bg-red-500/10 rounded-lg p-3">
          {error}
        </p>
      )}

      {analysis && (
        <div className={`rounded-lg border p-4 ${riskColor(analysis.risk_score)}`}>
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">
              위험도 {Math.round(analysis.risk_score * 100)}%
            </span>
            <span className="text-sm">
              {analysis.is_likely_scam ? "사기 의심" : "안전"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-200">{analysis.reasoning}</p>
          {analysis.red_flags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {analysis.red_flags.map((flag, i) => (
                <li
                  key={i}
                  className="text-xs rounded-full border border-current px-2 py-1"
                >
                  {flag}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {guidance && (
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <h2 className="font-semibold">
            대응 요령 <span className="text-slate-400 text-sm">({guidance.risk_level})</span>
          </h2>
          <ol className="mt-2 flex flex-col gap-2 text-sm text-slate-200 list-decimal list-inside">
            {guidance.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
