import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Unavailable } from "@/components/learning/Content";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
import { ThemeToggle } from "@/components/ThemeToggle";
import { ErrorNotice } from "@/components/ErrorNotice";
import { ApiError, errorFromResponse } from "@/api/errors";
import { getCsrf, browserApi } from "@/api/client";
import { readConfig } from "@/config/environment";
describe("foundation boundaries", () => {
  it("states readiness without invented learner controls", () => {
    render(<Unavailable />);
    expect(screen.getByText(/Unpublished drafts are not shown/)).toBeVisible();
    expect(screen.queryByRole("link", { name: /start|sign in/i })).toBeNull();
  });
  it("changes accessible theme state", async () => {
    render(<ThemeToggle initial="light" />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
  it("never renders arbitrary server exception details", () => {
    render(<ErrorNotice error={new Error("password=private SQL")} />);
    expect(screen.getByRole("alert")).not.toHaveTextContent(/password|SQL/);
  });
  it("rejects hostile correlation headers", () => {
    expect(
      errorFromResponse(
        new Response("", {
          status: 500,
          headers: { "X-Request-ID": "private-email@example.invalid" },
        }),
      ).requestId,
    ).toBeUndefined();
  });
  it("keeps retry a deliberate user action", async () => {
    const retry = vi.fn();
    render(<ErrorNotice error={new ApiError(503)} retry={retry} />);
    expect(retry).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
  it("fails closed on missing or unsafe config without leaking values", () => {
    expect(() => readConfig({})).toThrow("Invalid application configuration");
    expect(() =>
      readConfig({
        APP_ENVIRONMENT: "PRODUCTION",
        PUBLIC_ORIGIN: "https://localhost:8443",
        API_INTERNAL_ORIGIN: "http://127.0.0.1:8080",
      }),
    ).toThrow();
  });
  it("requests a typed CSRF response without caching or cross-origin credentials", async () => {
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({ headerName: "X-CSRF-TOKEN", token: "masked-token" }),
          { headers: { "Content-Type": "application/json" } },
        ),
      );
    // jsdom Request needs an absolute base; the browser resolves relative requests itself.
    const Original = globalThis.Request;
    vi.stubGlobal(
      "Request",
      class extends Original {
        constructor(input: RequestInfo | URL, init?: RequestInit) {
          super(
            typeof input === "string" && input.startsWith("/")
              ? "https://localhost:8443" + input
              : input,
            init,
          );
        }
      },
    );
    try {
      expect((await getCsrf()).token).toBe("masked-token");
      const request = fetch.mock.calls[0]?.[0] as Request;
      expect(request.credentials).toBe("same-origin");
      expect(request.cache).toBe("no-store");
    } finally {
      vi.unstubAllGlobals();
      fetch.mockRestore();
    }
  });
  it("refuses unsafe calls without a CSRF token before fetch", async () => {
    const Original = globalThis.Request;
    vi.stubGlobal(
      "Request",
      class extends Original {
        constructor(input: RequestInfo | URL, init?: RequestInit) {
          super(
            typeof input === "string" && input.startsWith("/")
              ? "https://localhost:8443" + input
              : input,
            init,
          );
        }
      },
    );
    const fetch = vi.spyOn(globalThis, "fetch");
    try {
      await expect(
        browserApi().POST("/auth/logout", {
          params: { header: { "X-CSRF-TOKEN": "" } },
        }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(fetch).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
      fetch.mockRestore();
    }
  });
  it("rejects a per-call cross-origin override before transmitting", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try {
      await expect(
        browserApi().GET("/auth/csrf", { baseUrl: "https://hostile.invalid" }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(fetch).not.toHaveBeenCalled();
    } finally {
      fetch.mockRestore();
    }
  });
});
