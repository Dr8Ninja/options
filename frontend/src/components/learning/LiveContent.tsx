"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export function LiveContent({
  generation,
  stamp,
  children,
}: {
  generation: string;
  stamp: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [blockedAt, setBlockedAt] = useState<string | null>(null);
  const blocked = blockedAt === stamp;
  useEffect(() => {
    let active = true,
      busy = false;
    async function check() {
      if (document.visibilityState !== "visible" || busy) return;
      busy = true;
      try {
        const response = await fetch("/api/v1/content-version", {
          cache: "no-store",
          credentials: "omit",
          redirect: "error",
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error("Unavailable");
        const current = await response.json();
        if (active && current.generation !== generation) setBlockedAt(stamp);
      } catch {
        if (active) setBlockedAt(stamp);
      } finally {
        if (active) router.refresh();
        busy = false;
      }
    }
    const timer = window.setInterval(check, 30000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [generation, router, stamp]);
  return blocked ? (
    <section className="notice" role="status">
      <h2>Checking this publication</h2>
      <p>The material is hidden until its availability can be confirmed.</p>
      <a href="">Reload this page</a>
    </section>
  ) : (
    children
  );
}
