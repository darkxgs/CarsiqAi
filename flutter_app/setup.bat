@echo off
echo Setting up CarsiqAi Flutter WebView App...
echo.

echo Step 1: Getting Flutter dependencies...
flutter pub get
if %errorlevel% neq 0 (
    echo Error: Failed to get dependencies. Make sure Flutter is installed.
    pause
    exit /b 1
)

echo.
echo Step 2: Generating splash screen...
flutter pub run flutter_native_splash:create
if %errorlevel% neq 0 (
    echo Warning: Could not generate splash screen. This is normal if no logo is provided.
)

echo.
echo Step 3: Checking Flutter doctor...
flutter doctor

echo.
echo Setup complete! 
echo.
echo Next steps:
echo 1. Add your logo as 'assets/images/splash_logo.png' (optional)
echo 2. Run 'flutter run' to test the app
echo 3. Run 'flutter build apk --release' to build for Android
echo.
pause