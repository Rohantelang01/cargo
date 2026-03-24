
// app/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: Array<'passenger' | 'driver' | 'owner'>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'passenger' | 'driver' | 'owner';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  field?: string;
}
