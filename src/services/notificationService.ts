import { apiClient } from './apiClient';
import { NotificationItem } from '@/types';

export class NotificationService {
  public async getNotifications(): Promise<NotificationItem[]> {
    return apiClient.request<NotificationItem[]>('/notifications', {
      method: 'GET',
    });
  }

  public async markAsRead(id: number): Promise<{ success: boolean }> {
    return apiClient.request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }
}

export const notificationService = new NotificationService();
