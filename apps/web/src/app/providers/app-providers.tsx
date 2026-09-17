import { PracticeProgressProvider } from "~/features/practice-progress";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { AppNavigationProgress } from "./components/navigation-progress";
import type { AppProvidersTypes } from "./app-providers.types";

export const AppProviders: React.FC<AppProvidersTypes.Props> = (props) => (
  <LessonProgressProvider>
    <AppNavigationProgress />
    <PracticeProgressProvider>{props.children}</PracticeProgressProvider>
  </LessonProgressProvider>
);
