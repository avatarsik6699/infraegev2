/** A return destination must stay on this origin and never target an auth screen. */
export function safeReturnTo(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  )
    return "/";
  const path = value.split("?")[0];
  return path.startsWith("/sign-") ||
    path.startsWith("/register") ||
    path.startsWith("/password-reset") ||
    path.startsWith("/verify-email") ||
    (path.startsWith("/account") && path !== "/account")
    ? "/"
    : value;
}
