"use client";
import { useState } from "react";
export function CopyCode({ text }: { text: string }) {
  const [message, setMessage] = useState("");
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setMessage("Code copied.");
          } catch {
            setMessage("Select the code and copy it manually.");
          }
        }}
      >
        Copy code
      </button>
      <span role="status">{message}</span>
    </>
  );
}
