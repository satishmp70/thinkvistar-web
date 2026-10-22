@echo off
setlocal
REM Deploys by pushing SOURCE to main. GitHub Actions builds, checks (SEO + links) and
REM publishes the finished site to the "deploy" branch, which Hostinger pulls.
echo ========================================================
echo Thinkvistar Check and Deploy
echo ========================================================

echo.
echo [1/4] Building and running all checks locally (same checks CI runs)...
pushd src
call npm run build
if errorlevel 1 ( echo [ERROR] Build failed. Aborting. & popd & exit /b 1 )
call npm test
if errorlevel 1 ( echo [ERROR] Checks failed ^(SEO, routes, browser, form endpoint^). Aborting. & popd & exit /b 1 )
popd

echo.
echo [2/4] Staging changes...
git add -A
git diff --cached --name-only --diff-filter=D | findstr /B /C:"src/" /C:"static/" >nul
if not errorlevel 1 (
    echo [ERROR] This commit would delete files from src/ or static/. Review: git diff --cached --stat
    git reset -q
    exit /b 1
)
git diff --cached --stat
echo.
choice /m "Commit and push these changes"
if errorlevel 2 ( git reset -q & echo Cancelled. & exit /b 0 )

echo.
echo [3/4] Committing...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
git commit -m "Update site %datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%"
if errorlevel 1 ( echo [INFO] Nothing to commit. & exit /b 0 )

echo.
echo [4/4] Pushing...
git push
if errorlevel 1 ( echo [ERROR] Push failed. & exit /b 1 )
echo.
echo [SUCCESS] Pushed. GitHub Actions will publish to the deploy branch; watch the Actions tab.
pause
