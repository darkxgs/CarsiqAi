# System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  iOS App (Flutter)  │  Android App    │
└──────────────┬──────────────────┬──────────────────┬────────┘
               │                  │                  │
               └──────────────────┼──────────────────┘
                                  │
                         ┌────────▼────────┐
                         │   API Gateway   │
                         │  (Next.js API)  │
                         └────────┬────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
         ┌──────▼──────┐   ┌─────▼─────┐   ┌──────▼──────┐
         │   Services   │   │  Database │   │  External   │
         │   Layer      │   │ (Supabase)│   │    APIs     │
         └──────────────┘   └───────────┘   └─────────────┘
```

## 🏛️ Application Layers

### 1. Presentation Layer
**Location**: `/app`, `/components`

- **Pages**: Next.js App Router pages
- **Components**: Reusable UI components
- **Layouts**: Shared layouts and templates
- **Styles**: Global and component styles

**Key Files**:
- `app/page.tsx` - Landing page
- `app/chat/page.tsx` - Chat interface
- `app/admin/page.tsx` - Admin dashboard
- `components/chat/ChatPage.tsx` - Main chat component

### 2. API Layer
**Location**: `/app/api`

RESTful API endpoints built with Next.js API Routes.

**Endpoints**:
```
/api/chat                 - AI chat interface
/api/car                  - Car information lookup
/api/oil-recommendation   - Oil recommendations
/api/oil-products         - Oil product management
/api/corrections          - User corrections
/api/admin/*              - Admin operations
/api/metrics              - Analytics and metrics
```

### 3. Business Logic Layer
**Location**: `/services`, `/utils`

Core business logic and utilities.

**Services**:
- `oilRecommendationService.ts` - Oil recommendation logic
- `filterRecommendationService.ts` - Filter lookup
- `intelligentOilRecommendationService.ts` - AI-powered recommendations
- `oilProductService.ts` - Product management
- `unifiedSearchService.ts` - Search aggregation

**Utilities**:
- `carAnalyzer.ts` - Car data analysis
- `vinEngineResolver.ts` - VIN decoding
- `logger.ts` - Logging utility

### 4. Data Layer
**Location**: `/data`, `/db`, `/prisma`

Data models, schemas, and database access.

**Components**:
- `data/denckermann-filters.ts` - Filter database
- `data/authorizedOils.ts` - Oil specifications
- `db/supabase.ts` - Supabase client
- `prisma/schema.prisma` - Database schema

### 5. Type Definitions
**Location**: `/types`

TypeScript type definitions for type safety.

**Files**:
- `types/chat.ts` - Chat-related types
- `types/jspdf-autotable.d.ts` - PDF generation types

## 🔄 Data Flow

### Chat Request Flow
```
1. User Input (Web/Mobile)
   ↓
2. ChatInput Component
   ↓
3. POST /api/chat
   ↓
4. Request Validation
   ↓
5. Car Analysis (carAnalyzer)
   ↓
6. Service Layer
   ├─ Oil Recommendation Service
   ├─ Filter Recommendation Service
   └─ AI Service (OpenRouter)
   ↓
7. Database Query (Supabase)
   ↓
8. Response Formatting
   ↓
9. Return to Client
   ↓
10. Display in ChatMessages
```

### Oil Recommendation Flow
```
User Query → Car Detection → Engine Analysis → Oil Specs Lookup
                                                      ↓
                                              Filter Lookup
                                                      ↓
                                              AI Enhancement
                                                      ↓
                                              Response Generation
```

## 🗄️ Database Schema

### Core Tables

**cars**
- Vehicle information and specifications
- Engine details
- Oil capacity and type

**oil_products**
- Product catalog
- Brand information
- Specifications and pricing

**corrections**
- User-submitted corrections
- Verification status
- Admin review

**analytics**
- User interactions
- Query logs
- Performance metrics

**chat_sessions**
- Session management
- Message history
- User preferences

## 🔌 External Integrations

### AI Services
- **OpenRouter**: LLM API for chat responses
- **Multiple Models**: GPT-4, Claude, etc.

### Search Services
- **Brave Search**: Real-time web search
- **CarQuery API**: Vehicle specifications

### Database
- **Supabase**: PostgreSQL database
- **Real-time subscriptions**
- **Row Level Security**

## 🏗️ Component Architecture

### Atomic Design Pattern

```
Atoms (Basic UI elements)
  ↓
Molecules (Simple components)
  ↓
Organisms (Complex components)
  ↓
Templates (Page layouts)
  ↓
Pages (Complete pages)
```

**Example**:
- Atom: `Button`, `Input`
- Molecule: `ChatInput`, `QuickActions`
- Organism: `ChatMessages`, `ChatSidebar`
- Template: `ChatLayout`
- Page: `ChatPage`

## 🔐 Security Architecture

### Authentication Flow
```
User Login → Supabase Auth → JWT Token → API Requests
                                              ↓
                                        Token Validation
                                              ↓
                                        RLS Policies
                                              ↓
                                        Data Access
```

### Security Layers
1. **Client-side**: Input validation
2. **API Layer**: Request validation, rate limiting
3. **Database**: Row Level Security (RLS)
4. **Environment**: Secure credential storage

## 📱 Mobile Architecture

### Flutter App Structure
```
lib/
├── main.dart              # App entry point
├── screens/               # Screen widgets
│   └── webview_screen.dart
├── services/              # Business logic
├── models/                # Data models
└── utils/                 # Utilities
```

### WebView Integration
- Native wrapper around web app
- Pull-to-refresh functionality
- Offline detection
- Native splash screen

## 🚀 Deployment Architecture

### Production Environment
```
┌─────────────────┐
│   Vercel CDN    │  ← Static assets
└────────┬────────┘
         │
┌────────▼────────┐
│  Next.js App    │  ← Application server
│   (Vercel)      │
└────────┬────────┘
         │
┌────────▼────────┐
│   Supabase      │  ← Database & Auth
│  (PostgreSQL)   │
└─────────────────┘
```

### CI/CD Pipeline
```
Git Push → GitHub → Vercel Build → Deploy → Production
                         ↓
                    Run Tests
                         ↓
                    Type Check
                         ↓
                    Lint Check
```

## 📊 Performance Optimization

### Caching Strategy
- **Static Assets**: CDN caching
- **API Responses**: In-memory caching
- **Database Queries**: Query optimization
- **Images**: Next.js Image optimization

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports

### Database Optimization
- Indexed columns
- Query optimization
- Connection pooling

## 🔍 Monitoring & Logging

### Metrics Tracked
- API response times
- Error rates
- User engagement
- Database performance
- Cache hit rates

### Logging Levels
- **ERROR**: Critical issues
- **WARN**: Potential problems
- **INFO**: General information
- **DEBUG**: Detailed debugging

## 🔄 State Management

### Client State
- React Hooks (useState, useEffect)
- Context API for global state
- Local storage for persistence

### Server State
- Supabase real-time subscriptions
- API polling for updates
- Optimistic UI updates

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- CDN for static assets

### Vertical Scaling
- Database optimization
- Query caching
- Code optimization

### Future Considerations
- Microservices architecture
- Message queue (Redis)
- Load balancing
- Database sharding

---

**Last Updated**: January 2026  
**Version**: 1.0.0
