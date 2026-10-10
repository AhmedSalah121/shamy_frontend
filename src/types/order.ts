import { User } from './auth';
import { OrderItem } from './item';

export type OrderStatus =
  | 'OPEN'
  | 'LOCKED'
  | 'ORDERED'
  | 'DELIVERED'
  | 'SETTLING'
  | 'COMPLETED'
  | 'CANCELLED';

export type UserRole = 'CREATOR' | 'PARTICIPANT' | 'HERO' | 'GUEST';

export interface Participant {
  id: number;
  orderId?: number;
  userId: number;
  joinedAt?: string;
  user: {
    id: number;
    name: string;
    avatar?: string | null;
    instapayHandle?: string | null;
    phoneNumber?: string | null;
  };
}

export interface Order {
  id: number;
  title: string;
  description?: string | null;
  restaurantName: string;
  restaurantPhone?: string | null;
  menuUrl?: string | null;
  menuImageUrl?: string | null;
  status: OrderStatus;
  deadline: string;
  isDeadlinePassed?: boolean;
  visibility?: 'PUBLIC' | 'PRIVATE';
  deliveryFee: number;
  creatorId: number;
  creator: {
    id: number;
    name: string;
    instapayHandle?: string | null;
    phoneNumber?: string | null;
    avatar?: string | null;
  };
  pickupHero?: {
    id: number;
    name: string;
    email?: string;
    instapayHandle?: string | null;
    phoneNumber?: string | null;
    avatar?: string | null;
  } | null;
  userRole?: UserRole;
  myItems?: OrderItem[];
  myItemsTotal?: number;
  participants: Participant[];
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  title: string;
  description?: string;
  restaurantName: string;
  restaurantPhone?: string;
  menuUrl?: string;
  menuImageUrl?: string;
  deadline: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
  deliveryFee?: number;
}

export interface SettleOrderRequest {
  fee: number;
}
