"use client";
import { safeError } from "@/api/errors";
export function ErrorNotice({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  const safe = safeError(error);
  return (
    <section role="alert" aria-labelledby="request-error">
      <h2 id="request-error">Something went wrong</h2>
      <p>{safe.message}</p>
      {safe.requestId && (
        <p>
          Reference: <code>{safe.requestId}</code>
        </p>
      )}
      {retry && <button onClick={retry}>Try again</button>}
    </section>
  );
}
