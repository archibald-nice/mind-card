import Breadcrumb from '@/components/MindCard/Breadcrumb';
import CardSpace from '@/components/MindCard/CardSpace';
import {
  createMindCard,
  deleteMindCard,
  getMindCards,
  updateMindCard,
} from '@/services/mindCard';
import {
  useAppDispatch,
  useCards,
  useCurrentPath,
  useSearchQuery,
} from '@/store/redux/hooks';
import {
  addCard,
  deleteCard as deleteCardAction,
  setCards,
  setCurrentPath,
  setLoading,
  setSearchQuery,
  updateCard as updateCardAction,
} from '@/store/redux/slices/cardSlice';
import { Card } from '@/types/card';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';

const MindCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const cards = useCards();
  const currentPath = useCurrentPath();
  const searchQuery = useSearchQuery();

  const getCurrentCardId = useCallback(() => {
    return currentPath.length > 0
      ? currentPath[currentPath.length - 1].id
      : 'root';
  }, [currentPath]);

  const getCurrentCards = useCallback(() => {
    const currentId = getCurrentCardId();
    return cards[currentId] || [];
  }, [cards, getCurrentCardId]);

  const loadCards = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const parentId =
        getCurrentCardId() === 'root' ? undefined : getCurrentCardId();
      const response = await getMindCards(parentId);

      // 转换API响应到我们的状态结构
      const cardData: Record<string, Card[]> = {
        root: [],
      };

      // 这里需要根据实际API响应结构进行调整
      if (Array.isArray(response)) {
        response.forEach(card => {
          const cardParentId = card.parentId || 'root';
          if (!cardData[cardParentId]) {
            cardData[cardParentId] = [];
          }
          cardData[cardParentId].push(card);
        });
      }

      dispatch(setCards(cardData));
    } catch (error) {
      console.error('Error loading cards:', error);
      dispatch(setCards({ root: [] }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, getCurrentCardId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const navigateToCard = useCallback(
    (card: Card) => {
      dispatch(setCurrentPath([...currentPath, card]));
    },
    [currentPath, dispatch],
  );

  const navigateBack = useCallback(
    (index: number) => {
      if (index === -1) {
        dispatch(setCurrentPath([]));
      } else {
        dispatch(setCurrentPath(currentPath.slice(0, index + 1)));
      }
    },
    [currentPath, dispatch],
  );

  const handleCreateCard = useCallback(
    async (
      title: string,
      content = '',
      position?: { x: number; y: number },
    ) => {
      try {
        const parentId = getCurrentCardId();
        const newCard = await createMindCard({
          title,
          content,
          parentId: parentId === 'root' ? undefined : parentId,
          position: position || {
            x: Math.random() * 400,
            y: Math.random() * 300,
          },
          tags: [],
        });

        dispatch(
          addCard({
            parentId: parentId,
            card: newCard,
          }),
        );
      } catch (error) {
        console.error('Error creating card:', error);
      }
    },
    [dispatch, getCurrentCardId],
  );

  const handleUpdateCard = useCallback(
    async (id: string, updates: Partial<Card>) => {
      try {
        await updateMindCard(id, updates);
        const parentId = getCurrentCardId();

        dispatch(
          updateCardAction({
            parentId,
            cardId: id,
            updates,
          }),
        );
      } catch (error) {
        console.error('Error updating card:', error);
      }
    },
    [dispatch, getCurrentCardId],
  );

  const handleDeleteCard = useCallback(
    async (id: string) => {
      try {
        await deleteMindCard(id);
        const parentId = getCurrentCardId();

        dispatch(
          deleteCardAction({
            parentId,
            cardId: id,
          }),
        );
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    },
    [dispatch, getCurrentCardId],
  );

  return (
    <Box>
      {/* 面包屑导航 */}
      <Breadcrumb currentPath={currentPath} onNavigateBack={navigateBack} />

      {/* 操作栏 */}
      <Box
        sx={{
          mt: 1,
          mb: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* 搜索和添加按钮 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            minWidth: { xs: '100%', sm: 'auto' },
          }}
        >
          <TextField
            placeholder="搜索卡片..."
            value={searchQuery}
            onChange={e => dispatch(setSearchQuery(e.target.value))}
            size="small"
            variant="outlined"
            sx={{
              width: { xs: '100%', sm: 280 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused': {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: searchQuery ? 'primary.main' : 'text.secondary',
                      fontSize: 20,
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => dispatch(setSearchQuery(''))}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleCreateCard('新卡片')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 500,
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            新建卡片
          </Button>
        </Box>
      </Box>

      {/* 卡片统计信息 */}
      <Box
        sx={{
          mt: 1,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'text.secondary',
          fontSize: '0.875rem',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            总计: <strong>{getCurrentCards().length}</strong> 张卡片
          </Typography>
        </Box>
        {searchQuery && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="primary.main">
              搜索结果: <strong>{getCurrentCards().length}</strong> 张卡片
            </Typography>
          </Box>
        )}
      </Box>

      {/* 卡片容器 */}
      <CardSpace
        cards={getCurrentCards()}
        searchQuery={searchQuery}
        onCardClick={navigateToCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onCreateCard={handleCreateCard}
      />
    </Box>
  );
};

export default MindCard;
