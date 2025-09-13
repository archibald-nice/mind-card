import { Card as CardType, Position } from '@/types/card';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import Card from './Card';
import styles from './CardSpace.module.less';

interface CardSpaceProps {
  cards: CardType[];
  searchQuery: string;
  onCardClick: (card: CardType) => void;
  onUpdateCard: (id: string, updates: Partial<CardType>) => void;
  onDeleteCard: (id: string) => void;
  onCreateCard: (title: string, content?: string, position?: Position) => void;
}

const CardSpace: React.FC<CardSpaceProps> = ({
  cards,
  searchQuery,
  onCardClick,
  onUpdateCard,
  onDeleteCard,
  onCreateCard,
}) => {
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const filteredCards = cards.filter(
    card =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.content &&
        card.content.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleMouseDown = (e: React.MouseEvent, card: CardType) => {
    if (
      (e.target as HTMLElement).tagName === 'BUTTON' ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect =
      e.currentTarget.parentElement?.getBoundingClientRect();

    if (containerRect) {
      setDraggedCard(card);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedCard) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    onUpdateCard(draggedCard.id, {
      position: {
        x: Math.max(0, Math.min(newX, containerRect.width - 280)),
        y: Math.max(0, Math.min(newY, containerRect.height - 160)),
      },
    });
  };

  const handleMouseUp = () => {
    setDraggedCard(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 140;
      const y = e.clientY - rect.top - 80;
      onCreateCard('新卡片', '', { x: Math.max(0, x), y: Math.max(0, y) });
    }
  };

  return (
    <div
      className={styles.cardSpace}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {filteredCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-96 text-gray-500">
          <PlusOutlined className="text-6xl mb-4 text-gray-300" />
          <p className="text-lg mb-2">暂无卡片</p>
          <p className="text-sm">双击空白区域创建新卡片</p>
        </div>
      ) : (
        filteredCards.map(card => (
          <div key={card.id} onMouseDown={e => handleMouseDown(e, card)}>
            <Card
              card={card}
              onClick={onCardClick}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
              isDragging={draggedCard?.id === card.id}
            />
          </div>
        ))
      )}

      {filteredCards.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => onCreateCard('新卡片')}
            className="w-14 h-14 shadow-lg hover:shadow-xl transition-all"
          />
        </div>
      )}
    </div>
  );
};

export default CardSpace;
