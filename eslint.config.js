import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist', 'playwright-report', 'test-results'] },
  { files: ['**/*.{ts,tsx}'], languageOptions: { parser: tseslint.parser, ecmaVersion: 2022, globals: { ...globals.browser, ...globals.node }, parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } } }, plugins: { '@typescript-eslint': tseslint.plugin, 'react-hooks': reactHooks, 'react-refresh': reactRefresh }, rules: { ...js.configs.recommended.rules, ...reactHooks.configs.recommended.rules, ...reactRefresh.configs.vite.rules, '@typescript-eslint/no-unused-vars': 'off', 'no-unused-vars': 'off', 'no-undef': 'off', 'no-empty': ['error', {allowEmptyCatch:true}] } }
]
