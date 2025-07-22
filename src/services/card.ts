import { request } from '@umijs/max';

export interface CardDTO {
  id?: number;
  title: string;
  content?: string;
  category?: string;
  tags?: string;
  priority?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  color?: string;
  isFavorite?: boolean;
  isPublic?: boolean;
  viewCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 获取所有卡片
export async function getAllCards() {
  return request<ApiResponse<CardDTO[]>>('/api/cards');
}

// 分页获取卡片
export async function getCards(params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}) {
  return request<ApiResponse<PageResult<CardDTO>>>('/api/cards/page', {
    method: 'GET',
    params,
  });
}

// 根据ID获取卡片
export async function getCardById(id: number) {
  return request<ApiResponse<CardDTO>>(`/api/cards/${id}`);
}

// 创建卡片
export async function createCard(card: CardDTO) {
  return request<ApiResponse<CardDTO>>('/api/cards', {
    method: 'POST',
    data: card,
  });
}

// 更新卡片
export async function updateCard(id: number, card: CardDTO) {
  return request<ApiResponse<CardDTO>>(`/api/cards/${id}`, {
    method: 'PUT',
    data: card,
  });
}

// 删除卡片（软删除）
export async function deleteCard(id: number) {
  return request<ApiResponse<void>>(`/api/cards/${id}`, {
    method: 'DELETE',
  });
}

// 物理删除卡片
export async function hardDeleteCard(id: number) {
  return request<ApiResponse<void>>(`/api/cards/${id}/hard`, {
    method: 'DELETE',
  });
}

// 搜索卡片
export async function searchCards(params: {
  keyword: string;
  page?: number;
  size?: number;
}) {
  return request<ApiResponse<PageResult<CardDTO>>>('/api/cards/search', {
    method: 'GET',
    params,
  });
}

// 根据状态分页获取卡片
export async function getCardsByStatus(params: {
  status: string;
  page?: number;
  size?: number;
}) {
  return request<ApiResponse<PageResult<CardDTO>>>(
    `/api/cards/status/${params.status}`,
    {
      method: 'GET',
      params: {
        page: params.page,
        size: params.size,
      },
    },
  );
}

// 根据分类获取卡片
export async function getCardsByCategory(category: string) {
  return request<ApiResponse<CardDTO[]>>(`/api/cards/category/${category}`);
}

// 根据标签获取卡片
export async function getCardsByTag(tag: string) {
  return request<ApiResponse<CardDTO[]>>(`/api/cards/tag/${tag}`);
}

// 根据优先级获取卡片
export async function getCardsByPriority(priority: number) {
  return request<ApiResponse<CardDTO[]>>(`/api/cards/priority/${priority}`);
}

// 获取收藏的卡片
export async function getFavoriteCards() {
  return request<ApiResponse<CardDTO[]>>('/api/cards/favorites');
}

// 获取公开的卡片
export async function getPublicCards() {
  return request<ApiResponse<CardDTO[]>>('/api/cards/public');
}

// 获取热门卡片
export async function getPopularCards(params: {
  page?: number;
  size?: number;
}) {
  return request<ApiResponse<PageResult<CardDTO>>>('/api/cards/popular', {
    method: 'GET',
    params,
  });
}

// 切换收藏状态
export async function toggleFavorite(id: number) {
  return request<ApiResponse<CardDTO>>(`/api/cards/${id}/favorite`, {
    method: 'PUT',
  });
}

// 切换公开状态
export async function togglePublic(id: number) {
  return request<ApiResponse<CardDTO>>(`/api/cards/${id}/public`, {
    method: 'PUT',
  });
}

// 更新卡片状态
export async function updateCardStatus(id: number, status: string) {
  return request<ApiResponse<CardDTO>>(`/api/cards/${id}/status`, {
    method: 'PUT',
    params: { status },
  });
}

// 批量删除卡片
export async function batchDeleteCards(ids: number[]) {
  return request<ApiResponse<void>>('/api/cards/batch', {
    method: 'DELETE',
    data: ids,
  });
}

// 批量更新状态
export async function batchUpdateStatus(ids: number[], status: string) {
  return request<ApiResponse<void>>('/api/cards/batch/status', {
    method: 'PUT',
    data: ids,
    params: { status },
  });
}

// 获取统计信息
export async function getStatistics() {
  return request<ApiResponse<Record<string, any>>>('/api/cards/statistics');
}
