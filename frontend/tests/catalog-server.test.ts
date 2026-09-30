import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { get, consistent } from "@/learning/catalog";
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
function config() {
  vi.stubEnv("APP_ENVIRONMENT", "TEST");
  vi.stubEnv("PUBLIC_ORIGIN", "https://localhost:8443");
  vi.stubEnv("API_INTERNAL_ORIGIN", "http://127.0.0.1:8080");
}
describe("public page API adapter", () => {
  it("uses the fixed internal origin with no identity, no-store and a bounded request", async () => {
    config();
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ generation: "1" })));
    await get("/content-version");
    expect(fetch.mock.calls[0]?.[0]).toBe(
      "http://127.0.0.1:8080/api/v1/content-version",
    );
    expect(fetch.mock.calls[0]?.[1]).toMatchObject({
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
    });
    expect(fetch.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
    expect(fetch.mock.calls[0]?.[1]?.headers).toEqual({
      Accept: "application/json",
    });
  });
  it("rejects unsupported destinations before fetching", async () => {
    config();
    const fetch = vi.spyOn(globalThis, "fetch");
    await expect(get("https://unsafe.invalid/")).rejects.toMatchObject({
      status: 400,
    });
    await expect(get("/topics/../admin")).rejects.toMatchObject({
      status: 400,
    });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("turns timeouts and network errors into a safe unavailable state", async () => {
    config();
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new DOMException("private connection details", "TimeoutError"),
    );
    await expect(get("/topics/T1")).rejects.toMatchObject({ status: 503 });
  });
  it("does not assemble a page across two publication generations", async () => {
    config();
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ generation: "1" })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ generation: "2" })));
    await expect(
      consistent(async () => "body from first publication"),
    ).rejects.toMatchObject({ status: 503 });
  });
});
