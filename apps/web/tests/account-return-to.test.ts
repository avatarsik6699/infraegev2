import { describe, expect, it } from "vitest";
import { safeReturnTo } from "~/features/account";

describe("account return destination", () => {
  it("returns to account management after email reauthentication", () => {
    expect(safeReturnTo("/account")).toBe("/account");
  });

  it.each([
    "//other.example",
    "/sign-in",
    "/register",
    "/password-reset",
    "/password-reset?token=secret",
    "/verify-email",
    "/verify-email?token=secret",
    "/account/unknown",
  ])("rejects an unsafe or looping destination %s", (value: string) => {
    expect(safeReturnTo(value)).toBe("/");
  });
});
