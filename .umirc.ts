import { defineConfig } from '@umijs/max';

/**
 * antd: {} => 把 Ant Design 全家桶（组件、图标、主题变量、国际化、暗黑模式）全部 一次性引入并自动按需加载
 * access: {} => 开启权限控制
 * model: {} => 启用 数据流插件（基于 dva 或 valtio）
 * initialState: {} => 开启初始状态（如用户信息）
 * request: {} => 开启请求插件（基于 axios）
 * layout: { title: '@umijs/max' } => 启用 ProLayout（Ant Design Pro 的官方布局）
 * proxy: {...} => 配置代理
 * routes: [...] => 配置路由
 * npmClient: 'pnpm' => 使用 pnpm 作为包管理器
 */
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Mind Card',
    // 启用顶部导航模式
    navTheme: 'light',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: true,
    colorPrimary: '#1976d2',
    splitMenus: false,
    // 配置菜单项
    menu: {
      locale: false,
    },
  },
  extraPostCSSPlugins: [require('autoprefixer')],
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      // 不需要pathRewrite，保持/api前缀
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '思维卡片',
      path: '/mind-card',
      component: './MindCard',
    },
  ],
  npmClient: 'pnpm',
});
