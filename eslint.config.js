import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        Worker: 'readonly',
        MessageEvent: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        HTMLElement: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        self: 'readonly',
        DedicatedWorkerGlobalScope: 'readonly',
        React: 'readonly',
        ReactJSX: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'error'
    }
  },
  {
    ignores: ['dist/', 'node_modules/']
  }
]
