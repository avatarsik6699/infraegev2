import js from "@eslint/js";
import globals from "globals";

// Invoked from the repository root with --config; patterns are relative to that cwd.
export default [
  {
    files: ["scripts/**/*.mjs", "lighthouserc.cjs"],
    languageOptions: { globals: globals.node },
    rules: js.configs.recommended.rules,
  },
];
