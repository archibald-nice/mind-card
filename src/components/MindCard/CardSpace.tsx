import { Card as CardType, Position } from '@/types/card';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, Container, Fab, Typography } from '@mui/material';
import React, { useState } from 'react';
import Card from './Card';

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
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).tagName === 'INPUT' ||
      (e.target as HTMLElement).tagName === 'TEXTAREA'
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
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <Box
        className="card-space"
        sx={{
          position: 'relative',
          minHeight: 600,
          backgroundColor: '#ffffff',
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          cursor: 'crosshair',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      >
        {filteredCards.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              color: '#9ca3af',
            }}
          >
            <AddIcon sx={{ fontSize: 64, mb: 2, color: '#e0e0e0' }} />
            <Typography variant="h6" sx={{ mb: 1, color: '#6b7280' }}>
              暂无卡片
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              双击空白区域创建新卡片
            </Typography>
          </Box>
        ) : (
          filteredCards.map(card => (
            <Box
              key={card.id}
              onMouseDown={e => handleMouseDown(e, card)}
              sx={{ cursor: draggedCard?.id === card.id ? 'grabbing' : 'grab' }}
            >
              <Card
                card={card}
                onClick={onCardClick}
                onUpdate={onUpdateCard}
                onDelete={onDeleteCard}
                isDragging={draggedCard?.id === card.id}
              />
            </Box>
          ))
        )}

        {filteredCards.length > 0 && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 56,
              height: 56,
              boxShadow: 4,
              '&:hover': {
                boxShadow: 8,
              },
            }}
            onClick={() => onCreateCard('新卡片')}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
    </Container>
  );
};

export default CardSpace;
