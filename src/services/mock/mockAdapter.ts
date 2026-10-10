import { INITIAL_MOCK_DATA, MockDatabase } from './mockDb';
import {
  User,
  Order,
  OrderItem,
  FrontPayer,
  BillBreakdown,
  ParticipantBill,
  Reimbursement,
  NotificationItem,
  CreateOrderRequest,
  AddItemRequest,
  UpdateItemRequest,
  AddFrontPayerRequest,
  PayCashRequest,
  PayInstapayRequest,
} from '@/types';
import { socketService } from '../socketService';

class MockAdapter {
  private db: MockDatabase;
  private currentUserId: number = 1;
  private reimbursements: Map<string, Reimbursement> = new Map();

  constructor() {
    this.db = this.loadDatabase();
    this.initializeReimbursements();
  }

  private loadDatabase(): MockDatabase {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('shamy_mock_db');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // fallback to memory
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
  }

  private saveDatabase() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shamy_mock_db', JSON.stringify(this.db));
      } catch {
        // ignore
      }
    }
  }

  private initializeReimbursements() {
    // Seed an initial pending reimbursement for testing
    const initialReimbursement: Reimbursement = {
      id: 1,
      orderId: 1,
      participantId: 2,
      status: 'PENDING',
      paymentMethod: 'CASH',
      amountDue: 43,
      amountGiven: null,
      changeDue: 0,
      isChangeReturned: false,
      paidToUserId: 1,
      paidToUser: {
        id: 1,
        name: 'Karim Mostafa',
        instapayHandle: 'karim@instapay',
      },
    };
    this.reimbursements.set('1_2', initialReimbursement);
  }

  public setCurrentUserId(id: number) {
    this.currentUserId = id;
  }

  public getCurrentUser(): User {
    const user = this.db.users.find((u) => u.id === this.currentUserId);
    return user || this.db.users[0];
  }

  // --- Auth Endpoints ---

  public async register(payload: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    instapayHandle: string;
    phoneNumber: string;
  }): Promise<{ user: User; accessToken: string }> {
    const newUser: User = {
      id: this.db.users.length + 1,
      name: payload.name,
      email: payload.email,
      avatar: payload.avatar || null,
      instapayHandle: payload.instapayHandle,
      phoneNumber: payload.phoneNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.users.push(newUser);
    this.currentUserId = newUser.id;
    this.saveDatabase();
    return {
      user: newUser,
      accessToken: `mock_jwt_token_${newUser.id}`,
    };
  }

  public async login(payload: { email: string; password?: string }): Promise<{ user: User; accessToken: string }> {
    const user = this.db.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase()) || this.db.users[0];
    this.currentUserId = user.id;
    return {
      user,
      accessToken: `mock_jwt_token_${user.id}`,
    };
  }

  public async refresh(): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: `mock_refreshed_jwt_${this.currentUserId}`,
      refreshToken: `mock_refresh_token_${this.currentUserId}`,
    };
  }

  public async getUser(id: number): Promise<User> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  public async updateProfile(payload: Partial<User>): Promise<User> {
    const user = this.getCurrentUser();
    Object.assign(user, payload, { updatedAt: new Date().toISOString() });
    this.saveDatabase();
    return user;
  }

  // --- Orders Endpoints ---

  public async getOrders(): Promise<Order[]> {
    return this.db.orders.map((o) => this.enrichOrder(o));
  }

  public async getOrderById(id: number): Promise<Order> {
    const order = this.db.orders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return this.enrichOrder(order);
  }

  private enrichOrder(order: Order): Order {
    const items = this.db.items.filter((i) => i.orderId === order.id);
    const currentUser = this.getCurrentUser();
    const isCreator = order.creatorId === currentUser.id;
    const isHero = order.pickupHero?.id === currentUser.id;
    const isParticipant = order.participants.some((p) => p.userId === currentUser.id);

    const userRole = isCreator ? 'CREATOR' : isHero ? 'HERO' : isParticipant ? 'PARTICIPANT' : 'GUEST';
    const myItems = items.filter((i) => i.userId === currentUser.id);
    const myItemsTotal = myItems.reduce((acc, i) => acc + (i.totalPrice || i.unitPrice * i.quantity), 0);

    const isDeadlinePassed = new Date(order.deadline).getTime() < Date.now();

    return {
      ...order,
      items,
      myItems,
      myItemsTotal,
      userRole,
      isDeadlinePassed,
    };
  }

  public async createOrder(payload: CreateOrderRequest): Promise<Order> {
    const currentUser = this.getCurrentUser();
    const newOrder: Order = {
      id: this.db.orders.length + 1,
      title: payload.title,
      description: payload.description || null,
      restaurantName: payload.restaurantName,
      restaurantPhone: payload.restaurantPhone || null,
      menuUrl: payload.menuUrl || null,
      menuImageUrl: payload.menuImageUrl || null,
      deadline: payload.deadline,
      status: 'OPEN',
      deliveryFee: payload.deliveryFee || 0,
      creatorId: currentUser.id,
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        instapayHandle: currentUser.instapayHandle,
        phoneNumber: currentUser.phoneNumber,
        avatar: currentUser.avatar,
      },
      pickupHero: null,
      participants: [
        {
          id: Date.now(),
          orderId: this.db.orders.length + 1,
          userId: currentUser.id,
          joinedAt: new Date().toISOString(),
          user: {
            id: currentUser.id,
            name: currentUser.name,
            instapayHandle: currentUser.instapayHandle,
            phoneNumber: currentUser.phoneNumber,
          },
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.db.orders.unshift(newOrder);
    this.saveDatabase();

    // Broadcast WebSocket event
    socketService.mockEmit('order_created', {
      orderId: newOrder.id,
      title: newOrder.title,
      restaurantName: newOrder.restaurantName,
      creatorId: newOrder.creatorId,
    });

    return this.enrichOrder(newOrder);
  }

  public async joinOrder(orderId: number): Promise<{ success: boolean; order: Order }> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const currentUser = this.getCurrentUser();
    const alreadyJoined = order.participants.some((p) => p.userId === currentUser.id);
    if (!alreadyJoined) {
      order.participants.push({
        id: Date.now(),
        orderId,
        userId: currentUser.id,
        joinedAt: new Date().toISOString(),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          instapayHandle: currentUser.instapayHandle,
          phoneNumber: currentUser.phoneNumber,
        },
      });
      this.saveDatabase();

      socketService.mockEmit('participant_joined', {
        orderId,
        userId: currentUser.id,
        user: { id: currentUser.id, name: currentUser.name },
      });
    }

    return { success: true, order: this.enrichOrder(order) };
  }

  public async leaveOrder(orderId: number): Promise<{ success: boolean }> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const currentUser = this.getCurrentUser();
    order.participants = order.participants.filter((p) => p.userId !== currentUser.id);
    this.db.items = this.db.items.filter((i) => !(i.orderId === orderId && i.userId === currentUser.id));
    this.saveDatabase();

    socketService.mockEmit('participant_left', {
      orderId,
      userId: currentUser.id,
    });

    return { success: true };
  }

  public async settleOrder(orderId: number, fee: number): Promise<{ success: boolean; bills: BillBreakdown }> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'SETTLING';
    order.deliveryFee = fee;
    this.saveDatabase();

    const bills = await this.getBills(orderId);

    socketService.mockEmit('order_settling', {
      orderId,
      status: 'SETTLING',
      bills,
    });

    socketService.mockEmit('status_changed', {
      orderId,
      status: 'SETTLING',
    });

    return { success: true, bills };
  }

  // --- Pickup Hero (7.1: Randomly picks strictly EXCEPTING order creator) ---

  public async pickHero(orderId: number): Promise<{
    hero: { id: number; name: string; email: string; instapayHandle?: string | null; phoneNumber?: string | null };
    message: string;
  }> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    // Rule: Randomly picks from participants, strictly EXCEPTING the order creator
    const eligibleParticipants = order.participants.filter((p) => p.userId !== order.creatorId);

    if (eligibleParticipants.length === 0) {
      throw new Error('No eligible participants to select as Pickup Hero. At least one non-creator colleague must join.');
    }

    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const chosenParticipant = eligibleParticipants[randomIndex];
    const fullUser = this.db.users.find((u) => u.id === chosenParticipant.userId) || chosenParticipant.user;

    const hero = {
      id: fullUser.id,
      name: fullUser.name,
      email: (fullUser as User).email || `${fullUser.name.toLowerCase().replace(/\s+/g, '')}@office.com`,
      instapayHandle: fullUser.instapayHandle,
      phoneNumber: fullUser.phoneNumber,
    };

    order.pickupHero = hero;
    this.saveDatabase();

    const message = `🎉 ${hero.name} has been randomly chosen as the Pickup Hero to fetch today's breakfast!`;

    socketService.mockEmit('pickup_hero_selected', {
      orderId,
      hero,
      message,
    });

    this.db.notifications.unshift({
      id: Date.now(),
      userId: hero.id,
      orderId,
      title: 'You are the Pickup Hero! 🦸‍♂️',
      message: `You were chosen to fetch the breakfast order from ${order.restaurantName}!`,
      type: 'HERO_SELECTED',
      createdAt: new Date().toISOString(),
    });

    return { hero, message };
  }

  // --- Broadcast Order Arrived (7.2: Pickup Hero, Creator, or Admin) ---

  public async broadcastOrderArrived(orderId: number): Promise<{
    success: boolean;
    message: string;
    order: { id: number; status: string };
  }> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'DELIVERED';
    this.saveDatabase();

    const title = 'Breakfast has arrived! 🥐';
    const message = `Order from ${order.restaurantName} is at the front desk! Come grab your fresh breakfast!`;
    const arrivedAt = new Date().toISOString();

    socketService.mockEmit('order_arrived', {
      orderId,
      title,
      message,
      arrivedAt,
    });

    socketService.mockEmit('status_changed', {
      orderId,
      status: 'DELIVERED',
    });

    // Create notifications for all participants
    for (const participant of order.participants) {
      this.db.notifications.unshift({
        id: Date.now() + Math.random(),
        userId: participant.userId,
        orderId,
        title,
        message,
        type: 'ORDER_ARRIVED',
        createdAt: arrivedAt,
      });
    }

    return {
      success: true,
      message: 'Order Arrived live notification sent to all participants',
      order: { id: order.id, status: 'DELIVERED' },
    };
  }

  // --- Items Management ---

  public async addItem(orderId: number, payload: AddItemRequest): Promise<OrderItem> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    if (order.status !== 'OPEN' || new Date(order.deadline).getTime() < Date.now()) {
      throw new Error('Items can be inserted only before deadline while order status is OPEN');
    }

    const currentUser = this.getCurrentUser();
    // Auto-join if not already participant
    if (!order.participants.some((p) => p.userId === currentUser.id)) {
      await this.joinOrder(orderId);
    }

    const newItem: OrderItem = {
      id: Date.now(),
      orderId,
      userId: currentUser.id,
      name: payload.name,
      quantity: payload.quantity,
      unitPrice: payload.unitPrice,
      totalPrice: payload.quantity * payload.unitPrice,
      notes: payload.notes || null,
      participant: {
        id: currentUser.id,
        userId: currentUser.id,
        user: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
      },
    };

    this.db.items.push(newItem);
    this.saveDatabase();

    socketService.mockEmit('item_added', {
      orderId,
      item: newItem,
    });

    return newItem;
  }

  public async updateItem(orderId: number, itemId: number, payload: UpdateItemRequest): Promise<OrderItem> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    if (order.status !== 'OPEN' || new Date(order.deadline).getTime() < Date.now()) {
      throw new Error('Items can only be edited before deadline while order status is OPEN');
    }

    const item = this.db.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    const currentUser = this.getCurrentUser();
    if (item.userId !== currentUser.id) {
      throw new Error('Only the item owner can update this item');
    }

    if (payload.quantity !== undefined) item.quantity = payload.quantity;
    if (payload.unitPrice !== undefined) item.unitPrice = payload.unitPrice;
    if (payload.notes !== undefined) item.notes = payload.notes;
    item.totalPrice = item.quantity * item.unitPrice;

    this.saveDatabase();

    socketService.mockEmit('item_updated', {
      orderId,
      item,
    });

    return item;
  }

  public async deleteItem(orderId: number, itemId: number): Promise<{ success: boolean }> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    if (order.status !== 'OPEN' || new Date(order.deadline).getTime() < Date.now()) {
      throw new Error('Items can only be deleted before deadline while order status is OPEN');
    }

    const item = this.db.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    const currentUser = this.getCurrentUser();
    if (item.userId !== currentUser.id) {
      throw new Error('Only the item owner can delete this item');
    }

    this.db.items = this.db.items.filter((i) => i.id !== itemId);
    this.saveDatabase();

    socketService.mockEmit('item_removed', {
      orderId,
      itemId,
    });

    return { success: true };
  }

  public async getMyItems(orderId: number) {
    const currentUser = this.getCurrentUser();
    const items = this.db.items
      .filter((i) => i.orderId === orderId && i.userId === currentUser.id)
      .map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.quantity * i.unitPrice,
        notes: i.notes,
      }));

    const total = items.reduce((acc, i) => acc + i.totalPrice, 0);

    return {
      participant: { id: currentUser.id, userId: currentUser.id },
      items,
      total,
    };
  }

  // --- Multi-Payer Upfront Settlement ---

  public async addFrontPayer(orderId: number, payload: AddFrontPayerRequest): Promise<FrontPayer> {
    const user = this.db.users.find((u) => u.id === payload.userId) || this.getCurrentUser();
    const payer: FrontPayer = {
      id: Date.now(),
      orderId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      instapayHandle: user.instapayHandle,
      phoneNumber: user.phoneNumber,
      amountPaid: payload.amountPaid,
      notes: payload.notes || null,
      createdAt: new Date().toISOString(),
    };

    this.db.frontPayers.push(payer);
    this.saveDatabase();

    socketService.mockEmit('front_payer_added', {
      orderId,
      payer,
    });

    return payer;
  }

  public async getFrontPayers(orderId: number): Promise<FrontPayer[]> {
    return this.db.frontPayers.filter((fp) => fp.orderId === orderId);
  }

  // --- Bill Breakdown & Fakka / Change Tracker ---

  public async getBills(orderId: number): Promise<BillBreakdown> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    if (order.status !== 'SETTLING' && order.status !== 'COMPLETED') {
      throw new Error('Bills are accessible only when order status is SETTLING or COMPLETED');
    }

    const items = this.db.items.filter((i) => i.orderId === orderId);
    const frontPayers = this.db.frontPayers.filter((fp) => fp.orderId === orderId);
    const totalFronted = frontPayers.reduce((acc, p) => acc + p.amountPaid, 0);

    const participantCount = Math.max(order.participants.length, 1);
    const deliveryFeePerPerson = Math.round((order.deliveryFee / participantCount) * 100) / 100;

    const participants: ParticipantBill[] = order.participants.map((p) => {
      const userItems = items.filter((i) => i.userId === p.userId);
      const itemsTotal = userItems.reduce((acc, i) => acc + (i.totalPrice || i.quantity * i.unitPrice), 0);
      const totalAmount = itemsTotal + deliveryFeePerPerson;

      const reimbursementKey = `${orderId}_${p.id}`;
      let reimbursement = this.reimbursements.get(reimbursementKey);
      if (!reimbursement) {
        reimbursement = {
          id: Date.now() + p.id,
          orderId,
          participantId: p.id,
          status: 'PENDING',
          paymentMethod: 'CASH',
          amountDue: totalAmount,
          amountGiven: null,
          changeDue: 0,
          isChangeReturned: false,
          paidToUserId: frontPayers[0]?.userId || order.creatorId,
          paidToUser: {
            id: frontPayers[0]?.userId || order.creatorId,
            name: frontPayers[0]?.userName || order.creator.name,
            instapayHandle: frontPayers[0]?.instapayHandle || order.creator.instapayHandle,
          },
        };
        this.reimbursements.set(reimbursementKey, reimbursement);
      }

      return {
        participantId: p.id,
        userId: p.userId,
        userName: p.user.name,
        userAvatar: p.user.avatar,
        instapayHandle: p.user.instapayHandle,
        phoneNumber: p.user.phoneNumber,
        items: userItems.map((ui) => ({
          id: ui.id,
          name: ui.name,
          quantity: ui.quantity,
          unitPrice: ui.unitPrice,
          totalPrice: ui.totalPrice || ui.quantity * ui.unitPrice,
          notes: ui.notes,
        })),
        itemsCount: userItems.length,
        itemsTotal,
        addedFee: deliveryFeePerPerson,
        totalAmount,
        reimbursement,
      };
    });

    const itemsTotal = items.reduce((acc, i) => acc + (i.totalPrice || i.quantity * i.unitPrice), 0);
    const grandTotal = itemsTotal + order.deliveryFee;

    return {
      orderId: order.id,
      title: order.title,
      status: order.status,
      restaurantName: order.restaurantName,
      creatorId: order.creatorId,
      creatorName: order.creator.name,
      creatorInstapay: order.creator.instapayHandle,
      creatorPhone: order.creator.phoneNumber,
      pickupHero: order.pickupHero,
      addedDeliveryFee: order.deliveryFee,
      itemsTotal,
      grandTotal,
      totalFronted,
      frontPayers: frontPayers.map((fp) => ({
        id: fp.id,
        userId: fp.userId,
        userName: fp.userName,
        instapayHandle: fp.instapayHandle,
        amountPaid: fp.amountPaid,
      })),
      participants,
    };
  }

  // Submit Payment & Calculate Fakka (Change)
  public async payCash(orderId: number, payload: PayCashRequest | PayInstapayRequest): Promise<Reimbursement> {
    const bills = await this.getBills(orderId);
    const currentUser = this.getCurrentUser();
    const myBill = bills.participants.find((p) => p.userId === currentUser.id) || bills.participants[0];

    const amountDue = myBill ? myBill.totalAmount : 43;
    const amountGiven = payload.amountGiven;
    const changeDue = Math.max(0, amountGiven - amountDue);

    const targetUser = this.db.users.find((u) => u.id === payload.paidToUserId) || this.db.users[0];

    const reimbursement: Reimbursement = {
      id: Date.now(),
      orderId,
      participantId: myBill ? myBill.participantId : 2,
      amountDue,
      amountGiven,
      changeDue,
      isChangeReturned: false,
      paymentMethod: payload.paymentMethod,
      paidToUserId: payload.paidToUserId,
      transactionReference: payload.transactionReference || null,
      paidToUser: {
        id: targetUser.id,
        name: targetUser.name,
        instapayHandle: targetUser.instapayHandle,
      },
      status: 'PAID_BY_PARTICIPANT',
      paidAt: new Date().toISOString(),
    };

    const key = `${orderId}_${reimbursement.participantId}`;
    this.reimbursements.set(key, reimbursement);

    socketService.mockEmit('payment_submitted', {
      orderId,
      participantId: reimbursement.participantId,
      amountDue,
      amountGiven,
      changeDue,
      paymentMethod: payload.paymentMethod,
    });

    return reimbursement;
  }

  public async markChangeReturned(orderId: number, participantId: number): Promise<{
    id: number;
    participantId: number;
    changeDue: number;
    isChangeReturned: boolean;
    changeReturnedAt: string;
  }> {
    const key = `${orderId}_${participantId}`;
    const reimbursement = this.reimbursements.get(key);
    if (!reimbursement) throw new Error('Reimbursement not found');

    reimbursement.isChangeReturned = true;
    reimbursement.changeReturnedAt = new Date().toISOString();

    socketService.mockEmit('change_returned', {
      orderId,
      participantId,
      changeDue: reimbursement.changeDue,
      reimbursement,
    });

    return {
      id: reimbursement.id,
      participantId,
      changeDue: reimbursement.changeDue,
      isChangeReturned: true,
      changeReturnedAt: reimbursement.changeReturnedAt,
    };
  }

  public async confirmReimbursement(orderId: number, participantId: number): Promise<{
    id: number;
    status: string;
    confirmedById: number;
    confirmedAt: string;
  }> {
    const key = `${orderId}_${participantId}`;
    const reimbursement = this.reimbursements.get(key);
    if (!reimbursement) throw new Error('Reimbursement not found');

    const currentUser = this.getCurrentUser();
    reimbursement.status = 'CONFIRMED';
    reimbursement.confirmedById = currentUser.id;
    reimbursement.confirmedAt = new Date().toISOString();

    socketService.mockEmit('payment_confirmed', {
      orderId,
      participantId,
      reimbursement,
    });

    return {
      id: reimbursement.id,
      status: 'CONFIRMED',
      confirmedById: currentUser.id,
      confirmedAt: reimbursement.confirmedAt,
    };
  }

  // --- Uploads ---

  public async uploadMenu(file: { name: string; size: number; type: string }): Promise<{
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
  }> {
    return {
      filename: `mock-${Date.now()}-${file.name}`,
      originalName: file.name,
      size: file.size,
      mimetype: file.type,
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    };
  }

  // --- Notifications ---

  public async getNotifications(): Promise<NotificationItem[]> {
    const currentUser = this.getCurrentUser();
    return this.db.notifications.filter((n) => n.userId === currentUser.id || !n.userId);
  }

  public async markNotificationRead(id: number): Promise<{ success: boolean }> {
    const notif = this.db.notifications.find((n) => n.id === id);
    if (notif) {
      notif.readAt = new Date().toISOString();
      this.saveDatabase();
    }
    return { success: true };
  }
}

export const mockAdapter = new MockAdapter();
