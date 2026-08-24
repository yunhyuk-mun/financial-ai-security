"use client";

import { useEffect, useState } from "react";

export function Typewriter({ text, speedMs = 12 }: { text: string; speedMs?: number }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);

  const done = shown.length >= text.length;

  return (
    <span>
      {shown}
      {!done && <span className="inline-block w-[2px] h-[1em] bg-orange-400 ml-0.5 align-middle animate-pulse" />}
    </span>
  );
}
