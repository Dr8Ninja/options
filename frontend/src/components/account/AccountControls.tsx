"use client";
import { useEffect, useRef, useState } from "react";
import { mutation } from "@/account/requests";
import type { components } from "@/api/schema";
const bytes = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
    c.charCodeAt(0),
  );
const encoded = (b: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(b)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
export function AccountControls({ accountId }: { accountId: string }) {
  const controls = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [busy, setBusy] = useState(false);
  const [keys, setKeys] = useState<components["schemas"]["Credential"][]>([]);
  useEffect(() => {
    let live = true;
    const panel = controls.current?.closest<HTMLElement>(".account-panel");
    function hide() {
      if (panel) panel.hidden = true;
    }
    async function check() {
      try {
        const r = await fetch("/api/v1/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const s = await r.json();
        if (!r.ok || !s.authenticated || s.accountId !== accountId) {
          hide();
          window.location.replace("/account/sign-in");
        } else if (panel && live) {
          panel.hidden = false;
          const remaining = Date.parse(s.idleExpiresAt) - Date.now();
          setWarning(
            remaining < 300000
              ? "Your session expires soon. Confirm your password to continue, or sign out. Absolute expiration still requires signing in again."
              : "",
          );
        }
      } catch {
        if (live)
          setMessage(
            "Cannot check your session. Retry after connectivity returns.",
          );
      }
    }
    function visible() {
      if (document.visibilityState === "visible") void check();
    }
    void check();
    window.addEventListener("pageshow", check);
    window.addEventListener("pagehide", hide);
    window.addEventListener("account-session-ended", hide);
    document.addEventListener("visibilitychange", visible);
    const timer = setInterval(check, 60000);
    return () => {
      live = false;
      clearInterval(timer);
      window.removeEventListener("pageshow", check);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("account-session-ended", hide);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [accountId]);
  async function run(work: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await work();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request unavailable.");
    } finally {
      setBusy(false);
    }
  }
  async function key(register: boolean, label = "") {
    if (!navigator.credentials)
      throw new Error("Security keys are not available in this browser.");
    const o = await mutation(
      register
        ? "/me/webauthn/registration-options"
        : "/auth/webauthn/assertion-options",
    );
    o.challenge = bytes(o.challenge);
    if (register) {
      o.user.id = bytes(o.user.id);
      o.excludeCredentials = o.excludeCredentials.map((x: { id: string }) => ({
        ...x,
        id: bytes(x.id),
      }));
    } else {
      o.allowCredentials = o.allowCredentials.map((x: { id: string }) => ({
        ...x,
        id: bytes(x.id),
      }));
    }
    const credential = (
      register
        ? await navigator.credentials.create({ publicKey: o })
        : await navigator.credentials.get({ publicKey: o })
    ) as PublicKeyCredential | null;
    if (!credential) throw new Error("Security key operation cancelled.");
    const r = credential.response;
    const response = register
      ? {
          clientDataJSON: encoded(r.clientDataJSON),
          attestationObject: encoded(
            (r as AuthenticatorAttestationResponse).attestationObject,
          ),
          transports: (r as AuthenticatorAttestationResponse).getTransports(),
        }
      : {
          clientDataJSON: encoded(r.clientDataJSON),
          authenticatorData: encoded(
            (r as AuthenticatorAssertionResponse).authenticatorData,
          ),
          signature: encoded((r as AuthenticatorAssertionResponse).signature),
          userHandle: (r as AuthenticatorAssertionResponse).userHandle
            ? encoded((r as AuthenticatorAssertionResponse).userHandle!)
            : null,
        };
    await mutation(
      register ? "/me/webauthn/credentials" : "/auth/webauthn/assertions",
      {
        id: credential.id,
        rawId: encoded(credential.rawId),
        type: credential.type,
        ...(register ? { label } : {}),
        response,
        clientExtensionResults: {},
      },
    );
    setMessage(
      register ? "Security key registered." : "Security key verified.",
    );
  }
  return (
    <div ref={controls} className="account-controls" aria-busy={busy}>
      {warning && <p role="status">{warning}</p>}
      <p role="status">{message}</p>
      <fieldset disabled={busy}>
        <legend>Session controls</legend>
        <button
          onClick={() =>
            run(async () => {
              await mutation("/auth/logout");
              window.location.replace("/account/sign-in");
            })
          }
        >
          Sign out
        </button>
        <button
          onClick={() =>
            run(async () => {
              await mutation("/auth/logout-all");
              window.location.replace("/account/sign-in");
            })
          }
        >
          Sign out all sessions
        </button>
      </fieldset>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const password = String(
            new FormData(e.currentTarget).get("password"),
          );
          void run(async () => {
            await mutation("/auth/reauthentication", { password });
            setMessage(
              "Password confirmed. Privileged actions also require a recent security key check.",
            );
          });
        }}
      >
        <h2>Confirm your password</h2>
        <label>
          Current password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button disabled={busy}>Confirm password</button>
      </form>
      <section>
        <h2>Security keys</h2>
        <p>
          Privileged roles require two independently recoverable authenticators
          and an offline operator invitation. Registering a key does not grant a
          role. Email recovery removes privileged roles until the offline
          ceremony is repeated.
        </p>
        <button disabled={busy} onClick={() => run(() => key(false))}>
          Verify security key
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const label = String(new FormData(e.currentTarget).get("label"));
            void run(() => key(true, label));
          }}
        >
          <label>
            Security key label
            <input name="label" required maxLength={100} />
          </label>
          <button disabled={busy}>Register security key</button>
        </form>
        <button
          disabled={busy}
          onClick={() =>
            run(async () => {
              const r = await fetch("/api/v1/me/webauthn/credentials", {
                cache: "no-store",
                credentials: "same-origin",
              });
              if (!r.ok) throw new Error("Sign in again to see your keys.");
              setKeys((await r.json()).items);
            })
          }
        >
          Show registered keys
        </button>
        <ul>
          {keys.map((k) => (
            <li key={k.credentialId}>
              {k.label}{" "}
              <button
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await mutation(
                      `/me/webauthn/credentials/${k.credentialId}`,
                      undefined,
                      "DELETE",
                    );
                    window.location.replace("/account/sign-in");
                  })
                }
              >
                Remove {k.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newPassword = String(
            new FormData(e.currentTarget).get("password"),
          );
          void run(async () => {
            await mutation("/me/password", { newPassword });
            window.location.replace("/account/sign-in");
          });
        }}
      >
        <h2>Change password</h2>
        <label>
          New password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </label>
        <button disabled={busy}>Change password and sign out</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = String(new FormData(e.currentTarget).get("email"));
          void run(async () => {
            const r = await mutation("/me/email-change", { email });
            setMessage(r.message);
          });
        }}
      >
        <h2>Change email</h2>
        <p>
          Your current address remains active until you confirm the new address.
          The old address is notified after confirmation.
        </p>
        <label>
          New email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={320}
          />
        </label>
        <button disabled={busy}>Request email change</button>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            run(async () => {
              await mutation("/me/email-change", undefined, "DELETE");
              setMessage("Pending email change cancelled.");
            })
          }
        >
          Cancel pending email change
        </button>
      </form>
    </div>
  );
}
