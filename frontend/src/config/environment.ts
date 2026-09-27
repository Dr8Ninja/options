import { z } from "zod";
const origin = z.url().refine((value) => {
  const url = new URL(value);
  return (
    !url.username &&
    !url.password &&
    url.pathname === "/" &&
    !url.search &&
    !url.hash &&
    value === url.origin
  );
}, "Expected an origin without path, credentials, query or fragment");
const schema = z
  .object({
    APP_ENVIRONMENT: z.enum(["LOCAL", "TEST", "PRODUCTION"]),
    PUBLIC_ORIGIN: origin.refine(
      (value) => value.startsWith("https://"),
      "HTTPS required",
    ),
    API_INTERNAL_ORIGIN: origin.refine(
      (value) => /^https?:/.test(value),
      "HTTP(S) required",
    ),
  })
  .superRefine((value, ctx) => {
    if (
      value.APP_ENVIRONMENT === "PRODUCTION" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(
        new URL(value.PUBLIC_ORIGIN).hostname,
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Production requires an external HTTPS origin",
        path: ["PUBLIC_ORIGIN"],
      });
    }
  });
export function readConfig(env: Record<string, string | undefined>) {
  const result = schema.safeParse(env);
  if (!result.success)
    throw new Error(
      "Invalid application configuration: " +
        result.error.issues.map((issue) => issue.path.join(".")).join(", "),
    );
  return result.data;
}
