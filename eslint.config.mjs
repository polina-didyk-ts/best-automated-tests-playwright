import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['playwright-report/', 'test-results/', 'blob-report/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    // Playwright-specific rules (missing await, hard waits, tests without expect, etc.)
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
  },
  prettier, // keep last: turns off rules that conflict with Prettier
);
