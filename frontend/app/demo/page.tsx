"use client";

import { useEffect, useRef, useState } from "react";
import {
  analyzeMessage,
  generateRedteamSample,
  getGuidance,
  type Guidance,
  type MessageAnalysis,
  type RedteamSample,
} from "@/lib/api";
import { riskColorHex } from "@/components/RiskGauge";
import { LoadingPulse } from "@/components/LoadingPulse";
import { Typewriter } from "@/components/Typewriter";

type Round = {
  sample: RedteamSample;
  analysis: MessageAnalysis | null;
  guidance: Guidance | null;
};

export default function DemoPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoRunTriggered = useRef(false);

  const detectedCount = rounds.filter((r) => r.analysis?.is_likely_scam).length;

  function patchFirst(patch: Partial<Round>) {
    setRounds((r) => {
      const [first, ...rest] = r;
      return [{ ...first, ...patch }, ...rest];
    });
  }

  async function runRound() {
    setBusy(true);
    setError(null);
    try {
      const sample = await generateRedteamSample();
      setRounds((r) => [{ sample, analysis: null, guidance: null }, ...r]);

      const analysis = await analyzeMessage(sample.sample_text);
      patchFirst({ analysis });

      const guidance = await getGuidance(analysis.risk_score, sample.sample_text);
      patchFirst({ guidance });
    } catch (e) {
      setError(e instanceof Error ? e.message : "실행 중 오류가 발생했어요");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (autoRunTriggered.current) return;
    autoRunTriggered.current = true;
    runRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">레드팀 vs 블루팀 라이브 데모</h1>
          <p className="text-slate-400 mt-1 text-sm max-w-xl">
            레드팀 AI가 그 자리에서 새로운 금융 사기 샘플을 만들어내고, 블루팀 AI가
            그것을 즉시 탐지합니다. (샘플은 데모 전용 가상 콘텐츠이며 실제 인물/기관과
            무관합니다) 아래 예시는 페이지에 들어오면 자동으로 한 번 실행됩니다.
          </p>
        </div>
        {rounds.length > 0 && (
          <div className="shrink-0 text-right rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <div className="text-2xl font-black text-sky-400 tabular-nums">{detectedCount}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">건 탐지됨</div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={runRound}
          disabled={busy}
          className="rounded-lg bg-slate-100 text-slate-900 px-5 py-2 text-sm font-medium disabled:opacity-40 hover:bg-white transition-colors"
        >
          {busy ? "실행 중..." : "새 공격 시뮬레이션 실행"}
        </button>
        {busy && <LoadingPulse messages={["레드팀이 공격을 설계하는 중...", "블루팀이 대응하는 중..."]} />}
      </div>

      {error && (
        <p className="text-sm text-red-400 border border-red-500/40 bg-red-500/10 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-6">
        {rounds.map((round, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
            {/* Red team card */}
            <div className="rounded-xl border-l-4 border-orange-500 bg-slate-900 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-400 tracking-wide uppercase">
                  레드팀 · {round.sample.attack_type}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-50 leading-relaxed min-h-[3em]">
                {i === 0 ? <Typewriter text={round.sample.sample_text} /> : round.sample.sample_text}
              </p>
            </div>

            {/* VS divider */}
            <div className="hidden md:flex flex-col items-center justify-center text-slate-600 font-black text-lg">
              VS
            </div>

            {/* Blue team card */}
            <div className="relative overflow-hidden rounded-xl border-l-4 border-sky-500 bg-slate-900 p-4 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                <span className="text-xs font-bold text-sky-400 tracking-wide uppercase">블루팀 탐지 결과</span>
              </div>
              {round.analysis ? (
                <>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="animate-stamp-in inline-block text-[10px] font-black tracking-wider uppercase border-2 rounded px-2 py-0.5"
                      style={{
                        color: riskColorHex(round.analysis.risk_score),
                        borderColor: riskColorHex(round.analysis.risk_score),
                      }}
                    >
                      {round.analysis.is_likely_scam ? "탐지 완료" : "안전 확인"}
                    </span>
                  </div>
                  <p
                    className="mt-2 text-sm font-bold"
                    style={{ color: riskColorHex(round.analysis.risk_score) }}
                  >
                    위험도 {Math.round(round.analysis.risk_score * 100)}%
                  </p>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{round.analysis.reasoning}</p>
                  {round.guidance ? (
                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
                      <span className="inline-block rounded-full bg-sky-500/15 text-sky-300 px-2 py-1 font-medium">
                        권장 조치 · {round.guidance.risk_level}
                      </span>
                      <p className="mt-2 text-slate-300">{round.guidance.steps[0]}</p>
                    </div>
                  ) : (
                    <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500">
                      대응 요령 생성 중...
                    </p>
                  )}
                </>
              ) : (
                <div className="relative flex-1 min-h-[4rem]">
                  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-scan-line" />
                  <p className="mt-3 text-sm text-slate-400">탐지 중...</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
