import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// 类型化的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 便捷的选择器 hooks
export const useUserInfo = () => useAppSelector(state => state.user.userInfo);
export const useToken = () => useAppSelector(state => state.user.token);
export const useIsLoggedIn = () =>
  useAppSelector(state => state.user.isLoggedIn);

export const useTheme = () => useAppSelector(state => state.global.theme);
export const useLanguage = () => useAppSelector(state => state.global.language);
export const useCollapsed = () =>
  useAppSelector(state => state.global.collapsed);
export const useLoading = () => useAppSelector(state => state.global.loading);

export const useCurrentRoute = () =>
  useAppSelector(state => state.app.currentRoute);
export const useBreadcrumbs = () =>
  useAppSelector(state => state.app.breadcrumbs);
