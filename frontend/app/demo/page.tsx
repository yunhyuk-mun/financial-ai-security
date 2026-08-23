"use client";

import { useState } from "react";
import {
  analyzeMessage,
  generateRedteamSample,
  type MessageAnalysis,
  type RedteamSample,
} from "@/lib/api";

type Round = {
  sample: RedteamSample;
  analysis: MessageAnalysis | null;
};

export default function DemoPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runRound() {
    setBusy(true);
    setError(null);
    try {
      const sample = await generateRedteamSample();
      setRounds((r) => [{ sample, analysis: null }, ...r]);
      const analysis = await analyzeMessage(sample.sample_text);
      setRounds((r) => {
        const [first, ...rest] = r;
        return [{ ...first, analysis }, ...rest];
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "실행 중 오류가 발생했어요");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">레드팀 vs 블루팀 라이브 데모</h1>
        <p className="text-slate-400 mt-1 text-sm">
          레드팀 AI가 그 자리에서 새로운 금융 사기 샘플을 만들어내고, 블루팀 AI가
          그것을 즉시 탐지합니다. (샘플은 데모 전용 가상 콘텐츠이며 실제 인물/기관과
          무관합니다)
        </p>
      </div>

      <button
        onClick={runRound}
        disabled={busy}
        className="self-start rounded-lg bg-slate-100 text-slate-900 px-5 py-2 text-sm font-medium disabled:opacity-40"
      >
        {busy ? "실행 중..." : "새 공격 시뮬레이션 실행"}
      </button>

      {error && (
        <p className="text-sm text-red-400 border border-red-500/40 bg-red-500/10 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {rounds.map((round, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-orange-500/40 bg-orange-500/5 p-4">
              <span className="text-xs font-semibold text-orange-400">
                레드팀 · {round.sample.attack_type}
              </span>
              <p className="mt-2 text-sm text-slate-200">{round.sample.sample_text}</p>
            </div>
            <div className="rounded-lg border border-sky-500/40 bg-sky-500/5 p-4">
              <span className="text-xs font-semibold text-sky-400">블루팀 탐지 결과</span>
              {round.analysis ? (
                <>
                  <p className="mt-2 text-sm font-medium">
                    위험도 {Math.round(round.analysis.risk_score * 100)}% ·{" "}
                    {round.analysis.is_likely_scam ? "사기로 탐지됨" : "안전으로 판단됨"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{round.analysis.reasoning}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-400">분석 중...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
