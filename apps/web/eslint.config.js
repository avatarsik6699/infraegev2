import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

// FSD-like layer boundaries (docs/STACK.md § Project structure): each layer may only import
// from itself and the layers below it. Without this, the layering decays back to flat within a
// change or two — see docs/changes/02-architecture-refactor.md.
function noUpward(...patterns) {
  return {
    rules: {
      "no-restricted-imports": ["error", { patterns }],
    },
  };
}

export default tseslint.config(
  { ignores: ["dist/**", ".output/**", ".vinxi/**", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    ...noUpward(
      "~/entities/**",
      "~/features/**",
      "~/widgets/**",
      "~/pages/**",
      "~/routes/**",
    ),
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    ...noUpward("~/features/**", "~/widgets/**", "~/pages/**", "~/routes/**"),
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    ...noUpward("~/widgets/**", "~/pages/**", "~/routes/**"),
  },
  {
    files: ["src/widgets/**/*.{ts,tsx}"],
    ...noUpward("~/pages/**", "~/routes/**"),
  },
  { files: ["src/pages/**/*.{ts,tsx}"], ...noUpward("~/routes/**") },
);
