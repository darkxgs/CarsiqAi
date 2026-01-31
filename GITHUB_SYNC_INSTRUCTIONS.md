# GitHub Sync Instructions

## Quick Start

### Option 1: Run the Automated Script (Recommended)
Simply double-click `clean-sync-github.bat` and follow the prompts.

### Option 2: Manual Commands
If you prefer to run commands manually:

```bash
# 1. Configure Git
git config user.name "darkxgs"
git config user.email "darka8980@gmail.com"

# 2. Add remote (if not already added)
git remote add origin https://github.com/darkxgs/CarsiqAi.git

# 3. Switch to main branch
git branch -M main

# 4. Create backup
git branch backup-before-clean-sync

# 5. Remove all tracked files
git rm -r --cached .

# 6. Add all current files
git add .

# 7. Commit
git commit -m "Complete project restructure"

# 8. Force push to GitHub
git push origin main --force
```

## What the Script Does

1. **Configures Git** with your credentials
2. **Adds remote repository** if not already configured
3. **Switches to main branch** (from master if needed)
4. **Creates backup branch** for safety
5. **Removes all tracked files** from Git
6. **Adds current clean structure** 
7. **Commits changes** with detailed message
8. **Force pushes to GitHub** (overwrites remote)
9. **Verifies** the push was successful

## Important Notes

### Authentication
You'll need to authenticate with GitHub. Options:

1. **Personal Access Token (Recommended)**
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scopes: `repo` (full control)
   - Use token as password when prompted

2. **GitHub CLI**
   ```bash
   gh auth login
   ```

3. **SSH Keys**
   ```bash
   ssh-keygen -t ed25519 -C "darka8980@gmail.com"
   # Add key to GitHub: https://github.com/settings/keys
   ```

### Protected Files
These files are automatically excluded (via `.gitignore`):
- `.env` and `.env*.local`
- `node_modules/`
- `.next/` and `/out/`
- `*.tsbuildinfo`
- Build artifacts

### Safety Features
- Creates `backup-before-clean-sync` branch before any changes
- Requires typing "YES" to confirm
- Shows clear progress at each step
- Provides troubleshooting tips if push fails

## Troubleshooting

### "Permission denied" or "Authentication failed"
- You need a Personal Access Token (see Authentication section)
- Or set up SSH keys

### "Remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/darkxgs/CarsiqAi.git
```

### "Nothing to commit"
This is normal if you've already committed. The script will continue to push.

### Restore from Backup
If something goes wrong:
```bash
git checkout backup-before-clean-sync
git branch -M main
```

## After Successful Push

1. Visit: https://github.com/darkxgs/CarsiqAi
2. Verify the structure looks correct
3. Update repository description
4. Add topics: `nextjs`, `typescript`, `ai`, `flutter`, `automotive`
5. Update README if needed

## Repository Information

- **URL**: https://github.com/darkxgs/CarsiqAi
- **Owner**: darkxgs
- **Email**: darka8980@gmail.com
- **Branch**: main
- **Backup Branch**: backup-before-clean-sync

---

**Ready to sync?** Run `clean-sync-github.bat` now!
