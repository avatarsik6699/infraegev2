import { MantineProvider } from "@mantine/core";
import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import { appMantineTheme } from "~/shared/config/mantine-theme";

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

const MantineTestProvider: React.FC<Props> = (props) => {
  return (
    <MantineProvider
      theme={appMantineTheme}
      forceColorScheme="light"
      env="test"
    >
      {props.children}
    </MantineProvider>
  );
};

export function render(
  ui: React.ReactNode,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return testingLibraryRender(ui, {
    wrapper: MantineTestProvider,
    ...options,
  });
}
