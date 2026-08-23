"use client";

export function riskColorHex(score: number) {
  if (score >= 0.7) return "#f87171";
  if (score >= 0.3) return "#fbbf24";
  return "#34d399";
}

export function RiskGauge({ score, size = 96 }: { score: number; size?: number }) {
  const pct = Math.round(score * 100);
  const color = riskColorHex(score);
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.max(0, Math.min(1, score)));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s ease, stroke 0.9s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums" style={{ color }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}
