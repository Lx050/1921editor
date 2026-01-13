import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import * as parserVue from 'vue-eslint-parser'

export default [
  // 忽略的文件和目录
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'src/dist/**',
      'build/**',
      'coverage/**',
      '.nyc_output/**',
      'content-backend/**',
      'public/**',
      'static/**',
      '*.min.js',
      'temp/**',
      'tmp/**'
    ]
  },

  // JavaScript/TypeScript 基础配置
  js.configs.recommended,

  // Vue 配置
  ...pluginVue.configs['flat/recommended'],

  // TypeScript 配置
  ...tseslint.configs.recommended,

  // 脚本文件配置 (Node.js 环境)
  {
    files: ['scripts/**/*.js', 'config/**/*.js'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },

  // 自定义规则
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tseslint.parser
      },
      globals: {
        BigInt: 'readonly',
        IntersectionObserver: 'readonly',
        RequestInit: 'readonly',
        HeadersInit: 'readonly'
      }
    },
    rules: {
      // Vue 规则调整
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/no-reserved-component-names': 'off',

      // Vue 格式规则 - 交给 Prettier 处理
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/attributes-order': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',

      // TypeScript 规则调整
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // 通用规则
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-constant-condition': 'off',
      'no-undef': 'off', // TypeScript 已处理
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
]
