import { SecureStorageService } from "./secure-storage.service";
import { NavigationService } from "./navigation.service";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiService {
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];
  private static instance: ApiService;

  private constructor(
    baseURL: string,
    private secureStorage: SecureStorageService,
    private navigation: NavigationService,
  ) {
    this.baseURL = baseURL;
  }

  static getInstance(
    baseURL?: string,
    secureStorage?: SecureStorageService,
    navigation?: NavigationService,
  ): ApiService {
    if (!ApiService.instance) {
      if (!baseURL || !secureStorage || !navigation) {
        throw new Error(
          "BaseURL, SecureStorageService, and NavigationService required for first initialization",
        );
      }
      ApiService.instance = new ApiService(baseURL, secureStorage, navigation);
    }
    return ApiService.instance;
  }

  private async request<T = any>(
    url: string,
    options: RequestInit & { _retry?: boolean } = {},
  ): Promise<ApiResponse<T>> {
    const token = await this.secureStorage.getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && !options._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then(async (token) => {
            const retryOptions = {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
              },
              _retry: true,
            };
            return this.request<T>(url, retryOptions);
          })
          .catch((err) => Promise.reject(err));
      }

      options._retry = true;
      this.isRefreshing = true;

      try {
        const newToken = await this.refreshToken();

        this.failedQueue.forEach(({ resolve }) => resolve(newToken));
        this.failedQueue = [];

        const retryOptions: RequestInit & { _retry?: boolean } = {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
          _retry: true,
        };
        return this.request<T>(url, retryOptions);
      } catch (refreshError) {
        await this.handleAuthFailure();

        this.failedQueue.forEach(({ reject }) => reject(refreshError));
        this.failedQueue = [];

        throw refreshError;
      } finally {
        this.isRefreshing = false;
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw this.handleError({
        response: {
          status: response.status,
          data: data,
        },
      });
    }

    return {
      data,
      status: response.status,
    };
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = await this.secureStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const { access_token, refresh_token: newRefreshToken } = data;

      await this.secureStorage.setTokens(access_token, newRefreshToken);

      return access_token;
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  }

  private async handleAuthFailure(): Promise<void> {
    await this.secureStorage.clearTokens();
    this.navigation.navigateToLogin();
  }

  // HTTP Methods
  async get<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "GET" });
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "DELETE" });
  }

  private handleError(error: any): ApiError {
    if (error instanceof TypeError) {
      // Network error with fetch
      return {
        message: "Network error. Please check your connection.",
        status: 0,
      };
    } else if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || "Request failed",
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else {
      // Something else happened
      return {
        message: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  }
}
