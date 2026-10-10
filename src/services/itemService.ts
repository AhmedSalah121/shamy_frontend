import { apiClient } from './apiClient';
import { OrderItem, AddItemRequest, UpdateItemRequest, MyItemsResponse } from '@/types';

export class ItemService {
  public async addItem(orderId: number, payload: AddItemRequest): Promise<OrderItem> {
    return apiClient.request<OrderItem>(`/orders/${orderId}/items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async updateItem(orderId: number, itemId: number, payload: UpdateItemRequest): Promise<OrderItem> {
    return apiClient.request<OrderItem>(`/orders/${orderId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  public async deleteItem(orderId: number, itemId: number): Promise<{ success: boolean }> {
    return apiClient.request<{ success: boolean }>(`/orders/${orderId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  public async getMyItems(orderId: number): Promise<MyItemsResponse> {
    return apiClient.request<MyItemsResponse>(`/orders/${orderId}/my-items`, {
      method: 'GET',
    });
  }
}

export const itemService = new ItemService();
