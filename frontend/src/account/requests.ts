import { getCsrf } from "@/api/client";
export const destinations = [
  "/account",
  "/account/security-key",
  "/curriculum",
];
export function safeReturn(value?: string) {
  return value && destinations.includes(value) ? value : "/account";
}
export async function mutation(
  endpoint: string,
  body?: unknown,
  method = "POST",
) {
  if (
    !/^\/(auth\/(register|login|logout|logout-all|reauthentication|verification-requests|verification-confirmations|password-reset-requests|password-reset-confirmations|email-change-confirmations|webauthn\/(assertion-options|assertions))|me\/(password|email-change|webauthn\/(registration-options|credentials(?:\/[a-f0-9-]{36})?)))$/.test(
      endpoint,
    )
  )
    throw new Error("Unavailable action.");
  const csrf = await getCsrf();
  const result = await fetch(`/api/v1${endpoint}`, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    redirect: "error",
    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf.token },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!result.ok) {
    if (
      result.status === 401 &&
      (endpoint.startsWith("/me/") ||
        endpoint === "/auth/reauthentication" ||
        endpoint === "/auth/logout-all")
    ) {
      window.dispatchEvent(new Event("account-session-ended"));
      window.location.replace("/account/sign-in");
    }
    let code = "";
    try {
      code = (await result.json()).code;
    } catch {
      /* Safe fallback only. */
    }
    const messages: Record<string, string> = {
      INVALID_CREDENTIALS: "The email or password could not be verified.",
      PASSWORD_POLICY:
        "Use 15–128 characters and a password that is not commonly used.",
      TOKEN_INVALID:
        "This link is no longer valid. Request the latest message.",
      REAUTHENTICATION_REQUIRED:
        "Confirm your password and, for a privileged account, your security key before continuing.",
      SECOND_KEY_REQUIRED:
        "Enroll a replacement before removing a privileged security key.",
      WEBAUTHN_INVALID: "The security key could not be verified. Start again.",
    };
    throw new Error(
      messages[code] ??
        (result.status === 429
          ? "Too many attempts. Wait 15 minutes before trying again; email requests may need an hour."
          : result.status === 403
            ? "The security token expired or this action is forbidden. Retry deliberately after refreshing."
            : result.status === 401
              ? "Your session ended. Sign in again."
              : "The request could not be completed. Check your entries or try again later."),
    );
  }
  return result.status === 204 ? null : result.json();
}
