import Breadcrumb from '@/components/MindCard/Breadcrumb';
import CardSpace from '@/components/MindCard/CardSpace';
import Header from '@/components/MindCard/Header';
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
    <div className="app-container">
      {/* Header 顶部栏 */}
      <Header
        onCreateCard={() => handleCreateCard('新卡片')}
        searchQuery={searchQuery}
        onSearchChange={value => dispatch(setSearchQuery(value))}
      />

      {/* 面包屑导航 */}
      <Breadcrumb currentPath={currentPath} onNavigateBack={navigateBack} />

      {/* 卡片容器 */}
      <CardSpace
        cards={getCurrentCards()}
        searchQuery={searchQuery}
        onCardClick={navigateToCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onCreateCard={handleCreateCard}
      />
    </div>
  );
};

export default MindCard;
