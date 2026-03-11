<p align="center">
  <a href="#" target="blank"><img src="#" width="120" alt="Miru Logo" /></a>
</p>

<p align="center">A modern full-stack monorepo for building scalable applications with NestJS and React Native.</p>

## Description

**Miru** is a comprehensive monorepo that combines the power of NestJS for backend development with React Native/Expo for mobile applications. Built with TypeScript throughout, it provides a unified development experience for creating modern, scalable applications.

### Architecture

- **Backend**: NestJS framework with TypeScript
- **Mobile**: React Native with Expo
- **Build System**: Turbo for monorepo orchestration
- **Package Management**: npm workspaces
- **Language**: TypeScript across all packages

## Project Structure

```
miru/
├── apps/
│   ├── api/                 # NestJS backend application
│   │   ├── src/
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── package.json
│   └── mobile/              # React Native Expo mobile app
│       ├── App.tsx
│       ├── assets/
│       ├── components/
│       ├── src/
│       └── package.json
├── packages/               # Shared packages (utilities, types, etc.)
├── package.json            # Root package.json with workspaces
├── turbo.json              # Turbo configuration
└── .gitignore              # Monorepo gitignore
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Quick Start

```bash
# Clone the repository
$ git clone <repository-url>
$ cd miru

# Install dependencies
$ npm install

# Build all packages
$ npm run build
```

## Development

### Running the Applications

```bash
# Start all applications in development mode
$ npm run dev

# Start specific applications
$ npm run dev:api        # Backend only
$ npm run dev:mobile     # Mobile only

# Build all packages
$ npm run build

# Run tests
$ npm run test

# Lint all packages
$ npm run lint

# Clean all build artifacts
$ npm run clean
```

### Backend Development (NestJS)

```bash
# Navigate to API directory
$ cd apps/api

# Development server
$ npm run start:dev

# Production mode
$ npm run start:prod

# Running tests
$ npm run test
$ npm run test:e2e
$ npm run test:cov
```

### Mobile Development (React Native)

```bash
# Navigate to mobile directory
$ cd apps/mobile

# Start Expo development server
$ npm start

# Platform-specific commands
$ npm run android
$ npm run ios
$ npm run web
```

## API Documentation

The NestJS backend provides a comprehensive RESTful API with the following features:

- **Modular Architecture**: Organized into feature modules
- **Dependency Injection**: Built-in DI container
- **Validation**: Request/response validation with class-validator
- **Authentication**: JWT-based authentication system
- **Database**: TypeORM integration
- **Testing**: Unit and e2e test coverage

### API Endpoints

```bash
# Health check
GET /health

# Application status
GET /
```

## Mobile Application

The React Native app provides a cross-platform mobile experience with:

- **Cross-platform**: iOS, Android, and Web support
- **TypeScript**: Full type safety
- **Hot Reloading**: Instant development feedback
- **Navigation**: React Navigation integration
- **State Management**: Built-in state management solutions

## Configuration

### Environment Variables

Create `.env.local` files in respective application directories:

**Backend (apps/api/.env.local)**:
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/miru
JWT_SECRET=your-secret-key
```

**Mobile (apps/mobile/.env.local)**:
```bash
EXPO_API_URL=http://localhost:3000/api
```

### Turbo Configuration

The monorepo uses Turbo for efficient builds and caching. Configuration is defined in `turbo.json`:

- **Pipeline**: Defines task dependencies and caching
- **Outputs**: Specifies build artifacts for caching
- **Dependencies**: Manages inter-package dependencies

## Testing

### Running Tests

```bash
# Run all tests
$ npm run test

# Run tests for specific packages
$ npm run test:api
$ npm run test:mobile

# Test coverage
$ npm run test:cov

# E2E tests
$ npm run test:e2e
```

### Test Structure

- **Unit Tests**: Individual component and service tests
- **Integration Tests**: API endpoint tests
- **E2E Tests**: End-to-end application tests

## Deployment

### Backend Deployment

```bash
# Build for production
$ npm run build:api

# Deploy to production
$ npm run deploy:api
```

### Mobile Deployment

```bash
# Build mobile app
$ npm run build:mobile

# Deploy to app stores
$ npm run deploy:mobile
```

### CI/CD

The project includes GitHub Actions workflows for:

- **Continuous Integration**: Automated testing on pull requests
- **Continuous Deployment**: Automatic deployment on merge
- **Code Quality**: Linting and type checking

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation as needed

### Development Guidelines

- **Commits**: Follow conventional commit messages
- **Branches**: Use feature branches for development
- **Reviews**: All PRs require code review
- **Tests**: Maintain test coverage above 80%

## Resources

Check out these resources for learning more:

- **[NestJS Documentation](https://docs.nestjs.com)** - Backend framework guide
- **[Expo Documentation](https://docs.expo.dev)** - Mobile development platform
- **[Turbo Documentation](https://turbo.build/repo/docs)** - Monorepo build system
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript guide
- **[React Native Docs](https://reactnative.dev)** - Mobile framework

### Community

- **Discord Server** - Chat with the community
- **GitHub Discussions** - Ask questions
- **Twitter** - Follow for updates

## Support

Miru is an MIT-licensed open source project. It grows thanks to the sponsors and support from the amazing backers. If you'd like to join them, please [read more here](CONTRIBUTING.md).

## Stay in Touch

- **Project Website** - [https://miru.dev](https://miru.dev/)
- **Twitter** - [@miruproject](https://twitter.com/miruproject)
- **GitHub** - [miru-project/miru](https://github.com/miru-project/miru)

## License

Miru is [MIT licensed](LICENSE).

---

<p align="center">
  <sub>Built with ❤️ by the Miru team</sub>
</p>
