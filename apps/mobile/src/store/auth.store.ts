import { create } from 'zustand';
import { ApiService } from '../services/api.service';
import { SecureStorageService } from '../services/secure-storage.service';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const apiService = ApiService.getInstance();
      const response = await apiService.post('/auth/login', {
        email,
        password,
      });

      const { user, access_token, refresh_token } = response.data;
      const secureStorage = SecureStorageService.getInstance();
      
      await secureStorage.setTokens(access_token, refresh_token);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true });
    try {
      const apiService = ApiService.getInstance();
      await apiService.post('/auth/register', {
        email,
        password,
        name,
      });

      // After successful registration, login to get tokens
      await get().login(email, password);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const apiService = ApiService.getInstance();
      await apiService.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      const secureStorage = SecureStorageService.getInstance();
      await secureStorage.clearTokens();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const secureStorage = SecureStorageService.getInstance();
      const [accessToken, refreshToken] = await Promise.all([
        secureStorage.getAccessToken(),
        secureStorage.getRefreshToken(),
      ]);

      if (!accessToken || !refreshToken) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const apiService = ApiService.getInstance();
      const response = await apiService.get('/auth/profile');
      
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Token might be invalid, clear everything
      const secureStorage = SecureStorageService.getInstance();
      await secureStorage.clearTokens();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
