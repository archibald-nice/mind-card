import { Card, CardState } from '@/types/card';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CardState = {
  cards: {
    root: [],
  },
  currentPath: [],
  searchQuery: '',
  loading: false,
};

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<Record<string, Card[]>>) => {
      state.cards = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<Card[]>) => {
      state.currentPath = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addCard: (
      state,
      action: PayloadAction<{ parentId: string; card: Card }>,
    ) => {
      const { parentId, card } = action.payload;
      if (!state.cards[parentId]) {
        state.cards[parentId] = [];
      }
      state.cards[parentId].push(card);
    },
    updateCard: (
      state,
      action: PayloadAction<{
        parentId: string;
        cardId: string;
        updates: Partial<Card>;
      }>,
    ) => {
      const { parentId, cardId, updates } = action.payload;
      const cardIndex = state.cards[parentId].findIndex(
        card => card.id === cardId,
      );
      if (cardIndex !== -1) {
        state.cards[parentId][cardIndex] = {
          ...state.cards[parentId][cardIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteCard: (
      state,
      action: PayloadAction<{ parentId: string; cardId: string }>,
    ) => {
      const { parentId, cardId } = action.payload;
      state.cards[parentId] = state.cards[parentId].filter(
        card => card.id !== cardId,
      );
    },
    clearCards: state => {
      state.cards = { root: [] };
      state.currentPath = [];
      state.searchQuery = '';
    },
  },
});

export const {
  setCards,
  setCurrentPath,
  setSearchQuery,
  setLoading,
  addCard,
  updateCard,
  deleteCard,
  clearCards,
} = cardSlice.actions;

export default cardSlice.reducer;
