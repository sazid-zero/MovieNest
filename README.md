# 🎬 MovieNest - Your Ultimate Cinema Companion

MovieNest is a feature-rich, high-performance mobile application built with **React Native (Expo)** that allows users to discover, track, and manage their favorite movies and TV shows. It integrates the **TMDB API** for a massive media database, **Appwrite** for robust backend services, and **JustWatch** for real-time streaming availability.

![MovieNest Banner](https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000)

## 🚀 App Highlights & Key Features

### 🔍 Powerful Discovery & Search
- **Multi-Media Search**: Search for Movies, TV Shows, and People (Actors/Directors) simultaneously.
- **Trending & Popular**: Real-time trending data from TMDB and localized popular picks.
- **Detailed Media Pages**: Comprehensive info including cast, trailers, budget, revenue, and production companies.

### 💾 Personalized Watchlist (Cloud Synced)
- **Instant Save**: Save any movie or TV show to your watchlist with a single tap.
- **Account Sync**: Powered by Appwrite, your watchlist is synced across devices and includes offline caching for instant access.
- **Smart Filtering**: The saved tab automatically categorizes your media and updates instantly on focus.

### 📺 Streaming Insights (JustWatch Integration)
- **Where to Watch**: View localized streaming providers (Netflix, Disney+, HBO, etc.) directly on the detail page.
- **Region Specific**: Automatically adjusts results based on the user's selected region.

### 👤 Advanced User Profiles
- **Custom Avatars**: Upload your own profile picture directly from your phone gallery to Appwrite Storage.
- **Account Management**: Secure authentication (Email/Password) with beautiful, dedicated onboarding screens.

### ⚙️ Full-Featured Settings
- **Localization**: Support for over 10 languages (English, Spanish, French, Japanese, etc.).
- **Content Preferences**: Toggle adult content filters and manage notification preferences.
- **Theme Consistent**: Branded visuals including a custom animated splash screen and pulse-animated loading states.

## 🛠️ Technical Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (Link-based routing)
- **Backend / Authentication**: [Appwrite](https://appwrite.io/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Image Handling**: `expo-image-picker` & `expo-image` for high-performance rendering.
- **Animations**: React Native `Animated` API for smooth transitions and branded elements.
- **Data Fetching**: Custom `useFetch` hook architecture for optimized API calls.

## 📽️ Visual Showcase

> The app features a custom-built **Branded Splash Screen** and a unique **Pulsing Film Icon Loading State** that provides a premium, "Gold" version feel.

### 🎨 Premium UI/UX
- **Smooth Gradients**: Linear gradients for a cinema-like aesthetic.
- **Glassmorphism**: Subtle blur effects and semi-transparent layers.
- **Responsive Grids**: Optimized for both small and large mobile screens with adaptive card sizing.

## 📦 Local Setup & Installation

Follow these steps to run MovieNest on your machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/MovieNest.git
   cd MovieNest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file and add your keys:
   ```env
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_APPWRITE_PROJECT_NAME=MovieNest
   ```

4. **Start the app**:
   ```bash
   npx expo start
   ```

## 🏗️ How to Generate an APK (Android)

To get a shareable APK for testing on physical devices:

1. **Install EAS CLI**: `npm install -g eas-cli`
2. **Login to Expo**: `eas login`
3. **Configure Build**: `eas build:configure`
4. **Build APK**:
   ```bash
   eas build -p android --profile preview
   ```
   *Once the build is complete, Expo will provide a QR code or download link for the APK.*

---

- 
