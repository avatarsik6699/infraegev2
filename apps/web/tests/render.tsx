import { QueryClientProvider } from "@tanstack/react-query";
import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import { createAppQueryClient } from "~/app";

type Props = { children: React.ReactNode };

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

export function render(
  ui: React.ReactNode,
  options?: Omit<RenderOptions, "wrapper">,
) {
  const queryClient = createAppQueryClient();
  const TestProvider: React.FC<Props> = (props) => (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );

  return testingLibraryRender(ui, {
    wrapper: TestProvider,
    ...options,
  });
}
