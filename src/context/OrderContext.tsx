'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Order,
  CreateOrderRequest,
  AddItemRequest,
  UpdateItemRequest,
  AddFrontPayerRequest,
  BillBreakdown,
  PayCashRequest,
  PayInstapayRequest,
} from '@/types';
import { orderService } from '@/services/orderService';
import { itemService } from '@/services/itemService';
import { frontPayerService } from '@/services/frontPayerService';
import { billService } from '@/services/billService';
import { socketService } from '@/services/socketService';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  bills: BillBreakdown | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  loadOrder: (orderId: number) => Promise<void>;
  createOrder: (req: CreateOrderRequest) => Promise<Order>;
  joinOrder: (orderId: number) => Promise<void>;
  leaveOrder: (orderId: number) => Promise<void>;
  settleOrder: (orderId: number, fee: number) => Promise<void>;
  pickHero: (orderId: number) => Promise<void>;
  markArrived: (orderId: number) => Promise<void>;
  addItem: (orderId: number, req: AddItemRequest) => Promise<void>;
  updateItem: (orderId: number, itemId: number, req: UpdateItemRequest) => Promise<void>;
  deleteItem: (orderId: number, itemId: number) => Promise<void>;
  addFrontPayer: (orderId: number, req: AddFrontPayerRequest) => Promise<void>;
  payCash: (orderId: number, req: PayCashRequest) => Promise<void>;
  payInstapay: (orderId: number, req: PayInstapayRequest) => Promise<void>;
  returnChange: (orderId: number, participantId: number) => Promise<void>;
  confirmReimbursement: (orderId: number, participantId: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  currentOrder: null,
  bills: null,
  isLoading: false,
  error: null,
  fetchOrders: async () => {},
  loadOrder: async () => {},
  createOrder: async () => ({} as Order),
  joinOrder: async () => {},
  leaveOrder: async () => {},
  settleOrder: async () => {},
  pickHero: async () => {},
  markArrived: async () => {},
  addItem: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},
  addFrontPayer: async () => {},
  payCash: async () => {},
  payInstapay: async () => {},
  returnChange: async () => {},
  confirmReimbursement: async () => {},
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [bills, setBills] = useState<BillBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const loadOrder = useCallback(async (orderId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      socketService.joinOrder(orderId);
      const data = await orderService.getOrder(orderId);
      setCurrentOrder(data);

      if (data.status === 'SETTLING' || data.status === 'COMPLETED') {
        try {
          const billData = await billService.getBills(orderId);
          setBills(billData);
        } catch {
          // ignore
        }
      } else {
        setBills(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Listen to real-time events to mutate state cleanly
    const unsubOrderCreated = socketService.on('order_created', () => {
      fetchOrders();
    });

    const unsubJoined = socketService.on('participant_joined', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
      fetchOrders();
    });

    const unsubItemAdded = socketService.on('item_added', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    const unsubItemUpdated = socketService.on('item_updated', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    const unsubItemRemoved = socketService.on('item_removed', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    const unsubStatus = socketService.on('status_changed', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
      fetchOrders();
    });

    const unsubHero = socketService.on('pickup_hero_selected', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    const unsubArrived = socketService.on('order_arrived', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
      fetchOrders();
    });

    const unsubSettling = socketService.on('order_settling', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    const unsubPayment = socketService.on('payment_submitted', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    const unsubChange = socketService.on('change_returned', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    const unsubConfirmed = socketService.on('payment_confirmed', (payload) => {
      if (currentOrder && currentOrder.id === payload.orderId) {
        loadOrder(payload.orderId);
      }
    });

    return () => {
      unsubOrderCreated();
      unsubJoined();
      unsubItemAdded();
      unsubItemUpdated();
      unsubItemRemoved();
      unsubStatus();
      unsubHero();
      unsubArrived();
      unsubSettling();
      unsubPayment();
      unsubChange();
      unsubConfirmed();
    };
  }, [currentOrder, fetchOrders, loadOrder]);

  const createOrder = async (req: CreateOrderRequest): Promise<Order> => {
    const newOrder = await orderService.createOrder(req);
    await fetchOrders();
    return newOrder;
  };

  const joinOrder = async (orderId: number) => {
    await orderService.joinOrder(orderId);
    await loadOrder(orderId);
  };

  const leaveOrder = async (orderId: number) => {
    await orderService.leaveOrder(orderId);
    await loadOrder(orderId);
  };

  const settleOrder = async (orderId: number, fee: number) => {
    const res = await orderService.settleOrder(orderId, { fee });
    setBills(res.bills);
    await loadOrder(orderId);
  };

  const pickHero = async (orderId: number) => {
    await orderService.pickHero(orderId);
    await loadOrder(orderId);
  };

  const markArrived = async (orderId: number) => {
    await orderService.broadcastArrived(orderId);
    await loadOrder(orderId);
  };

  const addItem = async (orderId: number, req: AddItemRequest) => {
    await itemService.addItem(orderId, req);
    await loadOrder(orderId);
  };

  const updateItem = async (orderId: number, itemId: number, req: UpdateItemRequest) => {
    await itemService.updateItem(orderId, itemId, req);
    await loadOrder(orderId);
  };

  const deleteItem = async (orderId: number, itemId: number) => {
    await itemService.deleteItem(orderId, itemId);
    await loadOrder(orderId);
  };

  const addFrontPayer = async (orderId: number, req: AddFrontPayerRequest) => {
    await frontPayerService.addFrontPayer(orderId, req);
    await loadOrder(orderId);
  };

  const payCash = async (orderId: number, req: PayCashRequest) => {
    await billService.payCash(orderId, req);
    await loadOrder(orderId);
  };

  const payInstapay = async (orderId: number, req: PayInstapayRequest) => {
    await billService.payInstapay(orderId, req);
    await loadOrder(orderId);
  };

  const returnChange = async (orderId: number, participantId: number) => {
    await billService.returnChange(orderId, participantId);
    await loadOrder(orderId);
  };

  const confirmReimbursement = async (orderId: number, participantId: number) => {
    await billService.confirmReimbursement(orderId, participantId);
    await loadOrder(orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        bills,
        isLoading,
        error,
        fetchOrders,
        loadOrder,
        createOrder,
        joinOrder,
        leaveOrder,
        settleOrder,
        pickHero,
        markArrived,
        addItem,
        updateItem,
        deleteItem,
        addFrontPayer,
        payCash,
        payInstapay,
        returnChange,
        confirmReimbursement,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
