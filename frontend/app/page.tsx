"use client";

import { useState } from "react";
import {
  analyzeMessage,
  getGuidance,
  type MessageAnalysis,
  type Guidance,
} from "@/lib/api";
import { RiskGauge, riskColorHex } from "@/components/RiskGauge";
import { LoadingPulse } from "@/components/LoadingPulse";

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
    <div className="flex flex-col">
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900/60 to-transparent">
        <div className="mx-auto max-w-2xl px-6 py-12 text-center flex flex-col items-center gap-3">
          <span className="text-xs font-medium tracking-wide text-sky-400 uppercase">
            AI Red Team vs AI Blue Team
          </span>
          <h1 className="text-3xl font-bold">AI 금융보안 비서</h1>
          <p className="text-slate-400 text-sm max-w-md">
            생성형 AI가 만든 사기를 생성형 AI로 잡아냅니다. 받은 문자·투자
            리딩방 홍보·카카오톡 메시지를 붙여넣으면 위험도와 대응 요령을
            즉시 알려드려요.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl w-full px-6 py-10 flex flex-col gap-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: [긴급] OO증권 리딩방 특별 초대! 3일만에 원금 300% 보장..."
          rows={6}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm outline-none focus:border-sky-500 transition-colors"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="rounded-lg bg-slate-100 text-slate-900 px-5 py-2 text-sm font-medium disabled:opacity-40 hover:bg-white transition-colors"
          >
            {loading ? "분석 중..." : "분석하기"}
          </button>
          {loading && <LoadingPulse />}
        </div>

        {error && (
          <p className="text-sm text-red-400 border border-red-500/40 bg-red-500/10 rounded-lg p-3">
            {error}
          </p>
        )}

        {analysis && (
          <div
            className="rounded-lg border p-5 flex gap-4 items-start"
            style={{
              borderColor: `${riskColorHex(analysis.risk_score)}66`,
              backgroundColor: `${riskColorHex(analysis.risk_score)}0d`,
            }}
          >
            <RiskGauge score={analysis.risk_score} />
            <div className="flex-1 min-w-0">
              <span
                className="font-semibold"
                style={{ color: riskColorHex(analysis.risk_score) }}
              >
                {analysis.is_likely_scam ? "사기 의심" : "안전"}
              </span>
              <p className="mt-2 text-sm text-slate-100 leading-relaxed">{analysis.reasoning}</p>
              {analysis.red_flags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {analysis.red_flags.map((flag, i) => (
                    <li
                      key={i}
                      className="text-xs rounded-full border px-2 py-1 text-slate-200"
                      style={{ borderColor: `${riskColorHex(analysis.risk_score)}66` }}
                    >
                      {flag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {guidance && (
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold">
              대응 요령 <span className="text-slate-400 text-sm">({guidance.risk_level})</span>
            </h2>
            <ol className="mt-2 flex flex-col gap-2 text-sm text-slate-100 list-decimal list-inside">
              {guidance.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
