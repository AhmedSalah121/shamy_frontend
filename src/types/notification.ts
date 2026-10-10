export interface NotificationItem {
  id: number;
  userId: number;
  orderId?: number | null;
  title: string;
  message: string;
  type?: 'ORDER_CREATED' | 'HERO_SELECTED' | 'ORDER_ARRIVED' | 'ORDER_SETTLING' | 'PAYMENT_RECEIVED' | 'CHANGE_RETURNED';
  readAt?: string | null;
  createdAt: string;
}
