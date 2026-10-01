@echo off
echo ========================================================
echo Thinkvistar Automated Build and Deploy Script
echo ========================================================

echo.
echo [1/4] Building the static site...
cd _src
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Aborting deployment.
    cd ..
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/4] Checking for changes...
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not initialized or there is an issue with Git.
    exit /b %errorlevel%
)

echo.
echo [3/4] Staging and committing changes...
git add .

:: Get current date and time for the commit message
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set commit_msg=Auto-deploy: %datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%

git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo [INFO] No new changes to commit. Your site is already up to date!
    exit /b 0
)

echo.
echo [4/4] Pushing to Git repository (Hostinger will auto-pull this)...
git push

if %errorlevel% neq 0 (
    echo [ERROR] Failed to push to the repository. Please check your internet connection or git permissions.
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo [SUCCESS] Site built and pushed successfully!
echo Hostinger will now pull the latest changes automatically.
echo ========================================================
pause
