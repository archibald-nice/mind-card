// Prettier 配置文件 - 代码格式化规则
module.exports = {
  // 基础格式化选项
  printWidth: 80, // 单行代码最大字符数，超过则换行
  singleQuote: true, // 使用单引号而非双引号
  trailingComma: 'all', // 在对象、数组等末尾添加逗号，便于版本控制
  proseWrap: 'never', // 不自动换行文档内容，保持原有格式

  // JavaScript/TypeScript 语法选项
  semi: true, // 语句末尾添加分号，企业开发标准
  tabWidth: 2, // 缩进使用2个空格
  useTabs: false, // 使用空格而非Tab字符进行缩进
  bracketSpacing: true, // 对象字面量括号内添加空格 { foo: bar }
  bracketSameLine: false, // JSX 标签的 > 符号单独占一行，提高可读性
  arrowParens: 'avoid', // 箭头函数单参数时省略括号 x => x

  // 跨平台兼容性
  endOfLine: 'lf', // 统一使用 LF 换行符，避免 Windows/Unix 差异导致的 Git 冲突

  // 特定文件类型的格式化规则覆盖
  overrides: [
    {
      // .prettierrc 文件本身的解析规则
      files: '.prettierrc',
      options: { parser: 'json' },
    },
    {
      // Markdown 文件特殊处理
      files: '*.md',
      options: {
        proseWrap: 'preserve', // 保持 Markdown 原有的换行格式
        printWidth: 100, // Markdown 使用更宽的行宽，适合文档阅读
      },
    },
  ],

  // Prettier 插件扩展
  plugins: [
    'prettier-plugin-organize-imports', // 自动整理和排序 import 语句
    'prettier-plugin-packagejson', // 格式化 package.json 文件
  ],
};
