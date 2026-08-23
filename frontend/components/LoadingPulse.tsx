"use client";

import { useEffect, useState } from "react";

const DEFAULT_MESSAGES = [
  "메시지 패턴 분석 중...",
  "위험 신호 탐지 중...",
  "유사 사기 사례 대조 중...",
  "AI 생성 여부 판별 중...",
];

export function LoadingPulse({ messages = DEFAULT_MESSAGES }: { messages?: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 2200);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
      </span>
      {messages[idx]}
    </div>
  );
}
