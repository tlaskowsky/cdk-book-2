// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      es2021: true,
      jest: true, // Add this if you use Jest for testing
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
      // 'prettier', // Uncomment if you integrate Prettier later
    ],
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint', // Loads the TypeScript plugin
    ],
    rules: {
      // Add any specific rule overrides here if needed later
      // Example: '@typescript-eslint/no-unused-vars': 'warn',
    },
    ignorePatterns: [
      'cdk.out', // Ignore the CDK output directory
      'node_modules', // Ignore dependencies
      '*.js', // Ignore compiled JavaScript files (usually)
      '*.d.ts', // Ignore TypeScript definition files
    ],
   };