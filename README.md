# 🚗 CarsiqAi

> AI-Powered Car Maintenance Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-FF5722)](https://carsiqai.vercel.app/)

CarsiqAi is an intelligent car maintenance assistant that provides accurate recommendations for engine oil, filters, and general car maintenance. Built with Next.js, TypeScript, and powered by AI.

## ✨ Features

- 🤖 **AI-Powered Chat** - Natural language interface for car maintenance queries
- 🛢️ **Oil Recommendations** - Accurate engine oil specifications
- 🔧 **Verified Filter Database** - Denckermann-certified filter numbers
- 🌍 **Multi-language** - Full Arabic and English support
- 📱 **Mobile Apps** - Native iOS and Android applications
- 📊 **Admin Dashboard** - Manage products, corrections, and analytics
- ⚡ **Real-time** - Fast responses with caching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/pnpm/yarn
- Supabase account (or PostgreSQL)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/carsiqai.git
cd carsiqai

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [📖 Project Overview](docs/PROJECT_OVERVIEW.md)
- [🏗️ Architecture](docs/ARCHITECTURE.md)
- [⚙️ Setup Guide](docs/SETUP.md)
- [📡 API Documentation](docs/API.md)
- [📱 Mobile App](flutter_app/README.md)

## 🏗️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend**
- Next.js API Routes
- Prisma ORM
- Supabase (PostgreSQL)
- OpenRouter (AI)

**Mobile**
- Flutter
- iOS & Android

## 📁 Project Structure

```
carsiqai/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── services/         # Business logic
├── utils/            # Utility functions
├── data/             # Static data (filters, oils)
├── db/               # Database clients
├── prisma/           # Database schema
├── docs/             # Documentation
├── flutter_app/      # Mobile app
└── public/           # Static assets
```

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint

# Type check
npm run type-check

# Database operations
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

## 🌐 Environment Variables

See [.env.example](.env.example) for required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `OPENROUTER_API_KEY` - AI service API key
- `BRAVE_SEARCH_API_KEY` - Search API key

## 📱 Mobile App

The Flutter mobile app is located in `flutter_app/`.

```bash
cd flutter_app
flutter pub get
flutter run
```

See [Mobile App Documentation](flutter_app/README.md) for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Denckermann](https://www.denckermann.com/) for verified filter data
- [OpenRouter](https://openrouter.ai/) for AI services
- [Supabase](https://supabase.com/) for database and auth
- [shadcn/ui](https://ui.shadcn.com/) for UI components

## 📞 Support

- 📧 Email: support@carsiqai.com
- 🌐 Website: [carsiqai.vercel.app](https://carsiqai.vercel.app)
- 📖 Docs: [/docs](docs/)

## 🗺️ Roadmap

- [ ] Air filter integration
- [ ] Maintenance schedules
- [ ] Service center locator
- [ ] Price comparisons
- [ ] User accounts
- [ ] Push notifications

---

Made with ❤️ by the CarsiqAi Team
