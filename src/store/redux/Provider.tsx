import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

// Redux Provider 组件
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
