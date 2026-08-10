import { MantineProvider } from "@mantine/core";
import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import { opsMantineTheme } from "~/shared/config/mantine-theme";

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

class ResizeObserverStub implements ResizeObserver {
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
}

globalThis.ResizeObserver = ResizeObserverStub;

const OpsTestProvider: React.FC<Props> = ({ children }) => (
  <MantineProvider theme={opsMantineTheme} forceColorScheme="dark" env="test">
    {children}
  </MantineProvider>
);

export function render(
  ui: React.ReactNode,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return testingLibraryRender(ui, { wrapper: OpsTestProvider, ...options });
}
