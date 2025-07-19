// Redux Toolkit 主入口文件
export { persistor, default as store } from './store';
export type { AppDispatch, RootState } from './store';

// 导出所有 actions
export {
  login,
  logout,
  selectIsLoggedIn,
  selectToken,
  selectUserInfo,
  setToken,
  setUserInfo,
  updateUserInfo,
} from './slices/userSlice';

export {
  selectCollapsed,
  selectLanguage,
  selectLoading,
  selectTheme,
  setCollapsed,
  setLanguage,
  setLoading,
  setTheme,
  toggleCollapsed,
  toggleTheme,
} from './slices/globalSlice';

export {
  addBreadcrumb,
  clearBreadcrumbs,
  selectBreadcrumbs,
  selectCurrentRoute,
  setBreadcrumbs,
  setCurrentRoute,
} from './slices/appSlice';

// 导出 hooks
export {
  useAppDispatch,
  useAppSelector,
  useBreadcrumbs,
  useCollapsed,
  useCurrentRoute,
  useIsLoggedIn,
  useLanguage,
  useLoading,
  useTheme,
  useToken,
  useUserInfo,
} from './hooks';

// 导出 Provider
export { default as ReduxProvider } from './Provider';

// 导出类型
export type { BreadcrumbItem } from './slices/appSlice';
export type { LanguageType, ThemeType, UserInfo } from './slices/userSlice';
