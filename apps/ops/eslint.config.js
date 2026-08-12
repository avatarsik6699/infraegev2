import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

function architectureRules({ upward = [], publicApi = [] }) {
  return {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns:
            upward.length + publicApi.length > 0
              ? [
                  {
                    group: [...upward, ...publicApi],
                    message:
                      "Respect ops layer direction and slice public index.ts APIs.",
                  },
                ]
              : [],
        },
      ],
    },
  };
}

export default tseslint.config(
  { ignores: ["dist/"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ["src/**/*.{ts,tsx}", "server/**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    ...architectureRules({ upward: ["~/pages/**", "~/app"] }),
  },
  {
    files: ["src/pages/**/*.{ts,tsx}"],
    ...architectureRules({ upward: ["~/app"], publicApi: ["~/pages/*/**"] }),
  },
  {
    files: ["src/app.tsx"],
    ...architectureRules({ publicApi: ["~/pages/*/**"] }),
  },
  { files: ["scripts/**/*.mjs"], languageOptions: { globals: globals.node } },
  eslintConfigPrettier,
);
