// 运行时配置

import { ReduxProvider } from '@/store/redux/Provider';
import React from 'react';
import './global.css';

// 全局初始化数据配置
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    // 禁用页面标题显示
    pageTitleRender: false,
    // 禁用页脚
    footerRender: false,
    // 禁用页面头部
    pageHeaderRender: false,
    // 强制使用顶部导航
    layout: 'top',
    // 禁用侧边栏
    siderWidth: 0,
    collapsed: true,
    hideMenus: true,
    // 自定义内容区域样式
    contentStyle: {
      padding: '4px 16px', // 上下4px，左右16px
      margin: 0,
    },
  };
};

// 配置根组件
export function rootContainer(container: React.ReactNode) {
  return React.createElement(ReduxProvider, null, container);
}
