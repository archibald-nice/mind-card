import { Card } from '@/types/card';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import React from 'react';

interface BreadcrumbProps {
  currentPath: Card[];
  onNavigateBack: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPath,
  onNavigateBack,
}) => {
  const items = [
    {
      title: (
        <button
          type="button"
          onClick={() => onNavigateBack(-1)}
          className="breadcrumb-item flex items-center space-x-1 hover:text-blue-600 transition-colors"
        >
          <HomeOutlined />
          <span>根目录</span>
        </button>
      ),
    },
    ...currentPath.map((card, index) => ({
      title: (
        <button
          type="button"
          onClick={() => onNavigateBack(index)}
          className="breadcrumb-item max-w-xs truncate hover:text-blue-600 transition-colors"
        >
          {card.title}
        </button>
      ),
    })),
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <AntBreadcrumb
          items={items}
          separator={<RightOutlined className="text-gray-400 text-sm" />}
        />
      </div>
    </div>
  );
};

export default Breadcrumb;
