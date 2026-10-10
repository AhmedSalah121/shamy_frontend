import { ServerToClientEvents, ClientToServerEvents } from '@/types/socket';
import { WS_BASE_URL } from '@/config/constants';

type EventName = keyof ServerToClientEvents;
type EventCallback<E extends EventName> = ServerToClientEvents[E];

class SocketService {
  private listeners: Map<string, Set<Function>> = new Map();
  private isConnected: boolean = false;
  private currentUserId: string | number | null = null;
  private currentRoom: string | null = null;
  private socketInstance: any = null;

  constructor() {
    this.initSocketClient();
  }

  private initSocketClient() {
    if (typeof window === 'undefined') return;

    // Check if socket.io-client is globally available or create an event-driven fallback
    try {
      if ((window as any).io) {
        this.socketInstance = (window as any).io(WS_BASE_URL, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
        });

        this.socketInstance.on('connect', () => {
          this.isConnected = true;
          if (this.currentUserId) {
            this.emit('register_user', this.currentUserId);
          }
          if (this.currentRoom) {
            this.emit('join_order', this.currentRoom);
          }
        });

        this.socketInstance.on('disconnect', () => {
          this.isConnected = false;
        });

        // Forward all incoming socket events to registered local listeners
        const knownEvents: EventName[] = [
          'order_created',
          'participant_joined',
          'participant_left',
          'item_added',
          'item_updated',
          'item_removed',
          'status_changed',
          'order_locked',
          'pickup_hero_selected',
          'order_arrived',
          'order_settling',
          'front_payer_added',
          'payment_submitted',
          'change_returned',
          'payment_confirmed',
          'new_notification',
        ];

        knownEvents.forEach((evt) => {
          this.socketInstance.on(evt, (payload: any) => {
            this.notifyListeners(evt, payload);
          });
        });
      }
    } catch {
      // Event-bus fallback will handle events
    }
  }

  public registerUser(userId: string | number) {
    this.currentUserId = userId;
    this.emit('register_user', userId);
  }

  public joinOrder(orderId: string | number) {
    this.currentRoom = String(orderId);
    this.emit('join_order', orderId);
  }

  public emit<E extends keyof ClientToServerEvents>(event: E, ...args: Parameters<ClientToServerEvents[E]>) {
    if (this.socketInstance && typeof this.socketInstance.emit === 'function') {
      try {
        this.socketInstance.emit(event, ...args);
      } catch {
        // ignore
      }
    }
  }

  public on<E extends EventName>(event: E, callback: EventCallback<E>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event)!;
    handlers.add(callback);

    // Return unsubscribe function for clean lifecycle in React useEffect
    return () => {
      this.off(event, callback);
    };
  }

  public off<E extends EventName>(event: E, callback: EventCallback<E>) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(callback);
    }
  }

  private notifyListeners(event: string, payload: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error(`Error in socket listener for ${event}:`, err);
        }
      });
    }
  }

  /**
   * Internal / Mock emit function to simulate real-time socket events locally
   */
  public mockEmit<E extends EventName>(event: E, payload: Parameters<ServerToClientEvents[E]>[0]) {
    this.notifyListeners(event as string, payload);
  }
}

export const socketService = new SocketService();
