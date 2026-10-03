import Link from "next/link";
import { ownerApi } from "@/api/server";
import { ApiError } from "@/api/errors";
import { redirect } from "next/navigation";
import { AccountControls } from "./AccountControls";
export async function AccountPage({
  security = false,
}: {
  security?: boolean;
}) {
  let session, profile;
  try {
    const api = await ownerApi();
    session = (await api.GET("/auth/session")).data;
    if (session?.authenticated && session.state !== "UNVERIFIED")
      profile = (await api.GET("/me")).data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/account/sign-in");
    return (
      <section role="status">
        <h1>Account service is temporarily unavailable</h1>
        <p>Try again later. Your private details have not been loaded.</p>
        <Link prefetch={false} href="/account">
          Try loading your account
        </Link>
      </section>
    );
  }
  if (!session?.authenticated)
    redirect(
      `/account/sign-in?next=${security ? "/account/security-key" : "/account"}`,
    );
  if (session.state === "UNVERIFIED") redirect("/account/verify");
  if (!profile) throw new Error("Account unavailable");
  return (
    <section className="account-panel">
      <p className="eyebrow">Private account</p>
      <h1>{security ? "Security keys" : "Your account"}</h1>
      <p>{profile.email}</p>
      <p>Verified email · {session.roles.join(", ")}</p>
      {session.state === "MFA_REQUIRED" && (
        <p role="status">
          Your privileged account requires a security key as well as your
          password.
        </p>
      )}
      <p>
        Idle session expires at {session.idleExpiresAt}. Absolute expiration:{" "}
        {session.absoluteExpiresAt}. Confirm your credentials deliberately when
        asked.
      </p>
      <AccountControls accountId={profile.accountId} />
    </section>
  );
}
