import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { ApiError, errorFromResponse } from "./errors";
// No exported arbitrary URL or credential forwarding option in the browser adapter.
export function browserApi() {
  const client = createClient<paths>({
    baseUrl: "/api/v1",
    credentials: "same-origin",
    cache: "no-store",
    redirect: "error",
  });
  client.use({
    onRequest({ request }) {
      const url = new URL(request.url);
      if (
        url.origin !== window.location.origin ||
        !url.pathname.startsWith("/api/v1/")
      )
        throw new ApiError(0);
      if (
        !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
        !request.headers.get("X-CSRF-TOKEN")
      )
        throw new ApiError(403);
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
export async function getCsrf() {
  const { data } = await browserApi().GET("/auth/csrf");
  if (
    data?.headerName !== "X-CSRF-TOKEN" ||
    typeof data.token !== "string" ||
    !data.token ||
    data.token.length > 2048
  )
    throw new ApiError(0);
  return data;
}
// Call getCsrf explicitly before mutations and after identity changes. Never retry a write automatically.
