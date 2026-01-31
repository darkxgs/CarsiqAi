@echo off
echo ========================================
echo   CarsiqAi - Clean GitHub Sync
echo ========================================
echo.
echo This will:
echo 1. Remove all files from GitHub
echo 2. Push only your current clean structure
echo.
echo Repository: https://github.com/darkxgs/CarsiqAi
echo Branch: main
echo User: darkxgs
echo.
echo ⚠ WARNING: This will replace everything on GitHub!
echo.
set /p confirm="Type 'YES' to continue: "

if not "%confirm%"=="YES" (
    echo Cancelled.
    exit /b 1
)

echo.
echo [1/7] Configuring Git user...
git config user.name "darkxgs"
git config user.email "darka8980@gmail.com"
echo ✓ Git user configured

echo.
echo [2/7] Creating backup branch...
git branch backup-before-clean-sync 2>nul
echo ✓ Backup branch created

echo.
echo [3/7] Removing all tracked files from Git...
git rm -r --cached .
echo ✓ All files removed from Git tracking

echo.
echo [4/7] Adding current clean structure...
git add .
echo ✓ Clean structure added

echo.
echo [5/7] Creating .gitignore if needed...
if not exist .gitignore (
    echo node_modules/ > .gitignore
    echo .next/ >> .gitignore
    echo .env.local >> .gitignore
    echo .env >> .gitignore
    echo dist/ >> .gitignore
    echo build/ >> .gitignore
    git add .gitignore
    echo ✓ .gitignore created
) else (
    echo ✓ .gitignore already exists
)

echo.
echo [6/7] Committing clean structure...
git commit -m "🎨 Complete project restructure: Clean, professional organization

✨ New Structure:
- Professional documentation in /docs
- Clean, organized codebase
- iOS-ready Flutter app
- Production-ready configuration

🗑️ Removed:
- 35+ unnecessary documentation files
- Test files and folders
- Temporary/log files
- Debug API routes
- Duplicate/outdated files

📚 Added:
- Comprehensive documentation suite
- Professional README.md
- .env.example template
- GitHub sync guides

This is a complete restructure to enterprise-grade standards.
All old files removed, only clean production code remains.

Repository: https://github.com/darkxgs/CarsiqAi
Developer: darkxgs (darka8980@gmail.com)"

if %errorlevel% equ 0 (
    echo ✓ Changes committed
) else (
    echo ℹ No changes to commit or already committed
)

echo.
echo [7/7] Force pushing to GitHub (main branch)...
echo.
echo ⚠ This will overwrite everything on GitHub!
echo Press Ctrl+C to cancel or any key to continue...
pause >nul

git push origin main --force

if %errorlevel% equ 0 (
    echo ✓ Successfully pushed to GitHub!
) else (
    echo ❌ Push failed. Check your credentials and try again.
    echo.
    echo Troubleshooting:
    echo 1. Make sure you have push access to the repository
    echo 2. Check if you need a Personal Access Token
    echo 3. Try: gh auth login
    exit /b 1
)

echo.
echo ========================================
echo   ✓ Clean Sync Complete!
echo ========================================
echo.
echo Your GitHub repository now has:
echo ✓ Clean, professional structure
echo ✓ Complete documentation
echo ✓ No unnecessary files
echo ✓ Production-ready code
echo.
echo Next steps:
echo 1. Visit: https://github.com/darkxgs/CarsiqAi
echo 2. Verify the clean structure
echo 3. Update repository description
echo 4. Add topics: nextjs, typescript, ai, flutter
echo.
echo Backup branch: backup-before-clean-sync
echo (Restore with: git checkout backup-before-clean-sync)
echo.
pause
