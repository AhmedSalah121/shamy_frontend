export type PaymentMethod = 'CASH' | 'INSTAPAY';

export type ReimbursementStatus = 'PENDING' | 'PAID_BY_PARTICIPANT' | 'CONFIRMED';

export interface Reimbursement {
  id: number;
  orderId?: number;
  participantId: number;
  status: ReimbursementStatus;
  paymentMethod: PaymentMethod | null;
  amountDue: number;
  amountGiven: number | null;
  changeDue: number;
  isChangeReturned: boolean;
  changeReturnedAt?: string | null;
  paidAt?: string | null;
  confirmedAt?: string | null;
  confirmedById?: number | null;
  transactionReference?: string | null;
  paidToUserId?: number;
  paidToUser?: {
    id: number;
    name: string;
    instapayHandle?: string | null;
  } | null;
}

export interface ParticipantBill {
  participantId: number;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  instapayHandle?: string | null;
  phoneNumber?: string | null;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string | null;
  }>;
  itemsCount: number;
  itemsTotal: number;
  addedFee: number;
  totalAmount: number;
  reimbursement?: Reimbursement;
}

export interface BillBreakdown {
  orderId: number;
  title: string;
  status: string;
  restaurantName: string;
  creatorId: number;
  creatorName: string;
  creatorInstapay?: string | null;
  creatorPhone?: string | null;
  pickupHero?: {
    id: number;
    name: string;
    instapayHandle?: string | null;
    phoneNumber?: string | null;
  } | null;
  addedDeliveryFee: number;
  itemsTotal: number;
  grandTotal: number;
  totalFronted: number;
  frontPayers: Array<{
    id: number;
    userId: number;
    userName: string;
    instapayHandle?: string | null;
    amountPaid: number;
  }>;
  participants: ParticipantBill[];
}

export interface PayCashRequest {
  amountGiven: number;
  paidToUserId: number;
  paymentMethod: 'CASH';
  transactionReference?: string | null;
  notes?: string;
}

export interface PayInstapayRequest {
  amountGiven: number;
  paidToUserId: number;
  paymentMethod: 'INSTAPAY';
  transactionReference: string;
  notes?: string;
}
