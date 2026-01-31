# iOS Build Instructions - CarsiqAi

## 📱 App Information

**App Name**: CarsiqAi  
**Bundle ID**: com.carsiqai.app  
**Version**: 1.0.0 (Build 1)  
**Website**: https://carsiqai.vercel.app/  
**Type**: WebView wrapper with native features

---

## ✅ Already Configured

- ✅ Bundle ID, app name, version
- ✅ Info.plist with all required keys
- ✅ Podfile for CocoaPods
- ✅ All dependencies specified
- ✅ WebView, pull-to-refresh, offline detection
- ✅ App icon and splash screen configured
- ✅ Privacy Policy URL set

---

## 🚀 Build Steps

### Prerequisites
- macOS Monterey (12) or later
- Xcode 14.0+ (from Mac App Store)
- Flutter SDK installed
- CocoaPods installed (`sudo gem install cocoapods`)
- Apple Developer Account

### Step 1: Setup (10 minutes)

```bash
cd flutter_app

# Clean and get dependencies
flutter clean
flutter pub get

# Generate icons and splash screen
flutter pub run flutter_launcher_icons
flutter pub run flutter_native_splash:create

# Install iOS dependencies
cd ios
pod install
cd ..
```

### Step 2: Open in Xcode

```bash
open ios/Runner.xcworkspace
```

**⚠️ IMPORTANT**: Always open `Runner.xcworkspace`, NOT `Runner.xcodeproj`

### Step 3: Configure Signing (5 minutes)

In Xcode:
1. Select **Runner** in the left sidebar
2. Select **Runner** target under TARGETS
3. Go to **Signing & Capabilities** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** from dropdown
6. Verify Bundle Identifier: `com.carsiqai.app`

### Step 4: Build Options

#### Option A: Test on Device (Recommended First)
```bash
# Connect iPhone via USB
# Trust computer on iPhone
flutter run --release
```

First time: Go to iPhone Settings > General > VPN & Device Management > Trust certificate

#### Option B: Build IPA for Distribution
```bash
flutter build ipa --release
```

IPA location: `build/ios/ipa/carsiqai_app.ipa`

#### Option C: Build via Xcode (for App Store)
1. In Xcode, select **Any iOS Device (arm64)**
2. Go to **Product** > **Archive**
3. Wait for build (5-10 minutes)
4. Xcode Organizer opens automatically
5. Click **Distribute App** > **App Store Connect** > **Upload**

---

## 📱 App Store Submission Checklist

### Required Information

#### App Metadata
- **App Name**: CarsiqAi
- **Subtitle**: Your AI Car Assistant
- **Primary Language**: Arabic (or English)
- **Category**: Utilities or Productivity
- **Age Rating**: 4+
- **Price**: Free

#### URLs (Already Configured)
- **Website**: https://carsiqai.vercel.app/
- **Privacy Policy**: https://www.carsiqai.com/privacy
- **Support URL**: https://www.carsiqai.com/support

#### Description (Suggested)
```
CarsiqAi is your intelligent car maintenance assistant powered by AI. Get instant recommendations for:

• Engine oil specifications
• Oil filter numbers (Denckermann verified)
• Air filter recommendations
• Maintenance schedules
• Car specifications

Features:
✓ AI-powered recommendations
✓ Support for all major car brands
✓ Arabic language support
✓ Verified Denckermann filter database
✓ Instant answers to car maintenance questions

Perfect for car owners who want accurate, reliable maintenance information at their fingertips.
```

#### Keywords (Suggested)
```
car, oil, maintenance, AI, assistant, filter, engine, automotive, vehicle, service
```

### Required Assets

#### App Icon
- **Size**: 1024x1024 pixels
- **Format**: PNG (no transparency)
- **Location**: Will be generated from `assets/images/splash_logo.png`

#### Screenshots (Required Sizes)
You need to provide screenshots for:
- **6.7" Display** (iPhone 14 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 pixels
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels

**Minimum**: 3 screenshots per size  
**Maximum**: 10 screenshots per size

**How to capture**:
1. Run app on simulator: `flutter run`
2. Use Xcode > Window > Devices and Simulators
3. Select device > Take Screenshot
4. Or use iOS Simulator > File > Save Screen

---

## 🔧 Technical Details

### Project Structure
```
flutter_app/
├── lib/
│   ├── main.dart                    # App entry point
│   └── screens/
│       └── webview_screen.dart      # Main WebView screen
├── ios/
│   ├── Runner.xcworkspace           # Open this in Xcode
│   ├── Runner/
│   │   └── Info.plist              # App configuration
│   ├── Podfile                      # CocoaPods dependencies
│   └── ExportOptions.plist          # Export settings
├── assets/
│   └── images/
│       └── splash_logo.png          # App logo
├── pubspec.yaml                     # Flutter dependencies
├── ios_setup.sh                     # Automated setup script
├── IOS_BUILD_GUIDE.md              # Detailed build guide
└── IOS_QUICK_START.md              # Quick reference
```

### Key Configuration Files

#### pubspec.yaml
- App version: `1.0.0+1`
- Dependencies properly configured
- Assets path configured
- Icon and splash screen generators configured

