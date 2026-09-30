import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/learning/Navigation";
import "katex/dist/katex.min.css";
import "./globals.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Options — A field guide to learning",
  description: "A field guide to the published options curriculum.",
  robots: { index: false, follow: false },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme =
    (await cookies()).get("theme")?.value === "dark" ? "dark" : "light";
  return (
    <html lang="en" data-theme={theme}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link
            className="wordmark"
            href="/"
            prefetch={false}
            aria-label="Options home"
          >
            <strong>Options</strong>
            <span>A field guide to learning</span>
          </Link>
          <Navigation />
          <ThemeToggle initial={theme} />
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <p>Education and simulation. No trade execution.</p>
          <p>Learning begins with understanding obligations.</p>
        </footer>
      </body>
    </html>
  );
}
