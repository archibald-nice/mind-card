import {
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Input } from 'antd';
import React from 'react';

interface HeaderProps {
  onCreateCard: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onCreateCard,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">数字化卡片看板</h1>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <Input
              placeholder="搜索卡片..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              allowClear
            />
          </div>

          <div className="flex items-center space-x-3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateCard}
            >
              新建卡片
            </Button>

            <Button type="text" icon={<SettingOutlined />} />

            <Button type="text" icon={<QuestionCircleOutlined />} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
