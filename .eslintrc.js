module.exports = {
  extends: [
    require.resolve('@umijs/max/eslint'),
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', // 将 any 类型从错误降级为警告
  },
};
