# Development Setup Guide

## 📋 Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or pnpm/yarn)
- **Git**: Latest version
- **Code Editor**: VS Code (recommended)

### Optional Tools
- **Docker**: For local database (optional)
- **Postman**: For API testing
- **Flutter SDK**: For mobile app development

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/carsiqai.git
cd carsiqai
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_supabase_database_url"
DIRECT_URL="your_supabase_direct_url"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# AI Services
OPENROUTER_API_KEY="your_openrouter_api_key"

# Search Services
BRAVE_SEARCH_API_KEY="your_brave_search_api_key"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_secure_password"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and keys to `.env.local`
3. Run migrations:

```bash
npx prisma migrate dev
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:

```bash
createdb carsiqai
```

3. Update `DATABASE_URL` in `.env.local`
4. Run migrations:

```bash
npx prisma migrate dev
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

This will populate the database with:
- Sample car data
- Oil products
- Filter database

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development Tools

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 📦 Project Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Database
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## 🗂️ Project Structure

```
carsiqai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── chat/              # Chat page
│   ├── admin/             # Admin dashboard
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components (shadcn)
│   ├── chat/             # Chat components
│   └── admin/            # Admin components
├── services/              # Business logic
├── utils/                 # Utility functions
├── types/                 # TypeScript types
├── data/                  # Static data
├── db/                    # Database clients
├── prisma/                # Prisma schema
├── public/                # Static assets
├── styles/                # Global styles
├── docs/                  # Documentation
└── flutter_app/           # Mobile app

```

## 🔧 Configuration Files

### TypeScript Configuration

`tsconfig.json` is already configured with:
- Path aliases (`@/`)
- Strict mode enabled
- Next.js optimizations

### Tailwind Configuration

`tailwind.config.ts` includes:
- Custom colors
- shadcn/ui integration
- Dark mode support

### Next.js Configuration

`next.config.mjs` includes:
- Image optimization
- Environment variables
- Build optimizations

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

#### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

### Environment Variables Not Loading

1. Ensure `.env.local` exists in root directory
2. Restart development server
3. Check for typos in variable names
4. Verify no trailing spaces

### Prisma Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset and reseed database
npx prisma migrate reset
npm run seed
```

## 🧪 Testing Setup

### Install Testing Dependencies

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### Create Test Configuration

`jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

## 📱 Mobile App Setup

### Flutter Development

1. Install Flutter SDK
2. Navigate to flutter_app directory:

```bash
cd flutter_app
flutter pub get
```

3. Run on device:

```bash
# iOS
flutter run -d ios

# Android
flutter run -d android
```

See [flutter_app/README.md](../flutter_app/README.md) for detailed instructions.

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use strong passwords** for admin accounts
3. **Rotate API keys** regularly
4. **Enable 2FA** on Supabase and other services
5. **Review Supabase RLS policies** before production

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🆘 Getting Help

- Check [Documentation](./README.md)
- Review [Architecture](./ARCHITECTURE.md)
- Search [GitHub Issues](https://github.com/yourusername/carsiqai/issues)
- Contact: support@carsiqai.com

---

**Last Updated**: January 2026  
**Version**: 1.0.0
