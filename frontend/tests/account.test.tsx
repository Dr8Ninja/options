import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "@/components/account/AuthForm";
import { safeReturn, mutation } from "@/account/requests";
vi.mock("@/account/requests", async (original) => ({
  ...(await original<typeof import("@/account/requests")>()),
  mutation: vi.fn(),
}));
beforeEach(() => {
  window.history.replaceState(null, "", "/account/verify");
});
describe("account forms", () => {
  it("limits return navigation to known same-origin destinations", () => {
    for (const value of [
      "https://evil.invalid",
      "//evil.invalid",
      "/admin",
      "/account?next=evil",
      "/account/../admin",
    ])
      expect(safeReturn(value)).toBe("/account");
    expect(safeReturn("/curriculum")).toBe("/curriculum");
  });
  it("removes the fragment without consuming it until explicit confirmation", async () => {
    const token = "a".repeat(43);
    window.history.replaceState(null, "", `/account/verify#token=${token}`);
    vi.mocked(mutation).mockResolvedValue({
      message: "The request is complete.",
    });
    render(<AuthForm action="verify" />);
    const confirm = screen.getByRole("button", {
      name: "Verify your email",
    });
    await waitFor(() => expect(confirm).toBeEnabled());
    expect(window.location.hash).toBe("");
    expect(mutation).not.toHaveBeenCalled();
    await userEvent.click(confirm);
    expect(mutation).toHaveBeenCalledWith("/auth/verification-confirmations", {
      token,
    });
    await waitFor(() => expect(confirm).toBeDisabled());
  });
  it("supports keyboard password reveal and announces a failed login", async () => {
    vi.mocked(mutation).mockRejectedValue(
      new Error("The email or password could not be verified."),
    );
    render(<AuthForm action="sign-in" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "reader@example.invalid");
    await user.type(
      screen.getByLabelText("Password"),
      "A long memorable password",
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not be verified",
    );
  });
});
