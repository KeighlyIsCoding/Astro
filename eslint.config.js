// @ts-check
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['build', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Enforce Styling
      '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/array-bracket-newline': ['warn', { multiline: true, minItems: 3 }],
      '@stylistic/comma-spacing': ['warn', { before: false, after: true }],
      '@stylistic/comma-dangle': ['warn', 'only-multiline'], // Allows but doesn't require trailing commas
      'yoda': 'error',

      // Avoid duplicates
      'no-self-compare': 'error',

      // Ensure accurate values
      'no-template-curly-in-string': 'error',
      'eqeqeq': ['error', 'always'],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      // Type-only imports are erased at build time
      '@typescript-eslint/consistent-type-imports': 'error',

      // Allow debugger & console
      'no-debugger': 'off',
      'no-console': 'off',

      // (turn on when deploying)
      /* 'no-debugger': 'error',
      'no-console': [
        'error',
        {
          // Allow error messages for user-end issue reports
          allow: ['error', 'warn'], // Specify console.error / .warn as allowable methods
        },
      ], */
    },
  },
]);
