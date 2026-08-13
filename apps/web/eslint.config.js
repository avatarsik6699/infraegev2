import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import playwright from "eslint-plugin-playwright";
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
    message:
      "Use ExternalLink or TanStack Router Link instead of a raw anchor.",
  },
  {
    selector: "JSXOpeningElement[name.name='img']",
    message: "Use the shared Image policy component instead of a raw image.",
  },
  {
    selector: "JSXOpeningElement[name.name=/^(p|h1|h2|h3|h4|h5|h6)$/]",
    message:
      "Use the shared Typography policy component for page text and headings.",
  },
];

const platformSyntaxRestrictions = [
  {
    selector:
      "MemberExpression[object.type='MetaProperty'][property.name='env']",
    message: "Read public Vite values only in shared/config/client-env.ts.",
  },
  {
    selector: "ImportDeclaration[source.value=/^node:/]",
    message:
      "Node built-ins belong in an explicitly owned server boundary, not universal application code.",
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
      "no-restricted-syntax": [
        "error",
        ...platformSyntaxRestrictions,
        ...(policy ? policyJsxRestrictions : []),
      ],
    },
  };
}

const sharedComponentInternals = ["~/shared/components/*/**"];
const entityInternals = ["~/entities/*/**"];
const featureInternals = ["~/features/*/**"];
const widgetInternals = ["~/widgets/*/**"];
const pageInternals = ["~/pages/*/**"];

const platformGlobalRestrictions = [
  {
    name: "window",
    message:
      "Use an owning browser adapter in shared/lib instead of window directly.",
  },
  {
    name: "document",
    message:
      "Use an owning browser adapter or React abstraction instead of document directly.",
  },
  {
    name: "navigator",
    message:
      "Use an owning browser adapter in shared/lib instead of navigator directly.",
  },
  {
    name: "localStorage",
    message: "Use shared/lib/safe-ls instead of localStorage directly.",
  },
  {
    name: "sessionStorage",
    message:
      "Use an owning storage adapter instead of sessionStorage directly.",
  },
  {
    name: "fetch",
    message: "Network calls belong in the owning feature/entity api module.",
  },
  {
    name: "process",
    message:
      "Server environment access belongs in a server-only config module.",
  },
];

function restrictedPlatformGlobals(...allowed) {
  return [
    "error",
    {
      globals: platformGlobalRestrictions.filter(
        ({ name }) => !allowed.includes(name),
      ),
      checkGlobalObject: true,
    },
  ];
}

