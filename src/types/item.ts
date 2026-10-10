export interface OrderItem {
  id: number;
  orderId?: number;
  userId?: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  notes?: string | null;
  participant?: {
    id?: number;
    userId: number;
    user?: {
      id: number;
      name: string;
      avatar?: string | null;
    };
  };
}

export interface AddItemRequest {
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface UpdateItemRequest {
  quantity?: number;
  unitPrice?: number;
  notes?: string;
}

export interface MyItemsResponse {
  participant: {
    id: number;
    userId: number;
  };
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string | null;
  }>;
  total: number;
}
