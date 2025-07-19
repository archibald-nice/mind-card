import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 面包屑导航项
export interface BreadcrumbItem {
  title: string;
  path?: string;
}

// 应用状态接口
interface AppState {
  currentRoute: string;
  breadcrumbs: BreadcrumbItem[];
}

// 初始状态
const initialState: AppState = {
  currentRoute: '/',
  breadcrumbs: [],
};

// 创建应用状态 slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // 设置当前路由
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
    },

    // 设置面包屑导航
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },

    // 添加面包屑项
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      state.breadcrumbs.push(action.payload);
    },

    // 清空面包屑
    clearBreadcrumbs: state => {
      state.breadcrumbs = [];
    },
  },
});

// 导出 actions
export const {
  setCurrentRoute,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
} = appSlice.actions;

// 导出 reducer
export default appSlice.reducer;

// 导出选择器
export const selectCurrentRoute = (state: { app: AppState }) =>
  state.app.currentRoute;
export const selectBreadcrumbs = (state: { app: AppState }) =>
  state.app.breadcrumbs;
