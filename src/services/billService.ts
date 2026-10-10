import { apiClient } from './apiClient';
import { BillBreakdown, PayCashRequest, PayInstapayRequest, Reimbursement } from '@/types';

export class BillService {
  public async getBills(orderId: number): Promise<BillBreakdown> {
    return apiClient.request<BillBreakdown>(`/orders/${orderId}/bills`, {
      method: 'GET',
    });
  }

  public async payCash(orderId: number, payload: PayCashRequest): Promise<Reimbursement> {
    return apiClient.request<Reimbursement>(`/orders/${orderId}/pay-cash`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async payInstapay(orderId: number, payload: PayInstapayRequest): Promise<Reimbursement> {
    return apiClient.request<Reimbursement>(`/orders/${orderId}/pay-cash`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async returnChange(orderId: number, participantId: number): Promise<{
    id: number;
    participantId: number;
    changeDue: number;
    isChangeReturned: boolean;
    changeReturnedAt: string;
  }> {
    return apiClient.request(`/orders/${orderId}/reimbursements/${participantId}/return-change`, {
      method: 'POST',
    });
  }

  public async confirmReimbursement(orderId: number, participantId: number): Promise<{
    id: number;
    status: string;
    confirmedById: number;
    confirmedAt: string;
  }> {
    return apiClient.request(`/orders/${orderId}/reimbursements/${participantId}/confirm`, {
      method: 'POST',
    });
  }
}

export const billService = new BillService();
