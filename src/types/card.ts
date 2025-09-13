export interface Position {
  x: number;
  y: number;
}

export interface Card {
  id: string;
  title: string;
  content?: string;
  position?: Position;
  parentId?: string | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardParams {
  title: string;
  content?: string;
  position: Position;
  tags?: string[];
}

export interface UpdateCardParams {
  title?: string;
  content?: string;
  position?: Position;
  tags?: string[];
}

export interface CardState {
  cards: Record<string, Card[]>; // parentId -> Card[]
  currentPath: Card[];
  searchQuery: string;
  loading: boolean;
}
