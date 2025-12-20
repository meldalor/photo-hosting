# Windows SDK Installation Helper for better-sqlite3
# This script helps identify the issue and guides through installation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Windows SDK Installation Helper" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check Visual Studio installations
Write-Host "`nChecking Visual Studio installations..." -ForegroundColor Yellow

$vsWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"

if (Test-Path $vsWhere) {
    $vsInstalls = & $vsWhere -all -format json | ConvertFrom-Json

    if ($vsInstalls) {
        Write-Host "✓ Found Visual Studio installations:" -ForegroundColor Green
        foreach ($install in $vsInstalls) {
            Write-Host "  - $($install.displayName) at $($install.installationPath)" -ForegroundColor Gray
        }
    } else {
        Write-Host "✗ No Visual Studio installations found" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Visual Studio Installer not found" -ForegroundColor Red
}

# Check for Windows SDK
Write-Host "`nChecking for Windows SDK..." -ForegroundColor Yellow

$sdkPaths = @(
    "${env:ProgramFiles(x86)}\Windows Kits\10\Include",
    "${env:ProgramFiles}\Windows Kits\10\Include"
)

$sdkFound = $false
foreach ($path in $sdkPaths) {
    if (Test-Path $path) {
        $sdkVersions = Get-ChildItem $path -Directory | Where-Object { $_.Name -match '^\d+\.' }
        if ($sdkVersions) {
            Write-Host "✓ Found Windows SDK versions:" -ForegroundColor Green
            foreach ($version in $sdkVersions) {
                Write-Host "  - $($version.Name)" -ForegroundColor Gray
            }
            $sdkFound = $true
            break
        }
    }
}

if (-not $sdkFound) {
    Write-Host "✗ Windows SDK not found - THIS IS THE PROBLEM!" -ForegroundColor Red
}

# Diagnosis
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSIS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($sdkFound) {
    Write-Host "✓ Windows SDK is installed. If npm install still fails," -ForegroundColor Green
    Write-Host "  try reinstalling better-sqlite3:" -ForegroundColor Green
    Write-Host "  npm install better-sqlite3 --build-from-source`n" -ForegroundColor Yellow
} else {
    Write-Host "✗ Windows SDK is NOT installed." -ForegroundColor Red
    Write-Host "  This is required for better-sqlite3 to compile.`n" -ForegroundColor Red

    Write-Host "SOLUTION:" -ForegroundColor Yellow
    Write-Host "1. Open Visual Studio Installer" -ForegroundColor White
    Write-Host "2. Click 'Modify' for Visual Studio 2022 Build Tools" -ForegroundColor White
    Write-Host "3. Go to 'Individual components' tab" -ForegroundColor White
    Write-Host "4. Search for and check: 'Windows 11 SDK' or 'Windows 10 SDK'" -ForegroundColor White
    Write-Host "5. Click 'Modify' and wait for installation" -ForegroundColor White
    Write-Host "6. Run: npm install`n" -ForegroundColor White
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OPENING VISUAL STUDIO INSTALLER..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$vsInstaller = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vs_installer.exe"

if (Test-Path $vsInstaller) {
    Start-Process $vsInstaller
    Write-Host "✓ Visual Studio Installer opened." -ForegroundColor Green
    Write-Host "`nFollow the steps above to install Windows SDK." -ForegroundColor Yellow
} else {
    Write-Host "✗ Could not find Visual Studio Installer" -ForegroundColor Red
    Write-Host "`nPlease install Visual Studio Build Tools from:" -ForegroundColor Yellow
    Write-Host "https://visualstudio.microsoft.com/downloads/" -ForegroundColor Cyan
}

Write-Host "`nFor detailed instructions, see: WINDOWS_SDK_SETUP.md" -ForegroundColor Gray
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
