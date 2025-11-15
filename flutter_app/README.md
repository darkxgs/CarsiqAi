# CarsiqAi WebView App

A Flutter WebView application that wraps the CarsiqAi website with native mobile features.

## Features

- **WebView Integration**: Seamlessly loads your website in a native mobile app
- **Splash Screen**: Custom splash screen with your logo
- **Pull-to-Refresh**: Users can pull down to refresh the webpage
- **Internet Connection Check**: Automatically detects and handles network connectivity
- **Error Handling**: Graceful error handling with retry options
- **Native Performance**: Optimized for both Android and iOS

## Setup Instructions

### 1. Prerequisites
- **Flutter SDK**: Download from https://flutter.dev/docs/get-started/install
- **Android Studio**: For Android development and emulator
- **Xcode**: For iOS development (macOS only)
- **Git**: For version control
- **Your website URL**: ✅ Already configured (https://carsiqai.vercel.app/)

### 2. Configuration

#### Website URL ✅ COMPLETED
The website URL has been configured to point to your CarsiqAi website:
```dart
static const String _websiteUrl = 'https://carsiqai.vercel.app/';
```

#### Add Your Logo
1. Create an `assets/images/` directory
2. Add your splash screen logo as `splash_logo.png`
3. Recommended size: 512x512px PNG with transparent background

### 3. Installation

#### Quick Setup (Windows)
```cmd
cd flutter_app
setup.bat
```

#### Quick Setup (macOS/Linux)
```bash
cd flutter_app
./setup.sh
```

#### Manual Setup
```bash
# Navigate to the flutter_app directory
cd flutter_app

# Get dependencies
flutter pub get

# Generate splash screen (optional - works without logo)
flutter pub run flutter_native_splash:create

# Run on Android
flutter run

# Build for release
flutter build apk --release  # Android
flutter build ios --release  # iOS
```

#### First Time Flutter Setup
If you don't have Flutter installed:
1. Download Flutter SDK from https://flutter.dev/docs/get-started/install
2. Add Flutter to your PATH
3. Run `flutter doctor` to check setup
4. Install Android Studio for Android development

### 4. Platform-Specific Setup

#### Android
- Update `android/app/build.gradle` with your app details
- Modify `android/app/src/main/AndroidManifest.xml` for permissions
- Update package name in `MainActivity.kt`

#### iOS
- Configure `ios/Runner/Info.plist` with your app information
- Set up signing in Xcode
- Update bundle identifier

## App Structure

```
lib/
├── main.dart              # App entry point
└── screens/
    └── webview_screen.dart # Main WebView screen

android/                   # Android-specific files
ios/                      # iOS-specific files
assets/images/            # App assets (logo, etc.)
```

## Key Features Implementation

### Internet Connection Check
- Uses `connectivity_plus` package
- Automatically detects network changes
- Shows appropriate UI when offline

### Pull-to-Refresh
- Implemented with `RefreshIndicator`
- Reloads the WebView content
- Smooth native feel

### Error Handling
- Catches WebView loading errors
- Provides retry functionality
- User-friendly error messages

### Splash Screen
- Configured via `flutter_native_splash`
- Customizable colors and logo
- Supports Android 12+ splash screen API

## Customization

### Colors and Theming
Update the theme in `lib/main.dart`:
```dart
theme: ThemeData(
  primarySwatch: Colors.blue, // Change to your brand color
  useMaterial3: true,
),
```

### App Name and Package
1. Update `pubspec.yaml` name field
2. Change package names in Android and iOS configurations
3. Update app display names in manifest files

### Additional Features
The app structure supports easy addition of:
- Push notifications
- Deep linking
- Native sharing
- Biometric authentication
- Local storage

## Building for Production

### Android
```bash
flutter build apk --release
# or for app bundle
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## Troubleshooting

### Common Issues
1. **WebView not loading**: Check internet permissions and URL
2. **Splash screen not showing**: Run `flutter pub run flutter_native_splash:create`
3. **Build errors**: Ensure all dependencies are properly installed

### Platform-Specific Issues
- **Android**: Check minimum SDK version compatibility
- **iOS**: Ensure proper signing and provisioning profiles

## Support

For issues related to:
- Flutter WebView: Check `webview_flutter` documentation
- Connectivity: Refer to `connectivity_plus` package docs
- Platform-specific builds: Consult Flutter's official documentation