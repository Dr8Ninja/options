import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: "synthetic-session" }) }),
}));
import { publicApi, ownerApi } from "@/api/server";
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
function setup() {
  vi.stubEnv("APP_ENVIRONMENT", "TEST");
  vi.stubEnv("PUBLIC_ORIGIN", "https://localhost:8443");
  vi.stubEnv("API_INTERNAL_ORIGIN", "http://127.0.0.1:8080");
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(
      new Response(
        JSON.stringify({ headerName: "X-CSRF-TOKEN", token: "fixture" }),
        { headers: { "Content-Type": "application/json" } },
      ),
    );
}
describe("SSR identity boundary", () => {
  it("public requests strip caller identity and prohibit following redirects", async () => {
    const fetch = setup();
    await publicApi().GET("/auth/csrf", {
      headers: { Cookie: "private=fixture", Authorization: "Bearer fixture" },
    });
    const request = fetch.mock.calls[0]?.[0] as Request;
    expect(request.headers.has("Cookie")).toBe(false);
    expect(request.headers.has("Authorization")).toBe(false);
    expect(request.redirect).toBe("error");
    expect(request.cache).toBe("no-store");
  });
  it("owner reads forward exactly one session cookie", async () => {
    const fetch = setup();
    await (
      await ownerApi()
    ).GET("/auth/csrf", { headers: { Cookie: "untrusted=fixture" } });
    const request = fetch.mock.calls[0]?.[0] as Request;
    expect(request.headers.get("Cookie")).toBe(
      "__Host-OTRSESSION=synthetic-session",
    );
  });
  it("rejects user-controlled destinations before forwarding a session", async () => {
    const fetch = setup();
    await expect(
      (await ownerApi()).GET("/auth/csrf", {
        baseUrl: "https://hostile.invalid",
      }),
    ).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
});
