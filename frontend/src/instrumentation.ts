import { readConfig } from "./config/environment";
export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") readConfig(process.env);
}
