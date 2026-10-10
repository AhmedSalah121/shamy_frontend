import { apiClient } from './apiClient';
import { Order, CreateOrderRequest, SettleOrderRequest, BillBreakdown } from '@/types';

export class OrderService {
  public async getOrders(): Promise<Order[]> {
    return apiClient.request<Order[]>('/orders', { method: 'GET' });
  }

  public async getOrder(id: number): Promise<Order> {
    return apiClient.request<Order>(`/orders/${id}`, { method: 'GET' });
  }

  public async createOrder(payload: CreateOrderRequest): Promise<Order> {
    return apiClient.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async joinOrder(id: number, inviteCode?: string): Promise<{ success: boolean; order: Order }> {
    return apiClient.request<{ success: boolean; order: Order }>(`/orders/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  }

  public async leaveOrder(id: number): Promise<{ success: boolean }> {
    return apiClient.request<{ success: boolean }>(`/orders/${id}/leave`, {
      method: 'POST',
    });
  }

  public async settleOrder(id: number, payload: SettleOrderRequest): Promise<{ success: boolean; bills: BillBreakdown }> {
    return apiClient.request<{ success: boolean; bills: BillBreakdown }>(`/orders/${id}/settle`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async pickHero(id: number): Promise<{
    hero: { id: number; name: string; email: string; instapayHandle?: string | null; phoneNumber?: string | null };
    message: string;
  }> {
    return apiClient.request(`/orders/${id}/pick-hero`, {
      method: 'POST',
    });
  }

  public async broadcastArrived(id: number): Promise<{
    success: boolean;
    message: string;
    order: { id: number; status: string };
  }> {
    return apiClient.request(`/orders/${id}/arrived`, {
      method: 'POST',
    });
  }
}

export const orderService = new OrderService();
