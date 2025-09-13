import { Card, CreateCardParams, UpdateCardParams } from '@/types/card';
import { request } from '@umijs/max';

// 模拟 API 响应数据结构
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ListResponse {
  items: Array<{
    objectId: string;
    objectData: Card;
    createdAt: string;
    updatedAt: string;
  }>;
}

// 获取卡片列表
export async function getMindCards(parentId?: string): Promise<Card[]> {
  try {
    // 模拟 API 调用 - 这里应该调用真实的后端 API
    const response: ApiResponse<ListResponse> = await request(
      '/api/mind-cards',
      {
        method: 'GET',
        params: { parentId },
      },
    );

    if (response.success) {
      return response.data.items.map(item => ({
        id: item.objectId,
        ...item.objectData,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    return [];
  }
}

// 创建卡片
export async function createMindCard(
  params: CreateCardParams & { parentId?: string },
): Promise<Card> {
  try {
    const response: ApiResponse<Card> = await request('/api/mind-cards', {
      method: 'POST',
      data: params,
    });

    if (response.success) {
      return {
        id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...params,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    throw new Error(response.message || 'Failed to create card');
  } catch (error) {
    console.error('Failed to create card:', error);
    throw error;
  }
}

// 更新卡片
export async function updateMindCard(
  id: string,
  updates: UpdateCardParams,
): Promise<Card> {
  try {
    const response: ApiResponse<Card> = await request(`/api/mind-cards/${id}`, {
      method: 'PUT',
      data: updates,
    });

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update card');
  } catch (error) {
    console.error('Failed to update card:', error);
    throw error;
  }
}

// 删除卡片
export async function deleteMindCard(id: string): Promise<void> {
  try {
    const response: ApiResponse<void> = await request(`/api/mind-cards/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete card');
    }
  } catch (error) {
    console.error('Failed to delete card:', error);
    throw error;
  }
}

// 搜索卡片
export async function searchMindCards(query: string): Promise<Card[]> {
  try {
    const response: ApiResponse<Card[]> = await request(
      '/api/mind-cards/search',
      {
        method: 'GET',
        params: { q: query },
      },
    );

    if (response.success) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Failed to search cards:', error);
    return [];
  }
}
