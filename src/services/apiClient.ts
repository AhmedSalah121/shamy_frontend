import { API_BASE_URL, USE_MOCK_API } from '@/config/constants';
import { mockAdapter } from './mock/mockAdapter';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('shamy_access_token');
      this.refreshToken = localStorage.getItem('shamy_refresh_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('shamy_access_token', token);
      } else {
        localStorage.removeItem('shamy_access_token');
      }
    }
  }

  public setRefreshToken(refreshToken: string | null) {
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      if (refreshToken) {
        localStorage.setItem('shamy_refresh_token', refreshToken);
      } else {
        localStorage.removeItem('shamy_refresh_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    if (USE_MOCK_API) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    const { params, headers, ...customConfig } = options;
    let url = `${API_BASE_URL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        searchParams.append(key, String(val));
      });
      url += `?${searchParams.toString()}`;
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        headers: requestHeaders,
        ...customConfig,
      });

      if (!response.ok) {
        // If 401 unauthorized, try refresh token once
        if (response.status === 401 && this.refreshToken) {
          const refreshed = await this.tryRefreshToken();
          if (refreshed) {
            requestHeaders['Authorization'] = `Bearer ${this.token}`;
            const retryRes = await fetch(url, {
              headers: requestHeaders,
              ...customConfig,
            });
            if (retryRes.ok) {
              return (await retryRes.json()) as T;
            }
          }
        }
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      // Graceful fallback to mock adapter if server is unreachable
      console.warn(`Backend fetch to ${endpoint} failed, falling back to mock adapter:`, err.message);
      return this.handleMockRequest<T>(endpoint, options);
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.refreshToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        this.setToken(data.accessToken);
        if (data.refreshToken) this.setRefreshToken(data.refreshToken);
        return true;
      }
    } catch {
      // refresh failed
    }
    return false;
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body as string) : {};

    // Routing mock handlers
    if (endpoint === '/auth/register' && method === 'POST') {
      return (await mockAdapter.register(body)) as unknown as T;
    }
    if (endpoint === '/auth/login' && method === 'POST') {
      return (await mockAdapter.login(body)) as unknown as T;
    }
    if (endpoint === '/auth/refresh' && method === 'POST') {
      return (await mockAdapter.refresh()) as unknown as T;
    }
    if (endpoint === '/users/me' && method === 'PATCH') {
      return (await mockAdapter.updateProfile(body)) as unknown as T;
    }
    if (endpoint.startsWith('/users/') && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.getUser(id)) as unknown as T;
    }
    if (endpoint === '/orders' && method === 'GET') {
      return (await mockAdapter.getOrders()) as unknown as T;
    }
    if (endpoint === '/orders' && method === 'POST') {
      return (await mockAdapter.createOrder(body)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.getOrderById(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/join$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.joinOrder(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/leave$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.leaveOrder(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/settle$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.settleOrder(id, body.fee)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/pick-hero$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.pickHero(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/arrived$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.broadcastOrderArrived(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/items$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.addItem(id, body)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/items\/\d+$/) && method === 'PATCH') {
      const parts = endpoint.split('/');
      const orderId = parseInt(parts[2]);
      const itemId = parseInt(parts[4]);
      return (await mockAdapter.updateItem(orderId, itemId, body)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/items\/\d+$/) && method === 'DELETE') {
      const parts = endpoint.split('/');
      const orderId = parseInt(parts[2]);
      const itemId = parseInt(parts[4]);
      return (await mockAdapter.deleteItem(orderId, itemId)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/my-items$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.getMyItems(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/front-payers$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.addFrontPayer(id, body)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/front-payers$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.getFrontPayers(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/bills$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.getBills(id)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/pay-cash$/) && method === 'POST') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.payCash(id, body)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/reimbursements\/\d+\/return-change$/) && method === 'POST') {
      const parts = endpoint.split('/');
      const orderId = parseInt(parts[2]);
      const participantId = parseInt(parts[4]);
      return (await mockAdapter.markChangeReturned(orderId, participantId)) as unknown as T;
    }
    if (endpoint.match(/^\/orders\/\d+\/reimbursements\/\d+\/confirm$/) && method === 'POST') {
      const parts = endpoint.split('/');
      const orderId = parseInt(parts[2]);
      const participantId = parseInt(parts[4]);
      return (await mockAdapter.confirmReimbursement(orderId, participantId)) as unknown as T;
    }
    if (endpoint === '/notifications' && method === 'GET') {
      return (await mockAdapter.getNotifications()) as unknown as T;
    }
    if (endpoint.match(/^\/notifications\/\d+\/read$/) && method === 'PATCH') {
      const id = parseInt(endpoint.split('/')[2]);
      return (await mockAdapter.markNotificationRead(id)) as unknown as T;
    }

    throw new Error(`Unhandled mock endpoint: ${method} ${endpoint}`);
  }
}

export const apiClient = new ApiClient();
