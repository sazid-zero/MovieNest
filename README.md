# 🎬 MovieNest

<div align="center">

**A Production-Grade Cross-Platform Media Discovery Application**

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.0-38bdf8.svg)](https://www.nativewind.dev/)

</div>

![MovieNest Banner](https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000)

## 📋 Overview

MovieNest is a full-stack mobile application engineered with modern React Native architecture, demonstrating advanced state management, RESTful API integration, and cloud-based backend services. The application provides a comprehensive media discovery platform with real-time data synchronization, optimized performance, and enterprise-level code quality.

### 🎯 Technical Achievements

- **Type-Safe Development**: 100% TypeScript implementation with strict type checking and custom interface definitions
- **Modern Navigation**: File-based routing using Expo Router with nested navigation stacks and tab-based architecture
- **Performance Optimized**: Custom lazy loading, image caching, and optimized re-render strategies
- **Cloud-Native Backend**: Real-time data synchronization with Appwrite BaaS, including authentication and cloud storage
- **Production Ready**: Configured for EAS Build with environment-based deployments

## 🏗️ Architecture & Design Patterns

### Core Architecture

```
├── File-Based Routing (Expo Router)
├── Context API (Global State Management)
├── Custom Hooks Pattern (Data Fetching & Lifecycle)
├── Service Layer Abstraction (API & Backend)
└── Component-Driven Architecture (Reusable UI Components)
```

### Key Technical Implementations

**State Management**

- Global Context API with TypeScript generics for type-safe state distribution
- Custom `useFetch` hook with loading states, error handling, and automatic refetching
- React hooks optimization to prevent unnecessary re-renders

**API Integration**

- RESTful service layer with axios-like abstraction
- Multi-source API aggregation (TMDB + JustWatch)
- Request caching and optimized data fetching strategies
- Environment-based configuration management

**Backend Services (Appwrite)**

- JWT-based authentication with secure session management
- NoSQL database operations (CRUD) for user watchlists
- Cloud storage integration for profile image uploads
- Real-time data synchronization across devices

**Performance Optimization**

- Lazy loading and code splitting for route-based chunks
- Image optimization with expo-image (WebP support, caching)
- Debounced search implementation to reduce API calls
- FlatList virtualization for large dataset rendering

## 🛠️ Technical Stack

### Frontend

| Technology        | Purpose                  | Implementation Highlights                               |
| ----------------- | ------------------------ | ------------------------------------------------------- |
| **React Native**  | Cross-platform framework | Native performance with JavaScript runtime              |
| **Expo SDK 51**   | Development framework    | Managed workflow with OTA updates                       |
| **TypeScript**    | Type safety              | Strict mode, custom types, interface-driven development |
| **Expo Router**   | Navigation               | File-based routing, deep linking support                |
| **NativeWind v4** | Styling                  | Tailwind CSS with JIT compilation for RN                |

### Backend & Services

| Service           | Purpose        | Implementation Details                      |
| ----------------- | -------------- | ------------------------------------------- |
| **Appwrite**      | BaaS Platform  | Authentication, Database, Storage APIs      |
| **TMDB API**      | Media Database | RESTful integration with 100k+ movies/shows |
| **JustWatch API** | Streaming Data | Real-time provider availability by region   |

### Development Tools

- **ESLint**: Custom configuration for code quality enforcement
- **Babel**: Transpilation with module aliasing
- **Metro**: Fast bundler with optimized caching
- **EAS Build**: Cloud-based native builds for iOS/Android

## 🌟 Core Features

### 🔍 Advanced Search & Discovery

- **Multi-Entity Search**: Concurrent search across movies, TV shows, and people with debounced input
- **Dynamic Trending**: Real-time trending content with daily/weekly toggles
- **Intelligent Filtering**: Genre-based filters, rating thresholds, and release date ranges
- **Deep Linking**: Direct navigation to specific content via URL schemes

### 💾 Cloud-Synchronized Watchlist

- **Real-Time Sync**: Instant synchronization across devices using Appwrite Realtime
- **Offline Support**: Local caching with background sync when connection is restored
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Batch Operations**: Efficient bulk add/remove with transaction support

### 📺 Streaming Intelligence

- **Multi-Provider Aggregation**: Display 50+ streaming platforms (Netflix, Disney+, HBO Max, etc.)
- **Geo-Location Aware**: Automatic region detection with manual override
- **Price Comparison**: Display rental/purchase pricing across platforms
- **Availability Alerts**: Future feature: Notifications when content becomes available

### 🔐 Secure Authentication

- **Email/Password Auth**: Bcrypt-hashed passwords with Appwrite's security layer
- **Session Management**: Persistent sessions with automatic token refresh
- **Protected Routes**: Navigation guards preventing unauthorized access
- **Account Recovery**: Password reset flow with email verification

### 🎨 Premium UI/UX Implementation

- **Custom Animations**: Spring-based animations using React Native Animated API
- **Glassmorphism Effects**: Backdrop blur with semi-transparent overlays
- **Skeleton Loading**: Content-aware skeleton screens during data fetch
- **Gesture Handling**: Native gesture responders for swipe and pan interactions

## � Project Structure

```
MovieNest/
├── app/                          # File-based routing (Expo Router)
│   ├── (auth)/                   # Authentication flow (grouped route)
│   │   ├── _layout.tsx           # Auth stack navigator
│   │   ├── sign-in.tsx           # Login screen
│   │   └── sign-up.tsx           # Registration screen
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx           # Tab navigator configuration
│   │   ├── index.tsx             # Home/Discover screen
│   │   ├── search.tsx            # Multi-entity search
│   │   ├── saved.tsx             # Watchlist management
│   │   └── profile.tsx           # User profile & settings
│   ├── movies/[id].tsx           # Dynamic movie detail route
│   ├── tv/[id].tsx               # Dynamic TV show detail route
│   ├── person/[id].tsx           # Dynamic person/actor detail route
│   ├── settings/                 # Settings stack
│   ├── _layout.tsx               # Root layout with providers
│   └── globals.css               # Global Tailwind styles
├── components/                   # Reusable UI components
│   ├── MediaCard.tsx             # Generic media display card
│   ├── SearchBar.tsx             # Debounced search input
│   ├── CustomButton.tsx          # Themed button component
│   ├── FormField.tsx             # Controlled form input
│   └── Loading.tsx               # Animated loading indicator
├── services/                     # External service integrations
│   ├── api.ts                    # TMDB & JustWatch API client
│   ├── appwrite.ts               # Appwrite SDK configuration
│   └── useFetch.ts               # Custom data fetching hook
├── context/                      # Global state management
│   └── GlobalContext.tsx         # User session & app state
├── interfaces/                   # TypeScript type definitions
│   └── interfaces.d.ts           # Shared interfaces & types
└── constants/                    # Static assets & configuration
    ├── icons.ts                  # Icon mappings
    └── images.ts                 # Image asset exports
```

## 🔧 Development Setup

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
Expo CLI (installed globally or via npx)
```

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/MovieNest.git
   cd MovieNest
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # TMDB API Configuration
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key_v3

   # Appwrite Configuration
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
   EXPO_PUBLIC_APPWRITE_BUCKET_ID=your_storage_bucket_id
   ```

   **Getting API Keys:**
   - TMDB API: Register at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Appwrite: Create project at [cloud.appwrite.io](https://cloud.appwrite.io)

4. **Run Development Server**

   ```bash
   # Start Metro bundler
   npx expo start

   # Run on specific platform
   npx expo start --android
   npx expo start --ios
   npx expo start --web
   ```

### Development Scripts

```bash
# Start development server with cache clear
npm run start -- --clear

# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

## 📱 Building for Production

### Android APK/AAB (EAS Build)

1. **Install EAS CLI**

   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**

   ```bash
   eas login
   eas build:configure
   ```

3. **Build APK (Development)**

   ```bash
   eas build -p android --profile preview
   ```

4. **Build AAB (Production)**
   ```bash
   eas build -p android --profile production
   ```

### iOS Build

```bash
# Requires Apple Developer Account
eas build -p ios --profile production
```

## 💻 Code Quality & Best Practices

### TypeScript Implementation

- **Strict Mode**: Enabled for maximum type safety
- **Custom Types**: Comprehensive interface definitions for all API responses
- **Type Guards**: Runtime type checking for external data
- **Generic Utilities**: Reusable type-safe utility functions

### Component Architecture

- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Props Interfaces**: Fully typed props for all components
- **Composition Pattern**: Favor composition over inheritance
- **Memoization**: Strategic use of `React.memo` for performance

### State Management Strategy

- **Context API**: Global state for authentication and user data
- **Local State**: Component-level state for UI interactions
- **Custom Hooks**: Encapsulated logic with `useState` and `useEffect`
- **Derived State**: Computed values to avoid redundant state

### Performance Optimizations

- **Image Optimization**: WebP format with fallbacks, lazy loading
- **List Virtualization**: FlatList with `windowSize` optimization
- **Debouncing**: 300ms debounce on search inputs
- **Code Splitting**: Route-based lazy loading with Expo Router
- **Bundle Analysis**: Regular bundle size monitoring and optimization

## 🎓 Skills Demonstrated

### Frontend Development

- React Native mobile development
- TypeScript for type-safe applications
- Modern React patterns (Hooks, Context, Suspense)
- Responsive design and cross-platform compatibility
- CSS-in-JS with Tailwind methodology

### Backend Integration

- RESTful API integration and error handling
- OAuth 2.0 and JWT authentication flows
- Cloud storage and CDN integration
- Database operations (CRUD) with NoSQL
- Real-time data synchronization

### DevOps & Tooling

- Environment-based configuration management
- CI/CD with EAS Build
- Git workflow and version control
- Debugging with React Native Debugger
- Performance profiling and optimization

### Software Engineering

- Clean code principles (SOLID, DRY)
- Component-driven development
- Test-driven development mindset
- Documentation and code comments
- Agile development practices


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Contact

**Your Name**

- GitHub: [@sazid-zero](https://github.com/sazid-zero)
- LinkedIn: [Sharif Mahmud Sazid](https://linkedin.com/in/sharif-mahmud-sazid)
- Email: sharif.sazid.3@gmail.com

---

<div align="center">
  
**Built using React Native & Modern Web Technologies**

⭐ Star this repo if you find it helpful!

</div>
