import { SecureStorageService } from "./secure-storage.service";
import { NavigationService } from "./navigation.service";
import { ApiService } from "./api.service";

const BASE_URL = "http://192.168.1.215:3000";

export const secureStorage = SecureStorageService.getInstance();
export const navigationService = NavigationService.getInstance();
export const apiService = ApiService.getInstance(
  BASE_URL,
  secureStorage,
  navigationService,
);
