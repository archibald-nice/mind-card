import { Card as CardType, UpdateCardParams } from '@/types/card';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import styles from './Card.module.less';

interface CardProps {
  card: CardType;
  onClick: (card: CardType) => void;
  onUpdate: (id: string, updates: UpdateCardParams) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  onClick,
  onUpdate,
  onDelete,
  isDragging = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [content, setContent] = useState(card.content || '');

  const handleSave = () => {
    onUpdate(card.id, { title, content });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(card.title);
    setContent(card.content || '');
    setIsEditing(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isEditing && (e.target as HTMLElement).tagName !== 'BUTTON') {
      onClick(card);
    }
  };

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      style={{
        position: 'absolute',
        left: `${card.position?.x || 0}px`,
        top: `${card.position?.y || 0}px`,
        width: '280px',
        minHeight: '160px',
      }}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 text-lg font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
            autoFocus
          />
        ) : (
          <h3 className="text-lg font-semibold text-gray-900 flex-1 cursor-pointer">
            {card.title}
          </h3>
        )}

        <div className="flex items-center space-x-1 ml-2">
          {isEditing ? (
            <>
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={handleSave}
                className="text-green-600 hover:bg-green-50"
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={handleCancel}
                className="text-gray-600 hover:bg-gray-50"
              />
            </>
          ) : (
            <>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={e => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-gray-600 hover:bg-gray-50"
              />
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={e => {
                  e.stopPropagation();
                  if (confirm('确定要删除这张卡片吗？')) {
                    onDelete(card.id);
                  }
                }}
                className="text-red-600 hover:bg-red-50"
              />
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full h-20 text-sm text-gray-600 bg-transparent border border-gray-300 rounded p-2 resize-none focus:outline-none focus:border-blue-500"
          placeholder="添加卡片内容..."
        />
      ) : (
        <>
          {card.content && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {card.content}
            </p>
          )}

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>点击进入卡片空间</span>
            <RightOutlined className="text-blue-500" />
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
