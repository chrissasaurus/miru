// Navigation service for React Navigation
// This service will need to be initialized with the navigation object
// from your React Navigation container

export const ROUTES = {
  LOGIN: 'Login',
  HOME: 'Home',
  // Add other routes as needed
} as const;

type NavigationObject = {
  navigate: (name: string, params?: any) => void;
  goBack: () => void;
  reset: (state: any) => void;
};

export class NavigationService {
  private static instance: NavigationService;
  private navigation: NavigationObject | null = null;

  private constructor() {}

  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  public setNavigation(navigation: NavigationObject): void {
    this.navigation = navigation;
  }

  public navigateToLogin(): void {
    if (this.navigation) {
      this.navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.LOGIN }],
      });
    } else {
      console.warn('Navigation not initialized. Call setNavigation() first.');
    }
  }

  public navigateToHome(): void {
    if (this.navigation) {
      this.navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.HOME }],
      });
    } else {
      console.warn('Navigation not initialized. Call setNavigation() first.');
    }
  }

  public navigateBack(): void {
    if (this.navigation) {
      this.navigation.goBack();
    } else {
      console.warn('Navigation not initialized. Call setNavigation() first.');
    }
  }

  public navigateToScreen(screenName: string, params?: any): void {
    if (this.navigation) {
      this.navigation.navigate(screenName, params);
    } else {
      console.warn('Navigation not initialized. Call setNavigation() first.');
    }
  }
}
