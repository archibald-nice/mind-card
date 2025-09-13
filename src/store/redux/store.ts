import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 导入各个 slice
import appSlice from './slices/appSlice';
import cardSlice from './slices/cardSlice';
import globalSlice from './slices/globalSlice';
import userSlice from './slices/userSlice';

// 合并所有 reducers
const rootReducer = combineReducers({
  user: userSlice,
  global: globalSlice,
  app: appSlice,
  cards: cardSlice,
});

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  // 只持久化 user 和 global 状态
  whitelist: ['user', 'global'],
};

// 创建持久化 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置 store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// 创建持久化存储
export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出 store 和 persistor
export { store as default };
