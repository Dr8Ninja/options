import "server-only";
import createClient from "openapi-fetch";
import { cookies } from "next/headers";
import { readConfig } from "@/config/environment";
import type { paths } from "./schema";
import { ApiError, errorFromResponse } from "./errors";
function api(cookie?: string) {
  const { API_INTERNAL_ORIGIN } = readConfig(process.env);
  const client = createClient<paths>({
    baseUrl: `${API_INTERNAL_ORIGIN}/api/v1`,
    cache: "no-store",
    redirect: "error",
    headers: cookie ? { Cookie: cookie } : {},
  });
  client.use({
    onRequest({ request }) {
      const url = new URL(request.url);
      if (
        url.origin !== API_INTERNAL_ORIGIN ||
        !url.pathname.startsWith("/api/v1/")
      )
        throw new ApiError(0);
      // Callers cannot override the identity boundary through per-call headers.
      request.headers.delete("Authorization");
      request.headers.delete("Cookie");
      if (cookie) request.headers.set("Cookie", cookie);
      if (!["GET", "HEAD"].includes(request.method))
        throw new Error("SSR is read-only");
    },
    onResponse({ response }) {
      if (!response.ok) throw errorFromResponse(response);
    },
    onError() {
      return new ApiError(0);
    },
  });
  return client;
}
export function publicApi() {
  return api();
}
export async function ownerApi() {
  const session = (await cookies()).get("__Host-OTRSESSION")?.value;
  if (session && !/^[A-Za-z0-9+/=_-]{1,512}$/.test(session))
    throw new ApiError(401);
  return api(session ? `__Host-OTRSESSION=${session}` : undefined);
}
