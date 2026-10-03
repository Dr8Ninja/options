"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
export function Navigation() {
  const path = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const links = (
    <>
      <Link
        href="/"
        prefetch={false}
        aria-current={path === "/" ? "page" : undefined}
      >
        Home
      </Link>
      <Link
        href="/curriculum"
        prefetch={false}
        aria-current={path === "/curriculum" ? "page" : undefined}
      >
        Curriculum
      </Link>
      {(
        [
          ["/paths", "Paths"],
          ["/resources", "Resources"],
          ["/projects", "Projects"],
          ["/search", "Search"],
          ["/account", "Account"],
        ] as const
      ).map(([href, label]) => (
        <Link
          key={href}
          href={href}
          prefetch={false}
          aria-current={path === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </>
  );
  return (
    <nav aria-label="Main navigation">
      <div className="desktop-nav">{links}</div>
      <details
        className="mobile-nav"
        key={path}
        ref={menu}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current) {
            menu.current.open = false;
            menu.current.querySelector("summary")?.focus();
          }
        }}
      >
        <summary>Menu</summary>
        <div>{links}</div>
      </details>
    </nav>
  );
}
