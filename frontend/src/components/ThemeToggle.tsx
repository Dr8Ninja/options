"use client";
import { useState } from "react";
export function ThemeToggle({ initial }: { initial: "light" | "dark" }) {
  const [theme, setTheme] = useState(initial);
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document.cookie = `theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    setTheme(next);
  }
  return (
    <button type="button" onClick={toggle} aria-pressed={theme === "dark"}>
      Dark appearance
    </button>
  );
}
