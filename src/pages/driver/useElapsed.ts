import { useEffect, useState } from 'react';

export function useElapsed(from: number | null): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (from == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [from]);

  if (from == null) return 0;
  return Math.max(0, now - from);
}