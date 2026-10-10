import { OrderItem } from './item';
import { FrontPayer } from './frontPayer';
import { BillBreakdown, Reimbursement } from './bill';
import { NotificationItem } from './notification';

export interface ServerToClientEvents {
  order_created: (payload: { orderId: number; title: string; restaurantName: string; creatorId: number }) => void;
  participant_joined: (payload: { orderId: number; userId: number; user?: { id: number; name: string } }) => void;
  participant_left: (payload: { orderId: number; userId: number }) => void;
  item_added: (payload: { orderId: number; item: OrderItem }) => void;
  item_updated: (payload: { orderId: number; item: OrderItem }) => void;
  item_removed: (payload: { orderId: number; itemId: number }) => void;
  status_changed: (payload: { orderId: number; status: string }) => void;
  order_locked: (payload: { orderId: number; reason: string; lockedAt: string }) => void;
  pickup_hero_selected: (payload: {
    orderId: number;
    hero: { id: number; name: string; instapayHandle?: string | null };
    message: string;
  }) => void;
  order_arrived: (payload: {
    orderId: number;
    title: string;
    message: string;
    arrivedAt: string;
  }) => void;
  order_settling: (payload: { orderId: number; status: string; bills?: BillBreakdown }) => void;
  front_payer_added: (payload: { orderId: number; payer: FrontPayer }) => void;
  payment_submitted: (payload: {
    orderId: number;
    participantId: number;
    amountDue: number;
    amountGiven: number;
    changeDue: number;
    paymentMethod: string;
  }) => void;
  change_returned: (payload: {
    orderId: number;
    participantId: number;
    changeDue: number;
    reimbursement: Reimbursement;
  }) => void;
  payment_confirmed: (payload: {
    orderId: number;
    participantId: number;
    reimbursement: Reimbursement;
  }) => void;
  new_notification: (payload: NotificationItem) => void;
}

export interface ClientToServerEvents {
  register_user: (userId: string | number) => void;
  join_order: (orderId: string | number) => void;
}
