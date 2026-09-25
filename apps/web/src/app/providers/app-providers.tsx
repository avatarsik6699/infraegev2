import { AccountSessionProvider, useAccountSession } from "~/features/account";
import { PracticeProgressProvider } from "~/features/practice-progress";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { AppNavigationProgress } from "./components/navigation-progress";
import type { AppProvidersTypes } from "./app-providers.types";

export const AppProviders: React.FC<AppProvidersTypes.Props> = (props) => (
  <AccountSessionProvider>
    <AccountScopedProviders>{props.children}</AccountScopedProviders>
  </AccountSessionProvider>
);

const AccountScopedProviders: React.FC<AppProvidersTypes.Props> = (props) => {
  const session = useAccountSession();
  const ownerKey = session.account?.id ?? "guest";
  return (
    <LessonProgressProvider
      key={`lesson:${ownerKey}`}
      accountId={session.account?.id}
    >
      <AppNavigationProgress />
      <PracticeProgressProvider
        key={`practice:${ownerKey}`}
        accountId={session.account?.id}
      >
        {props.children}
      </PracticeProgressProvider>
    </LessonProgressProvider>
  );
};
