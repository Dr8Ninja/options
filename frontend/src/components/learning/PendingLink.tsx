"use client";
import Link, { useLinkStatus } from "next/link";
function Pending() {
  const { pending } = useLinkStatus();
  return pending ? (
    <span role="status" className="link-pending">
      {" "}
      Loading…
    </span>
  ) : null;
}
export function PendingLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} prefetch={false} className={className}>
      {children}
      <Pending />
    </Link>
  );
}
