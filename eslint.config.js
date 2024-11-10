import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,

  {
    files: ['**/src/*', '**/tests/*'],
  },

  {
    ignores: ['**/node_modules/*', '**/dist/*'],
  },

  {
    rules: {
      semi: ['error', 'never'],
    },
  },
]
