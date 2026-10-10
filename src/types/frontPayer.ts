export interface FrontPayer {
  id: number;
  orderId?: number;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  instapayHandle?: string | null;
  phoneNumber?: string | null;
  amountPaid: number;
  notes?: string | null;
  createdAt?: string;
}

export interface AddFrontPayerRequest {
  userId: number;
  amountPaid: number;
  notes?: string;
}
