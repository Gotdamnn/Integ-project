# Bud Budots Android App

This is an Android WebView application for the Bud Budots Filipino food delivery service.

## Prerequisites
- Android Studio (latest version recommended)
- Android SDK with API Level 24 or higher
- Android Emulator or physical device

## How to Open in Android Studio

1. **Open Android Studio**

2. **Import the Project**
   - Click on "Open" or "Open an Existing Project"
   - Navigate to: `c:\Users\Admin\Downloads\Final Project\android`
   - Select the `android` folder and click "OK"

3. **Wait for Gradle Sync**
   - Android Studio will automatically sync the Gradle files
   - This may take a few minutes on first run
   - Wait until you see "Gradle sync finished" in the status bar

4. **Configure Emulator (if not already done)**
   - Go to Tools → Device Manager
   - Your existing emulator should appear in the list
   - If not, create a new Virtual Device

## How to Run the App

1. **Select Your Emulator**
   - At the top toolbar, click the device dropdown
   - Select your emulator from the list

2. **Run the App**
   - Click the green "Play" button (▶) or press Shift+F10
   - The emulator will start (if not already running)
   - The app will install and launch automatically

3. **The App Will Open**
   - The app starts with the Login page
   - All your web pages are accessible through navigation
   - Back button works to navigate between pages

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── assets/          # Your web files are here
│   │       │   ├── Assets/      # Images and resources
│   │       │   ├── Guest Page/  # Guest user pages
│   │       │   ├── Log In/      # Login pages
│   │       │   ├── User Dashboard/ # Dashboard pages
│   │       │   └── User Page/   # User pages
│   │       ├── java/
│   │       │   └── com/budbudots/app/
│   │       │       └── MainActivity.java
│   │       ├── res/             # Android resources
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
└── settings.gradle
```

## Features

- **WebView Integration**: Your HTML/CSS/JS files run in a native Android WebView
- **JavaScript Enabled**: Full JavaScript support for interactive features
- **Local Storage**: DOM storage and database enabled for data persistence
- **Back Button**: Android back button navigates through page history
- **Internet Permission**: Can load external resources (fonts, icons, etc.)

## Troubleshooting

### Gradle Sync Issues
- Go to File → Invalidate Caches / Restart
- Clean the project: Build → Clean Project
- Rebuild: Build → Rebuild Project

### App Not Installing
- Ensure emulator is running properly
- Try: Build → Clean Project, then run again
- Check that minimum SDK version matches your emulator (API 24+)

### Web Pages Not Loading
- Check that files are in `app/src/main/assets/` folder
- Verify file paths in HTML files are relative
- Check Android Studio's Logcat for errors

### External Resources Not Loading
- Ensure emulator has internet connection
- Check that `android:usesCleartextTraffic="true"` is in AndroidManifest.xml
- Verify INTERNET permission is declared

## Customization

### Change Starting Page
Edit `MainActivity.java` line 47:
```java
webView.loadUrl("file:///android_asset/Log In/Log In.html");
```

### Modify App Name
Edit `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Bud Budots</string>
```

### Change App Colors
Edit `app/src/main/res/values/themes.xml` and `colors.xml`

## Building APK

To create an installable APK:
1. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Wait for build to complete
3. Click "locate" in the notification to find your APK
4. APK will be in `app/build/outputs/apk/debug/`

## Notes

- The app uses WebView which is perfect for web-based content
- All your existing HTML, CSS, and JavaScript code works without changes
- The app includes permissions for internet access (for CDN resources like fonts and icons)
- Minimum Android version: 7.0 (API 24)
- Target Android version: 14 (API 34)

## Support

For Android Studio help: https://developer.android.com/studio
For WebView documentation: https://developer.android.com/guide/webapps/webview
