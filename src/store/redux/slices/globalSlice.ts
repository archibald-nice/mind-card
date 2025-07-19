import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 主题类型
export type ThemeType = 'light' | 'dark';

// 语言类型
export type LanguageType = 'zh-CN' | 'en-US';

// 全局状态接口
interface GlobalState {
  theme: ThemeType;
  language: LanguageType;
  collapsed: boolean; // 侧边栏折叠状态
  loading: boolean; // 全局加载状态
}

// 初始状态
const initialState: GlobalState = {
  theme: 'light',
  language: 'zh-CN',
  collapsed: false,
  loading: false,
};

// 创建全局配置 slice
const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // 设置主题
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    },

    // 设置语言
    setLanguage: (state, action: PayloadAction<LanguageType>) => {
      state.language = action.payload;
    },

    // 设置侧边栏折叠状态
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },

    // 设置全局加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // 切换主题
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // 切换侧边栏折叠状态
    toggleCollapsed: state => {
      state.collapsed = !state.collapsed;
    },
  },
});

// 导出 actions
export const {
  setTheme,
  setLanguage,
  setCollapsed,
  setLoading,
  toggleTheme,
  toggleCollapsed,
} = globalSlice.actions;

// 导出 reducer
export default globalSlice.reducer;

// 导出选择器
export const selectTheme = (state: { global: GlobalState }) =>
  state.global.theme;
export const selectLanguage = (state: { global: GlobalState }) =>
  state.global.language;
export const selectCollapsed = (state: { global: GlobalState }) =>
  state.global.collapsed;
export const selectLoading = (state: { global: GlobalState }) =>
  state.global.loading;
