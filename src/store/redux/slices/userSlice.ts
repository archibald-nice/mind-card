import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 主题类型
export type ThemeType = 'light' | 'dark';

// 语言类型
export type LanguageType = 'zh-CN' | 'en-US';

// 用户信息接口
export interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

// 用户状态接口
interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  isLoggedIn: boolean;
}

// 初始状态
const initialState: UserState = {
  userInfo: null,
  token: null,
  isLoggedIn: false,
};

// 创建用户 slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },

    // 设置 token
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    // 登录
    login: (
      state,
      action: PayloadAction<{ userInfo: UserInfo; token: string }>,
    ) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },

    // 登出
    logout: state => {
      state.userInfo = null;
      state.token = null;
      state.isLoggedIn = false;
      // 清除本地存储
      localStorage.removeItem('token');
    },

    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
  },
});

// 导出 actions
export const { setUserInfo, setToken, login, logout, updateUserInfo } =
  userSlice.actions;

// 导出 reducer
export default userSlice.reducer;

// 导出选择器
export const selectUserInfo = (state: { user: UserState }) =>
  state.user.userInfo;
export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectIsLoggedIn = (state: { user: UserState }) =>
  state.user.isLoggedIn;
