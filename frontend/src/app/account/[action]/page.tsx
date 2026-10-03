import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthForm, type Action } from "@/components/account/AuthForm";
import { AccountPage } from "@/components/account/AccountPage";
export const dynamic = "force-dynamic";
const titles: Record<Action, string> = {
  "sign-in": "Sign in",
  register: "Create an account",
  recover: "Recover your account",
  verify: "Verify your email",
  reset: "Choose a new password",
  "confirm-email": "Confirm your new email",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ action: string }>;
}): Promise<Metadata> {
  const { action } = await params;
  return {
    title: titles[action as Action] ?? "Account security",
    robots: { index: false, follow: false },
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { action } = await params;
  if (action === "security-key") return <AccountPage security />;
  if (!(action in titles)) notFound();
  const query = await searchParams;
  return (
    <section className="account-layout">
      <div>
        <p className="eyebrow">Your account</p>
        <h1>{titles[action as Action]}</h1>
        <p>
          Public reading does not require an account. Verification is required
          for private account features.
        </p>
        <AuthForm action={action as Action} next={query.next} />
      </div>
      <aside>
        <h2>Keep control of your account</h2>
        <p>
          Use a unique password. We never ask for brokerage credentials or
          payment details.
        </p>
        <p>
          Recovery links expire after 30 minutes; verification links expire
          after 24 hours. Use the latest message and confirm the action
          yourself.
        </p>
        <p>
          Email delivery must be configured by the site operator. A queued
          request is not a delivery receipt.
        </p>
      </aside>
    </section>
  );
}
