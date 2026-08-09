import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

// FSD-like layer boundaries (docs/STACK.md § Project structure): each layer may only import
// from itself and the layers below it. Without this, the layering decays back to flat within a
// change or two — see docs/changes/02-architecture-refactor.md.
const policyImportPaths = [
  {
    name: "@mantine/core",
    importNames: ["Anchor", "Container", "Image", "Text", "Title"],
    message: "Use the matching shared policy component instead.",
  },
];

const policyJsxRestrictions = [
  {
    selector: "JSXOpeningElement[name.name='a']",
    message: "Use ExternalLink or TanStack Router Link instead of a raw anchor.",
  },
  {
    selector: "JSXOpeningElement[name.name='img']",
    message: "Use the shared Image policy component instead of a raw image.",
  },
];

function architectureRules({ upward = [], publicApi = [], policy = true }) {
  return {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: policy ? policyImportPaths : [],
          patterns:
            upward.length + publicApi.length > 0
              ? [
                  {
                    group: [...upward, ...publicApi],
                    message:
                      "Respect layer direction and import from slice public index.ts APIs.",
                  },
                ]
              : [],
        },
      ],
      ...(policy
        ? { "no-restricted-syntax": ["error", ...policyJsxRestrictions] }
        : {}),
    },
  };
}

const sharedComponentInternals = ["~/shared/components/*/**"];
const entityInternals = ["~/entities/*/**"];
const featureInternals = ["~/features/*/**"];
const widgetInternals = ["~/widgets/*/**"];
const pageInternals = ["~/pages/*/**"];

export default tseslint.config(
  { ignores: ["dist/**", ".output/**", ".vinxi/**", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],
    },
  },
  {
    files: ["**/*.types.ts"],
    rules: { "@typescript-eslint/no-namespace": "off" },
  },
  {
    // TanStack Router owns the route component callback shape. Change 03 deliberately excludes
    // framework-fixed route modules from the mechanical React.FC retrofit.
    files: ["src/routes/**/*.tsx"],
    rules: { "react/function-component-definition": "off" },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    ...architectureRules({
      upward: [
        "~/entities/**",
        "~/features/**",
        "~/widgets/**",
        "~/pages/**",
        "~/routes/**",
      ],
      policy: false,
    }),
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    ...architectureRules({
      upward: ["~/features/**", "~/widgets/**", "~/pages/**", "~/routes/**"],
      publicApi: [...sharedComponentInternals, ...entityInternals],
    }),
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    ...architectureRules({
      upward: ["~/widgets/**", "~/pages/**", "~/routes/**"],
      publicApi: [
        ...sharedComponentInternals,
        ...entityInternals,
        ...featureInternals,
      ],
    }),
  },
  {
    files: ["src/widgets/**/*.{ts,tsx}"],
    ...architectureRules({
      upward: ["~/pages/**", "~/routes/**"],
      publicApi: [
        ...sharedComponentInternals,
        ...entityInternals,
        ...featureInternals,
        ...widgetInternals,
      ],
    }),
  },
  {
    files: ["src/pages/**/*.{ts,tsx}"],
    ...architectureRules({
      upward: ["~/routes/**"],
      publicApi: [
        ...sharedComponentInternals,
        ...entityInternals,
        ...featureInternals,
        ...widgetInternals,
        ...pageInternals,
      ],
    }),
  },
  {
    files: ["src/routes/**/*.{ts,tsx}"],
    ...architectureRules({
      publicApi: [
        ...sharedComponentInternals,
        ...entityInternals,
        ...featureInternals,
        ...widgetInternals,
        ...pageInternals,
      ],
    }),
  },
);
