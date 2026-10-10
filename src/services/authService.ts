import { apiClient } from './apiClient';
import { User, AuthResponse, LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/types';

export class AuthService {
  public async register(payload: RegisterRequest): Promise<AuthResponse> {
    const res = await apiClient.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    apiClient.setToken(res.accessToken);
    if (res.refreshToken) apiClient.setRefreshToken(res.refreshToken);
    return res;
  }

  public async login(payload: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    apiClient.setToken(res.accessToken);
    if (res.refreshToken) apiClient.setRefreshToken(res.refreshToken);
    return res;
  }

  public async getUser(id: number): Promise<User> {
    return apiClient.request<User>(`/users/${id}`, { method: 'GET' });
  }

  public async updateProfile(payload: UpdateProfileRequest): Promise<User> {
    return apiClient.request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  public logout() {
    apiClient.setToken(null);
    apiClient.setRefreshToken(null);
  }
}

export const authService = new AuthService();
