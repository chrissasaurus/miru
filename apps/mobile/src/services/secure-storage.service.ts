import * as SecureStore from 'expo-secure-store';

export class SecureStorageService {
  private static instance: SecureStorageService;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private constructor() {}

  public static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  public async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  public async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  public async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken),
      ]);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  }

  public async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  }
}
