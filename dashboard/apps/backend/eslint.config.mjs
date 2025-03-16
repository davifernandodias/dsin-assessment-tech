import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // Arquivos que o ESLint deve verificar
    ignores: ["node_modules/**", "dist/**"], // Ignora pastas comuns
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest, // Para suportar Jest
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.test.{js,ts}", "**/__tests__/**/*.{js,ts}"],
    plugins: {
      jest: jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },
];
