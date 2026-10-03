"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { mutation, safeReturn } from "@/account/requests";
export type Action =
  "sign-in" | "register" | "recover" | "verify" | "reset" | "confirm-email";
export const headings: Record<Action, string> = {
  "sign-in": "Sign in",
  register: "Create an account",
  recover: "Recover your account",
  verify: "Verify your email",
  reset: "Choose a new password",
  "confirm-email": "Confirm your new email",
};
export function AuthForm({ action, next }: { action: Action; next?: string }) {
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const t = new URLSearchParams(window.location.hash.slice(1)).get("token");
    if (t && /^[A-Za-z0-9_-]{43}$/.test(t)) queueMicrotask(() => setToken(t));
    if (window.location.hash)
      window.history.replaceState(null, "", window.location.pathname);
  }, []);
  const email = ["sign-in", "register", "recover"].includes(action);
  const password = ["sign-in", "register", "reset"].includes(action);
  const confirm = ["verify", "reset", "confirm-email"].includes(action);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const address = String(data.get("email") ?? "");
      const secret = String(data.get("password") ?? "");
      if (
        password &&
        ([...secret.normalize("NFC")].length > 128 ||
          (action !== "sign-in" && [...secret.normalize("NFC")].length < 15))
      )
        throw new Error("Use 15–128 characters for your password.");
      const routes = {
        "sign-in": "/auth/login",
        register: "/auth/register",
        recover: "/auth/password-reset-requests",
        verify: "/auth/verification-confirmations",
        reset: "/auth/password-reset-confirmations",
        "confirm-email": "/auth/email-change-confirmations",
      };
      const body =
        action === "register"
          ? {
              email: address,
              password: secret,
              eligibilityAttested: data.get("eligible") === "on",
            }
          : action === "sign-in"
            ? { email: address, password: secret }
            : action === "recover"
              ? { email: address }
              : action === "reset"
                ? { token, newPassword: secret }
                : { token };
      const result = await mutation(routes[action], body);
      if (action === "sign-in") {
        window.location.assign(
          result.state === "UNVERIFIED"
            ? "/account/verify"
            : result.state === "MFA_REQUIRED"
              ? "/account/security-key"
              : safeReturn(next),
        );
        return;
      }
      setMessage(result.message);
      if (confirm) setToken("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The request could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="account-panel">
      <form onSubmit={submit} aria-busy={busy}>
        {email && (
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={320}
              required
            />
          </label>
        )}
        {password && (
          <>
            <label>
              {action === "reset" ? "New password" : "Password"}
              <input
                name="password"
                type={show ? "text" : "password"}
                autoComplete={
                  action === "sign-in" ? "current-password" : "new-password"
                }
                required
                aria-describedby="password-help"
              />
            </label>
            <button
              type="button"
              aria-pressed={show}
              onClick={() => setShow(!show)}
            >
              {show ? "Hide password" : "Show password"}
            </button>
            <p id="password-help">
              Use 15–128 characters. Password managers and pasting are
              supported.
            </p>
          </>
        )}
        {action === "register" && (
          <label className="account-check">
            <input type="checkbox" name="eligible" required />I am an adult
            eligible to use this educational service under the rules where I
            live.
          </label>
        )}
        {confirm && !token && (
          <p>
            No usable token is loaded. Open the latest confirmation link from
            your email. Opening a link alone does not change your account.
          </p>
        )}
        <button type="submit" disabled={busy || (confirm && !token)}>
          {busy ? "Working…" : headings[action]}
        </button>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
      </form>
      {action === "verify" && <Resend />}
      <nav aria-label="Account options">
        <Link prefetch={false} href="/account/sign-in">
          Sign in
        </Link>
        <Link prefetch={false} href="/account/register">
          Create an account
        </Link>
        <Link prefetch={false} href="/account/recover">
          Forgot password?
        </Link>
        <Link prefetch={false} href="/curriculum">
          Continue reading
        </Link>
      </nav>
    </div>
  );
}
function Resend() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email"));
        setBusy(true);
        try {
          const r = await mutation("/auth/verification-requests", { email });
          setMessage(r.message);
        } catch (e) {
          setMessage(e instanceof Error ? e.message : "Request unavailable.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Request a new verification message</h2>
      <label>
        Email for verification
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <button disabled={busy}>Request verification</button>
      <p role="status">{message}</p>
    </form>
  );
}
