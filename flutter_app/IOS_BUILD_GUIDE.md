# iOS Build Guide for CarsiqAi App

## Prerequisites (Mac Required)

### 1. Install Required Software
- **macOS**: Monterey (12) or later recommended
- **Xcode**: Version 14.0 or later (from Mac App Store)
- **Flutter SDK**: Already installed ✅
- **CocoaPods**: iOS dependency manager
- **Apple Developer Account**: Required for App Store distribution

### 2. Install Xcode Command Line Tools
```bash
xcode-select --install
```

### 3. Install CocoaPods
```bash
sudo gem install cocoapods
```

### 4. Verify Flutter Setup
```bash
flutter doctor
```

Expected output should show:
- ✅ Flutter (Channel stable)
- ✅ Xcode - develop for iOS
- ✅ CocoaPods

---

## Step-by-Step iOS Build Process

### Step 1: Navigate to Flutter App Directory
```bash
cd flutter_app
```

### Step 2: Clean and Get Dependencies
```bash
# Clean previous builds
flutter clean

# Get all dependencies
flutter pub get

# Install iOS dependencies
cd ios
pod install
cd ..
```

### Step 3: Generate App Icons and Splash Screen
```bash
# Generate launcher icons
flutter pub run flutter_launcher_icons

# Generate splash screen
flutter pub run flutter_native_splash:create
```

### Step 4: Open Project in Xcode
```bash
open ios/Runner.xcworkspace
```

**⚠️ IMPORTANT**: Always open `Runner.xcworkspace`, NOT `Runner.xcodeproj`

---

## Xcode Configuration

### Step 5: Configure Signing & Capabilities

1. **Select Runner** in the project navigator (left sidebar)
2. **Select Runner target** under TARGETS
3. **Go to "Signing & Capabilities" tab**

#### Configure Team & Bundle ID:
- **Team**: Select your Apple Developer account
  - If you don't see your team, click "Add Account" and sign in
- **Bundle Identifier**: `com.carsiqai.app` (already configured)
- **Signing Certificate**: Automatic signing recommended
  - Check "Automatically manage signing"

#### For Development (Testing on Device):
- **Provisioning Profile**: Xcode will create automatically
- **Signing Certificate**: iOS Development

#### For App Store Distribution:
- **Provisioning Profile**: App Store
- **Signing Certificate**: iOS Distribution

### Step 6: Configure Deployment Target

1. In Xcode, select **Runner** target
2. Go to **General** tab
3. Set **Minimum Deployments**: iOS 12.0 or higher
4. Verify **Deployment Info**:
   - iPhone and iPad support
   - Supported orientations

### Step 7: Update App Information

The following are already configured in `Info.plist`:
- ✅ App Name: CarsiqAi
- ✅ Bundle ID: com.carsiqai.app
- ✅ Version: 1.0.0
- ✅ Privacy Policy URL: https://www.carsiqai.com/privacy

**Additional Required Privacy Descriptions** (if needed):
Add these to `ios/Runner/Info.plist` if your app uses these features:

```xml
<!-- Camera Access (if needed) -->
<key>NSCameraUsageDescription</key>
<string>CarsiqAi needs camera access to scan VIN numbers</string>

<!-- Photo Library (if needed) -->
<key>NSPhotoLibraryUsageDescription</key>
<string>CarsiqAi needs photo access to upload car images</string>

<!-- Location (if needed) -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>CarsiqAi needs location to find nearby service centers</string>
```

---

## Building the iOS App

### Option A: Build for Testing (Development)

#### 1. Connect Your iPhone
- Connect iPhone via USB
- Trust the computer on your iPhone
- Select your device in Xcode (top toolbar)

#### 2. Build and Run
```bash
flutter run --release
```

Or in Xcode:
- Select your device from the device dropdown
- Click the "Play" button (▶️) or press `Cmd + R`

#### 3. Trust Developer Certificate on iPhone
First time running:
1. Go to **Settings** > **General** > **VPN & Device Management**
2. Tap your developer certificate
3. Tap **Trust**

### Option B: Build for App Store Distribution

#### 1. Create App Store Connect Record

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** > **+** > **New App**
3. Fill in details:
   - **Platform**: iOS
   - **Name**: CarsiqAi
   - **Primary Language**: Arabic (or your choice)
   - **Bundle ID**: com.carsiqai.app
   - **SKU**: CARSIQAI001 (unique identifier)
   - **User Access**: Full Access

#### 2. Prepare App Metadata

Required information:
- **App Name**: CarsiqAi
- **Subtitle**: Your AI Car Assistant
- **Description**: (Prepare detailed description)
- **Keywords**: car, oil, maintenance, AI, assistant
- **Support URL**: https://www.carsiqai.com/support
- **Marketing URL**: https://www.carsiqai.com
- **Privacy Policy URL**: https://www.carsiqai.com/privacy

#### 3. Prepare Screenshots

Required sizes:
- **6.7" Display** (iPhone 14 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 pixels
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels

Minimum: 3-10 screenshots per device size

#### 4. Build Archive in Xcode

1. In Xcode, select **Any iOS Device (arm64)** from device dropdown
2. Go to **Product** > **Archive**
3. Wait for build to complete (5-10 minutes)
4. Xcode Organizer will open automatically

#### 5. Upload to App Store Connect

1. In Xcode Organizer:
   - Select your archive
   - Click **Distribute App**
   - Choose **App Store Connect**
   - Click **Upload**
   - Select **Automatically manage signing**
   - Click **Upload**

