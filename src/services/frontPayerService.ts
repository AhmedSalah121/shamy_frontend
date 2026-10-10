import { apiClient } from './apiClient';
import { FrontPayer, AddFrontPayerRequest } from '@/types';

export class FrontPayerService {
  public async addFrontPayer(orderId: number, payload: AddFrontPayerRequest): Promise<FrontPayer> {
    return apiClient.request<FrontPayer>(`/orders/${orderId}/front-payers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getFrontPayers(orderId: number): Promise<FrontPayer[]> {
    return apiClient.request<FrontPayer[]>(`/orders/${orderId}/front-payers`, {
      method: 'GET',
    });
  }
}

export const frontPayerService = new FrontPayerService();