export default tseslint.config(
  { ignores: ["dist/**", ".output/**", ".vinxi/**", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.{ts,tsx}"],
  })),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { tsconfigRootDir: import.meta.dirname },
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
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        { allowDefaultCaseForExhaustiveSwitch: false },
      ],
    },
  },
  {
    files: ["**/*.types.ts"],
    rules: { "@typescript-eslint/no-namespace": "off" },
  },
  {
    files: ["src/shared/api/schema.ts"],
    rules: { "@typescript-eslint/consistent-type-definitions": "off" },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-globals": restrictedPlatformGlobals(),
    },
  },
  {
    files: ["src/shared/api/client.ts"],
    rules: {
      "no-restricted-globals": restrictedPlatformGlobals("fetch"),
    },
  },
  {
    files: ["src/shared/lib/safe-ls.ts"],
    rules: {
      "no-restricted-globals": restrictedPlatformGlobals(
        "window",
        "localStorage",
      ),
    },
  },
  {
    files: ["src/shared/lib/client-errors/browser-adapter.ts"],
    rules: {
      "no-restricted-globals": restrictedPlatformGlobals("window"),
    },
  },
  {
    files: ["src/shared/lib/section-observer/browser-adapter.ts"],
    rules: {
      "no-restricted-globals": restrictedPlatformGlobals("document", "window"),
    },
  },
  {
    files: ["src/shared/lib/reading-position/browser-adapter.ts"],
    rules: {
      "no-restricted-globals": restrictedPlatformGlobals("window"),
    },
  },
  {
    files: ["src/shared/config/*.server.ts"],
    rules: {
      "no-restricted-globals": restrictedPlatformGlobals("process"),
    },
  },
  {
    // Playwright fixture callbacks name their lifecycle continuation `use`; it is not React.use().
    files: ["e2e/fixtures.ts"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
  {
    files: ["e2e/fixtures.ts", "e2e/pages/**/*.{ts,tsx}"],
    plugins: { playwright },
    rules: {
      "playwright/missing-playwright-await": "error",
      "playwright/no-force-option": "error",
      "playwright/no-networkidle": "error",
      "playwright/no-page-pause": "error",
      "playwright/no-wait-for-navigation": "error",
      "playwright/no-wait-for-selector": "error",
      "playwright/no-wait-for-timeout": "error",
      "playwright/prefer-web-first-assertions": "error",
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["e2e/**/*.spec.{ts,tsx}"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // Assertions intentionally live behind application Page Object methods.
      "playwright/expect-expect": [
        "error",
        { assertFunctionPatterns: ["^expect"] },
      ],
      "playwright/no-force-option": "error",
      "playwright/no-wait-for-selector": "error",
      "playwright/no-wait-for-timeout": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@playwright/test",
              message:
                "Import the application test from ./fixtures; specs must not consume Playwright primitives directly.",
            },
            {
              name: "playwright",
              message:
                "Playwright primitives belong in typed fixtures or Page Objects, not in specs.",
            },
            {
              name: "playwright-core",
              message:
                "Playwright primitives belong in typed fixtures or Page Objects, not in specs.",
            },
          ],
          patterns: [
            {
              group: ["./pages/**"],
              message:
                "Consume Page Objects through typed fixtures instead of importing their classes in a spec.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ObjectPattern > Property[key.name=/^(page|browser|browserName|context|request|testInfo|baseURL)$/]",
          message:
            "Use a domain fixture; built-in Playwright fixtures belong in e2e/fixtures.ts.",
        },
        {
          selector:
            "CallExpression[callee.name='test'] > ArrowFunctionExpression[params.length>1]",
          message:
            "Keep TestInfo and other runner plumbing inside typed fixtures or Page Objects.",
        },
        {
          selector: "NewExpression[callee.name=/Page$/]",
          message:
            "Page Object construction belongs in e2e/fixtures.ts, not in specs.",
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.property.name=/^(goto|locator|getByAltText|getByLabel|getByPlaceholder|getByRole|getByTestId|getByText|getByTitle|evaluate|screenshot|setViewportSize|waitForLoadState|waitForNavigation|waitForSelector|waitForTimeout|newContext|newPage|close)$/]",
          message:
            "Move low-level Playwright calls into the owning Page Object or typed fixture.",
        },
      ],
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  {
    // TanStack Router owns the route component callback shape. Change 03 deliberately excludes
    // framework-fixed route modules from the mechanical React.FC retrofit. Its generated module
    // augmentation is understood by tsc but not fully resolved by typescript-eslint Project
    // Service, so keep the two unsafe-value rules delegated to the green project typecheck.
    files: ["src/routes/**/*.tsx"],
    rules: {
      "react/function-component-definition": "off",
      // TanStack Router's documented notFound() contract intentionally throws a typed sentinel
      // object rather than an Error instance; tsc still narrows the loader control flow correctly.
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
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
    // The proof is a specialized semantic diagram: its native text nodes are part of the
    // renderer geometry, not general page typography.
    files: ["src/pages/lesson-design-lab/components/binary-search-proof.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...platformSyntaxRestrictions,
        ...policyJsxRestrictions.filter(
          ({ selector }) => !selector.includes("p|h1|h2|h3|h4|h5|h6"),
        ),
      ],
    },
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
  {
    files: ["src/shared/config/client-env.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
  eslintConfigPrettier,
);
