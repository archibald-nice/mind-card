import { Card as CardType, UpdateCardParams } from '@/types/card';
import {
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  Box,
  CardContent,
  IconButton,
  Card as MuiCard,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

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
    <MuiCard
      sx={{
        position: 'absolute',
        left: `${card.position?.x || 0}px`,
        top: `${card.position?.y || 0}px`,
        width: 280,
        minHeight: 160,
        cursor: isDragging ? 'grabbing' : 'pointer',
        boxShadow: isDragging ? 8 : 2,
        opacity: isDragging ? 0.8 : 1,
        transition: isDragging ? 'none' : 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          {isEditing ? (
            <TextField
              value={title}
              onChange={e => setTitle(e.target.value)}
              variant="standard"
              fullWidth
              autoFocus
              sx={{
                '& .MuiInput-root': {
                  fontSize: '1.125rem',
                  fontWeight: 600,
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#111827',
                flex: 1,
                cursor: 'pointer',
              }}
            >
              {card.title}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            {isEditing ? (
              <>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  sx={{ color: '#16a34a' }}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleCancel}
                  sx={{ color: '#6b7280' }}
                >
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  sx={{ color: '#6b7280' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    if (confirm('确定要删除这张卡片吗？')) {
                      onDelete(card.id);
                    }
                  }}
                  sx={{ color: '#dc2626' }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {isEditing ? (
          <TextField
            value={content}
            onChange={e => setContent(e.target.value)}
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            placeholder="添加卡片内容..."
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
              },
            }}
          />
        ) : (
          <>
            {card.content && (
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {card.content}
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                点击进入卡片空间
              </Typography>
              <ArrowForwardIcon sx={{ color: '#1976d2', fontSize: 16 }} />
            </Box>
          </>
        )}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
