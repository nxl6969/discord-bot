// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [

  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'arrow-parens': 'off',
    'comma-dangle': ['warn', 'never'],
    'generator-star-spacing': 'off',
    'semi': ['warn', 'always'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}

