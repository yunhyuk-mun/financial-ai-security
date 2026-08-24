"use client";

import { useState } from "react";
import { getTransactionExamples, scoreTransaction, type TransactionScore } from "@/lib/api";
import { RiskGauge, riskColorHex } from "@/components/RiskGauge";

export function TransactionDemo() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string; label: string; score: TransactionScore } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(key: "normal" | "fraud") {
    setLoadingKey(key);
    setError(null);
    try {
      const examples = await getTransactionExamples();
      const example = examples.find((e) => e.key === key);
      if (!example) throw new Error("example not found");
      const score = await scoreTransaction(example.features);
      setResult({ key, label: example.label, score });
    } catch (e) {
      setError(e instanceof Error ? e.message : "실행 중 오류가 발생했어요");
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-semibold">이상거래 탐지 체험</h2>
        <p className="text-slate-400 text-xs mt-1">
          공개 신용카드 거래 데이터셋에서 뽑은 실제 거래 샘플로, 정형 데이터 기반
          탐지 모델(XGBoost)을 바로 테스트해볼 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => run("normal")}
          disabled={loadingKey !== null}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-slate-500 disabled:opacity-40 transition-colors"
        >
          {loadingKey === "normal" ? "채점 중..." : "정상 거래 샘플로 테스트"}
        </button>
        <button
          onClick={() => run("fraud")}
          disabled={loadingKey !== null}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-slate-500 disabled:opacity-40 transition-colors"
        >
          {loadingKey === "fraud" ? "채점 중..." : "이상거래 샘플로 테스트"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <div
          className="rounded-lg border p-4 flex items-center gap-4"
          style={{
            borderColor: `${riskColorHex(result.score.risk_score)}66`,
            backgroundColor: `${riskColorHex(result.score.risk_score)}0d`,
          }}
        >
          <RiskGauge score={result.score.risk_score} size={64} />
          <div>
            <p className="text-xs text-slate-400">{result.label}</p>
            <p className="font-semibold" style={{ color: riskColorHex(result.score.risk_score) }}>
              {result.score.is_anomalous ? "이상거래로 탐지됨" : "정상 거래로 판단됨"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