2. Wait for processing (15-60 minutes)

#### 6. Submit for Review

1. Go to App Store Connect
2. Select your app
3. Click **+ Version or Platform**
4. Fill in all required information
5. Add screenshots
6. Set pricing (Free or Paid)
7. Click **Submit for Review**

**Review time**: Typically 24-48 hours

---

## Alternative: Build IPA File via Command Line

### For Development/Testing (Ad Hoc)
```bash
# Build iOS app
flutter build ios --release

# Create IPA (requires Xcode)
cd ios
xcodebuild -workspace Runner.xcworkspace \
  -scheme Runner \
  -configuration Release \
  -archivePath build/Runner.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath build/Runner.xcarchive \
  -exportPath build/Runner.ipa \
  -exportOptionsPlist ExportOptions.plist
```

### For App Store Distribution
```bash
flutter build ipa --release
```

The IPA file will be located at:
`build/ios/ipa/carsiqai_app.ipa`

---

## Testing Options

### 1. TestFlight (Recommended)

**Advantages**:
- Test with up to 10,000 external testers
- No device UDID required
- Easy distribution via email/link
- Automatic updates

**Steps**:
1. Upload build to App Store Connect (see above)
2. Go to **TestFlight** tab
3. Add internal testers (your team)
4. Add external testers (beta users)
5. Testers install TestFlight app and accept invitation

### 2. Ad Hoc Distribution

**Advantages**:
- Direct installation without App Store
- Good for limited testing (up to 100 devices)

**Steps**:
1. Register device UDIDs in Apple Developer Portal
2. Create Ad Hoc provisioning profile
3. Build with Ad Hoc profile
4. Distribute IPA file via email/website

### 3. Development Build

**Advantages**:
- Quick testing during development
- Direct installation from Xcode

**Limitations**:
- Requires device to be connected
- Certificate expires in 7 days (free account) or 1 year (paid)

---

## Common Issues and Solutions

### Issue 1: "No Development Team Selected"
**Solution**:
1. Open Xcode
2. Go to Xcode > Preferences > Accounts
3. Add your Apple ID
4. Select team in Signing & Capabilities

### Issue 2: "CocoaPods Not Installed"
**Solution**:
```bash
sudo gem install cocoapods
cd ios
pod install
```

### Issue 3: "Module Not Found" Errors
**Solution**:
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
flutter clean
flutter pub get
```

### Issue 4: "Signing Certificate Expired"
**Solution**:
1. Go to Apple Developer Portal
2. Certificates > Create new certificate
3. Download and install
4. Refresh in Xcode

### Issue 5: "Build Failed - Architecture Issues"
**Solution**:
Add to `ios/Podfile`:
```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
      config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
    end
  end
end
```

### Issue 6: "WebView Not Loading"
**Solution**:
Verify `Info.plist` has:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

---

## App Store Submission Checklist

### Before Submission:
- [ ] App tested on real iOS devices
- [ ] All features working correctly
- [ ] No crashes or major bugs
- [ ] Privacy policy URL accessible
- [ ] Support URL accessible
- [ ] Screenshots prepared (all required sizes)
- [ ] App icon (1024x1024) ready
- [ ] App description written
- [ ] Keywords selected
- [ ] Age rating determined
- [ ] Pricing set

### App Store Guidelines:
- [ ] App provides value beyond website wrapper
- [ ] No broken links
- [ ] Proper error handling
- [ ] Respects user privacy
- [ ] No misleading information
- [ ] Follows Apple Human Interface Guidelines

---

## Performance Optimization

### 1. Reduce App Size
```bash
flutter build ios --release --split-debug-info=./debug-info --obfuscate
```

### 2. Enable Bitcode (if needed)
In Xcode:
- Build Settings > Enable Bitcode > Yes

### 3. Optimize Images
- Use compressed PNG/JPEG
- Use appropriate resolutions
- Consider WebP format

---

## Maintenance and Updates

### Updating the App

1. **Update Version Number**:
   - Edit `pubspec.yaml`: `version: 1.0.1+2`
   - First number: version (1.0.1)
   - Second number: build number (2)

2. **Build New Version**:
   ```bash
   flutter clean
   flutter pub get
   flutter build ipa --release
   ```

3. **Upload to App Store Connect**:
   - Follow same process as initial submission
   - Add "What's New" description

4. **Submit for Review**:
   - Typically faster for updates (24 hours)

---

## Resources

### Official Documentation
- [Flutter iOS Deployment](https://docs.flutter.dev/deployment/ios)
- [Apple Developer Portal](https://developer.apple.com)
- [App Store Connect](https://appstoreconnect.apple.com)
- [TestFlight](https://developer.apple.com/testflight/)

### Useful Commands
```bash
# Check Flutter setup
flutter doctor -v

# List connected devices
flutter devices

# Run on specific device
flutter run -d <device-id>

# Build for release
flutter build ios --release

# Build IPA
flutter build ipa --release

# Clean build
flutter clean

# Update dependencies
flutter pub upgrade
```

---

## Quick Start Commands

```bash
# Complete iOS build process
cd flutter_app
flutter clean
flutter pub get
cd ios
pod install
cd ..
flutter build ios --release

# Or build IPA directly
flutter build ipa --release
```

---

## Support

For issues:
1. Check Flutter documentation
2. Run `flutter doctor` for diagnostics
3. Check Xcode build logs
4. Review Apple Developer forums
5. Check App Store Connect status page

**Good luck with your iOS build! 🚀**
