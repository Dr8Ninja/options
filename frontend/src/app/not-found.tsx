import Link from "next/link";
export default function NotFound() {
  return (
    <section>
      <h1>Page not available</h1>
      <p>This page is not available.</p>
      <Link href="/" prefetch={false}>
        Return home
      </Link>
    </section>
  );
}
