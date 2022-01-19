module.exports = {
  extends: [ 
    '@antfu'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    'no-console': 'warn',
    'curly': ['error', 'multi-line'],
  }
}