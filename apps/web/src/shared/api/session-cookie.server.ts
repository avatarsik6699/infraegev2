import { getCookie } from "@tanstack/react-start/server";

// The API's session cookie: `__Host-` in production, plain in development.
const NAMES = ["__Host-kodumka_session", "kodumka_session"] as const;

/**
 * Change 192: SSR asks the API on the visitor's behalf (access, unlocked practice),
 * forwarding only the session cookie, never the whole Cookie header.
 */
export const sessionCookie = {
  header(): string | undefined {
    for (const name of NAMES) {
      const value = getCookie(name);
      if (value) return `${name}=${value}`;
    }
    return undefined;
  },
};
