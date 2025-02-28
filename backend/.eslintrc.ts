import js from '@eslint/js'
import globals from 'globals'
import node from 'eslint-plugin-node'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'

export default tseslint.config(
  { ignores: ['dist'] },
  ...tseslint.configs.recommended,
  js.configs.recommended,
  node.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: {
      node,
      prettier,
    },
    rules: {
      'node/no-missing-import': 'error',
      'node/no-unpublished-import': 'off',
      'node/no-unsupported-features/es-syntax': 'off',

      'prettier/prettier': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': 'error',

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'no-process-exit': 'error',
    },
  },
)
