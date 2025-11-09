@echo off
echo.
echo ========================================
echo  BUD BUDOTS - BUILD AND RUN
echo ========================================
echo.
echo This script will help you build and run the app.
echo.
echo IMPORTANT: You need to have Android Studio installed!
echo.
echo ========================================
echo  INSTRUCTIONS:
echo ========================================
echo.
echo 1. OPEN ANDROID STUDIO
echo    - Launch Android Studio
echo    - Open this project: %~dp0
echo.
echo 2. WAIT FOR GRADLE SYNC
echo    - Let Android Studio sync (bottom right status)
echo.
echo 3. START YOUR EMULATOR
echo    - Tools → Device Manager
echo    - Click Play button on your emulator
echo    - Wait for it to boot completely
echo.
echo 4. USE ANDROID STUDIO TERMINAL
echo    - In Android Studio: View → Tool Windows → Terminal
echo    - OR click Terminal tab at bottom
echo.
echo 5. RUN THESE COMMANDS IN THAT TERMINAL:
echo.
echo    ./gradlew clean
echo    ./gradlew assembleDebug
echo    ./gradlew installDebug
echo.
echo ========================================
echo  OR JUST USE THE UI:
echo ========================================
echo.
echo 1. Open Android Studio
echo 2. Open this project
echo 3. Click Run button (green play icon)
echo 4. Select your emulator
echo 5. Done!
echo.
echo ========================================
echo.
echo Press any key to open Android Studio project folder...
pause >nul
explorer "%~dp0"
