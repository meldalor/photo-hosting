@echo off
echo ========================================
echo Windows SDK Installation Helper
echo ========================================
echo.
echo This script will help you install Windows SDK
echo required for better-sqlite3 compilation.
echo.
echo Step 1: Opening Visual Studio Installer...
echo.

REM Check if VS Installer exists
set "VS_INSTALLER=C:\Program Files (x86)\Microsoft Visual Studio\Installer\vs_installer.exe"

if exist "%VS_INSTALLER%" (
    echo Found Visual Studio Installer at: %VS_INSTALLER%
    echo.
    echo Opening Visual Studio Installer...
    start "" "%VS_INSTALLER%"
    echo.
    echo ========================================
    echo NEXT STEPS:
    echo ========================================
    echo 1. In Visual Studio Installer, click "Modify" for
    echo    Visual Studio 2022 Build Tools
    echo.
    echo 2. Go to "Individual components" tab
    echo    (Russian: "Отдельные компоненты")
    echo.
    echo 3. Search for and check:
    echo    - Windows 11 SDK (latest version)
    echo    - or Windows 10 SDK (10.0.19041.0 or newer)
    echo.
    echo 4. Click "Modify" and wait for installation
    echo.
    echo 5. After installation, run in this directory:
    echo    npm install
    echo.
    echo ========================================
    echo.
    pause
) else (
    echo ERROR: Visual Studio Installer not found!
    echo.
    echo It should be at: %VS_INSTALLER%
    echo.
    echo Please install Visual Studio Build Tools from:
    echo https://visualstudio.microsoft.com/downloads/
    echo.
    echo Or see WINDOWS_SDK_SETUP.md for alternative methods.
    echo.
    pause
)
