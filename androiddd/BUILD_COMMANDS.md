# Build Commands for Bud Budots Android App

## Using PowerShell in Windows

# Navigate to the android project folder
cd "c:\Users\Admin\Downloads\Final Project\android"

# Clean the project
.\gradlew clean

# Build debug APK
.\gradlew assembleDebug

# Install on connected emulator/device
.\gradlew installDebug

# Build and install in one command
.\gradlew clean assembleDebug installDebug

# The APK will be at:
# android\app\build\outputs\apk\debug\app-debug.apk
