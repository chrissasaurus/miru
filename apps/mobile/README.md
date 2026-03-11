# Miru Mobile App

A React Native Expo application built with TypeScript, part of the Miru monorepo.

## Overview

Miru is a mobile application built with Expo and React Native, designed to provide a seamless cross-platform experience on iOS, Android, and Web platforms.

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript
- **Expo Status Bar** - Native status bar management

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for development on physical devices)
- Expo CLI (`npm install -g expo-cli`)

## Getting Started

### Installation

1. Clone the monorepo repository:
```bash
git clone <repository-url>
cd miru
```

2. Install dependencies from the monorepo root:
```bash
npm install
```

3. Navigate to the mobile app directory:
```bash
cd apps/mobile
```

### Running the App

#### Development Server
```bash
# Start the Expo development server
npm start

# Or use the Expo CLI directly
expo start
```

#### Platform-specific Commands
```bash
# Run on Android device/emulator
npm run android
# or
expo start --android

# Run on iOS device/simulator
npm run ios
# or
expo start --ios

# Run in web browser
npm run web
# or
expo start --web
```

## Development Workflow

### 1. Start Development Server
```bash
npm start
```

This will start the Metro bundler and show a QR code in the terminal.

### 2. Run on Device
- **Physical Device**: Open the Expo Go app and scan the QR code
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web Browser**: Press `w` in the terminal

### 3. Hot Reloading
The app supports hot reloading out of the box. Changes to your code will be reflected immediately in the running app.

## Project Structure

```
apps/mobile/
├── App.tsx              # Main application component
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
├── src/                 # Source code
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation configuration
│   ├── services/        # API and data services
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
└── .expo/               # Expo-generated files
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Configuration

### Expo Configuration (app.json)
The app configuration is managed in `app.json`:
- App name and slug
- Version information
- Platform-specific settings (iOS, Android, Web)
- Icon and splash screen configuration
- Build settings

### TypeScript Configuration (tsconfig.json)
TypeScript is configured for strict type checking and optimal development experience.

## Building for Production

### Development Build
```bash
expo build:android
expo build:ios
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure build
eas build:configure

# Build for production
eas build --platform all
```

## Deployment

### App Store (iOS)
1. Build the app using EAS Build
2. Upload to App Store Connect
3. Complete App Store review process

### Google Play Store (Android)
1. Build the app using EAS Build
2. Upload to Google Play Console
3. Complete Play Store review process

### Web Deployment
The web build can be deployed to any static hosting service:
```bash
expo build:web
```

## Development Tips

### Debugging
- Use Expo Dev Tools for debugging
- Shake device to open developer menu
- Use React Native Debugger for advanced debugging

### Performance
- Use `FlatList` for long lists
- Optimize images and assets
- Use `useMemo` and `useCallback` hooks appropriately
- Profile with React DevTools

### Navigation
Consider adding a navigation library like React Navigation:
```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

## Monorepo Integration

This app is part of the Miru monorepo and can be built using Turbo from the root directory:
```bash
# From monorepo root
npm run build
npm run dev
```

## Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new code
3. Add appropriate tests for new features
4. Update documentation as needed

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
# Clear Metro cache
npx expo start --clear

# Reset node modules
rm -rf node_modules package-lock.json
npm install
```

**Expo Go app not connecting:**
- Ensure your device and development machine are on the same network
- Check that firewall is not blocking the connection
- Try using tunnel mode: `expo start --tunnel`

**TypeScript errors:**
- Check `tsconfig.json` configuration
- Ensure all dependencies are properly installed
- Restart TypeScript server in your IDE

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Expo Forums](https://forums.expo.dev/)

## License

This project is part of the Miru monorepo. See the root LICENSE file for details.
