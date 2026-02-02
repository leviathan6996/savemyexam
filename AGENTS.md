# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SaveMyIGCSE is a full-stack educational platform replicating SaveMyExams functionality. It's a MERN stack application (MongoDB, Express, React/Next.js, Node.js) with TypeScript throughout, designed to provide revision notes, practice questions, past papers, video lessons, progress tracking, and subscription management for IGCSE students.

## Architecture

### Monorepo Structure
- **`client/`**: Next.js 15+ frontend with App Router, TypeScript, and Tailwind CSS
- **`server/`**: Express.js backend API with TypeScript, Mongoose ODM, JWT auth
- **`shared/types/`**: Common TypeScript interfaces shared between frontend and backend

### Backend Architecture (server/src/)
```
controllers/    # Request handlers for API endpoints
models/         # Mongoose schemas (User, Subject, Question, etc.)
routes/         # Express route definitions
middleware/     # Auth, validation, error handling
services/       # Business logic layer
utils/          # Helper functions
config/         # Environment configuration and database setup
types/          # Backend-specific TypeScript types
```

### Data Model Hierarchy
The application follows a hierarchical content structure:
- **Subject** (e.g., Mathematics, Physics) → identified by exam board
- **Course** → belongs to a Subject, has level and year
- **Topic** → belongs to a Course, can have parent topics for nesting
- **Content** (Notes, Questions, Videos, Flashcards) → belongs to Topics

All content is tagged with:
- `ExamBoard` enum (IGCSE_CIE, IGCSE_EDEXCEL, GCSE_AQA, A_LEVEL_CIE, etc.)
- `Difficulty` enum (easy, medium, hard)
- Additional metadata (tags, year, session)

### Authentication & Authorization
- JWT-based authentication with access + refresh tokens (15m / 7d expiry)
- User roles: `student`, `teacher`, `admin` (defined in UserRole enum)
- Password hashing via bcrypt in User model pre-save hook
- Subscription model: `free` vs `premium` plans with Stripe integration

### Environment Configuration
Server configuration is centralized in `server/src/config/index.ts`:
- MongoDB URI and test URI
- Redis connection (for caching and sessions)
- JWT secrets and expiry times
- SMTP settings for email
- AWS S3 credentials for file uploads
- Stripe keys for payments
- Frontend URL for CORS
- Rate limiting parameters

Copy `server/.env.example` to `server/.env` and configure before running.

## Development Commands

### Backend (from `server/` directory)
```bash
npm install              # Install dependencies
npm run dev             # Start development server with nodemon + ts-node
npm run build           # Compile TypeScript to dist/
npm start               # Run production build
npm run lint            # Run ESLint
npm test                # Run Jest tests with coverage
```

### Frontend (from `client/` directory)
```bash
npm install              # Install dependencies
npm run dev             # Start Next.js dev server (port 3000)
npm run build           # Build for production
npm start               # Run production build
npm run lint            # Run ESLint
```

### Docker Development
```bash
docker-compose up       # Start MongoDB, Redis, server, and client
docker-compose down     # Stop all services
```

The docker-compose setup includes:
- MongoDB on port 27017
- Redis on port 6379
- Backend server on port 5000
- Frontend client on port 3000

## Key Implementation Patterns

### Shared Types Pattern
All interfaces and enums in `shared/types/index.ts` are imported by both client and server using path aliases:
- Server: `@shared/types` (via tsconfig paths)
- Client: Import directly or via alias

This ensures type safety across the full stack. When adding new features, update shared types first.

### Mongoose Model Pattern
Models extend Document and define an interface (e.g., `IUserDocument`). Key patterns:
- Use Schema.Types.ObjectId for references with `ref` property
- Add indexes for frequently queried fields
- Use pre-save hooks for password hashing, data validation
- Override `toJSON()` to exclude sensitive fields from API responses
- Enums from shared types are used in schema definitions via `Object.values()`

### API Versioning
All API routes are prefixed with `/api/v1`. The version is configured via `API_VERSION` environment variable in `config/index.ts`.

### Error Handling
Global error handler in `server/src/server.ts` catches all errors. Development mode includes stack traces. Use custom error classes with `statusCode` property for HTTP-specific errors.

## TypeScript Configuration

### Server tsconfig.json
- Target: ES2022, module: commonjs
- Strict mode enabled with additional checks (noUnusedLocals, noImplicitReturns)
- Path aliases: `@/*` → `src/*`, `@shared/*` → `../shared/*`
- Use `tsconfig-paths` package to resolve paths at runtime with ts-node

### Development with ts-node
The server uses `ts-node` with `tsconfig-paths/register` (configured in nodemon.json) to run TypeScript directly without compilation during development.

## Database Considerations

### MongoDB Connection
- Managed in `server/src/config/database.ts`
- Automatic reconnection handling
- Graceful shutdown on SIGINT
- Separate test database URI for testing

### Mongoose Indexes
Critical indexes are defined in model schemas. When adding new query patterns, add corresponding indexes to prevent slow queries at scale.

## API Endpoint Structure (Planned)
Following RESTful conventions with standardized response format:
```typescript
// Success response
{ success: true, data: {...} }

// Error response
{ success: false, error: "message" }

// Paginated response
{ success: true, data: [...], pagination: { page, limit, total, totalPages } }
```

All endpoints will be versioned under `/api/v1/`.

## Testing Strategy
- Backend: Jest + Supertest for API integration tests
- Frontend: React Testing Library + Jest for component tests
- Use separate MongoDB test database (`MONGODB_TEST_URI`)

## File Upload Pattern
Will use Multer middleware for handling multipart/form-data, with uploads stored:
- Temporarily in `server/uploads/` directory
- Permanently in AWS S3 (or Cloudflare R2)
- PDF files for past papers, images for avatars, videos for lessons