#### ios/Runner/Info.plist
- Bundle ID: `com.carsiqai.app`
- Display Name: `CarsiqAi`
- Privacy Policy URL configured
- App Transport Security enabled
- All required permissions set

#### ios/Podfile
- iOS 12.0 minimum deployment target
- M1 Mac compatibility configured
- Bitcode disabled (as per Apple's deprecation)
- Swift 5.0 configured

---

## 🐛 Common Issues & Solutions

### Issue 1: "No Development Team Selected"
**Solution**:
1. Xcode > Preferences > Accounts
2. Add your Apple ID
3. Select team in Signing & Capabilities

### Issue 2: "CocoaPods not installed"
**Solution**:
```bash
sudo gem install cocoapods
cd ios
pod install
```

### Issue 3: "Module not found" errors
**Solution**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
flutter clean
flutter pub get
```

### Issue 4: Build fails with architecture errors
**Solution**: Already configured in Podfile, but if issues persist:
```bash
cd ios
pod deintegrate
pod install
```

### Issue 5: App icon not showing
**Solution**:
```bash
flutter pub run flutter_launcher_icons
cd ios
pod install
```

---

## 📊 Testing Checklist

Before submitting to App Store:

### Functionality Tests
- [ ] App launches successfully
- [ ] Website loads correctly
- [ ] Pull-to-refresh works
- [ ] Internet connection detection works
- [ ] Offline mode shows correct message
- [ ] Error handling works (airplane mode test)
- [ ] Retry button works
- [ ] App doesn't crash on any action

### UI/UX Tests
- [ ] Splash screen displays correctly
- [ ] App icon looks good on home screen
- [ ] Loading indicator shows during page load
- [ ] Status bar is visible
- [ ] All orientations work (portrait/landscape)
- [ ] Safe area respected (notch devices)

### Performance Tests
- [ ] App launches in < 3 seconds
- [ ] Website loads smoothly
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No lag or freezing

### Device Tests
Test on:
- [ ] iPhone 14 Pro Max (or latest)
- [ ] iPhone 11 (or similar)
- [ ] iPhone 8 (or similar)
- [ ] iPad (if supporting)

---

## 📚 Documentation Reference

All documentation is in the `flutter_app` folder:

1. **IOS_BUILD_GUIDE.md** - Complete step-by-step guide
   - Prerequisites installation
   - Xcode configuration
   - Building for different targets
   - App Store submission process
   - Troubleshooting

2. **IOS_QUICK_START.md** - Quick reference
   - Fast-track commands
   - Testing options
   - Common fixes

3. **IOS_DEVELOPER_HANDOFF.md** - This document
   - Project overview
   - What's done vs what's needed
   - Complete checklist

---

## 🎯 Quick Command Reference

```bash
# Setup (run once)
cd flutter_app
chmod +x ios_setup.sh
./ios_setup.sh

# Open in Xcode
open ios/Runner.xcworkspace

# Test on device
flutter run --release

# Build IPA
flutter build ipa --release

# Check Flutter setup
flutter doctor -v

# List devices
flutter devices

# Clean build
flutter clean
flutter pub get
cd ios && pod install && cd ..

# Update dependencies
flutter pub upgrade
cd ios && pod update && cd ..
```

---

## 📞 Support & Resources

### Official Documentation
- [Flutter iOS Deployment](https://docs.flutter.dev/deployment/ios)
- [Apple Developer Portal](https://developer.apple.com)
- [App Store Connect](https://appstoreconnect.apple.com)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

### Useful Links
- [Flutter WebView Plugin](https://pub.dev/packages/webview_flutter)
- [Connectivity Plus Plugin](https://pub.dev/packages/connectivity_plus)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

## ✅ Final Checklist Before Handoff

- [x] All configuration files created
- [x] Bundle ID configured
- [x] App name set
- [x] Website URL configured
- [x] Privacy policy URL set
- [x] Dependencies configured
- [x] Podfile created
- [x] ExportOptions.plist created
- [x] Setup script created
- [x] Documentation complete
- [x] Logo file present
- [x] Icon generation configured
- [x] Splash screen configured
- [x] Info.plist properly configured

---

## 🎉 Ready to Build!

Everything is configured and ready. The iOS developer just needs to:

1. ✅ Run `./ios_setup.sh`
2. ✅ Open Xcode and configure signing
3. ✅ Build and test
4. ✅ Submit to App Store

**Estimated Time**: 
- Initial setup: 10 minutes
- Testing: 30 minutes
- App Store submission: 1 hour
- Review time: 24-48 hours

**Good luck with the iOS build! 🚀**

---

## 📝 Notes for Developer

- The app is a WebView wrapper, so most functionality is in the website
- The Flutter app provides native features: splash screen, pull-to-refresh, offline detection
- No backend changes needed - everything is frontend
- The app is already working on Android, so iOS should be straightforward
- All URLs and configurations are production-ready
- No API keys or secrets needed in the app itself

---

**Document Version**: 1.0  
**Last Updated**: January 31, 2026  
**Prepared By**: Development Team  
**Status**: ✅ Ready for iOS Build
