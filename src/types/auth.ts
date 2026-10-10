export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  instapayHandle?: string | null;
  phoneNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  instapayHandle: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  instapayHandle?: string;
  phoneNumber?: string;
}
