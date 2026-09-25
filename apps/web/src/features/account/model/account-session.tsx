import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiClient, ApiError } from "~/shared/api";
import type { components } from "~/shared/api/schema";

export type AccountSession = {
  account: components["schemas"]["AccountView"] | null;
  csrfToken: string | null;
  status: "loading" | "ready" | "error";
  refresh: () => Promise<void>;
};

const guestSession: AccountSession = {
  account: null,
  csrfToken: null,
  status: "ready",
  refresh: () => Promise.resolve(),
};
const AccountSessionContext = createContext<AccountSession>(guestSession);

async function getSession(): Promise<Omit<AccountSession, "refresh">> {
  const response = await apiClient.GET("/api/auth/session");
  if (!response.response.ok)
    throw new ApiError("http", "Session request failed", {
      status: response.response.status,
    });
  return {
    account: response.data?.account ?? null,
    csrfToken: response.data?.csrf_token ?? null,
    status: "ready",
  };
}

export const AccountSessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [session, setSession] = useState<Omit<AccountSession, "refresh">>({
    account: null,
    csrfToken: null,
    status: "loading",
  });
  const refresh = useCallback(async () => {
    try {
      setSession(await getSession());
    } catch {
      setSession({ account: null, csrfToken: null, status: "error" });
    }
  }, []);

  useEffect(() => {
    let active = true;
    void getSession().then(
      (value) => {
        if (active) setSession(value);
      },
      () => {
        if (active)
          setSession({ account: null, csrfToken: null, status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [refresh]);

  return (
    <AccountSessionContext.Provider value={{ ...session, refresh }}>
      {children}
    </AccountSessionContext.Provider>
  );
};

export function useAccountSession(): AccountSession {
  return useContext(AccountSessionContext);
}
