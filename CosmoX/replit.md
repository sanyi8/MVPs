# Zodiac Profile Generator

## Overview

This is a full-stack web application that generates comprehensive zodiac profiles based on user birth data. The app combines multiple astrological traditions (Western, Chinese, Vedic, Mayan, and Celtic) to create unified personality insights. Built with a modern React frontend and Express backend, it features a cosmic-themed UI with mobile-first design principles.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom cosmic theme colors and shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth UI transitions
- **Storage**: localStorage for user profiles, zodiac data, and API keys (development)

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (currently using in-memory storage as fallback)
- **Validation**: Zod schemas shared between frontend and backend
- **API**: RESTful endpoints for profile management and zodiac calculations

### Key Components

#### Data Storage
- **Database**: Configured for PostgreSQL via Neon serverless
- **ORM**: Drizzle with type-safe schema definitions
- **Migrations**: Managed through drizzle-kit
- **Fallback**: In-memory storage implementation for development

#### Authentication & Sessions
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage
- **Current State**: No authentication implemented (profiles stored locally)

#### UI Components
- **Design System**: shadcn/ui components with custom cosmic theme
- **Responsive Design**: Mobile-first approach with bottom navigation
- **Interactive Elements**: 
  - 6-system zodiac carousel with navigation pills
  - Modal dialogs for profile creation and match details
  - Toggleable zodiac system cards
  - Social share buttons (Facebook, X, TikTok)
  - Invite link generation and copying
- **Accessibility**: Built-in support through Radix UI primitives
- **API Integration**: User-configurable API keys for Gemini AI, Claude AI, and ChatGPT

## Data Flow

1. **Profile Creation**: User provides birth date/time → Form validation → API creates profile → Zodiac calculation
2. **Zodiac Generation**: Birth data → Six zodiac systems calculated (Western, Chinese, Vedic, Mayan, Celtic, Arabic) → Unified profile response
3. **Arabic Calculation**: Birth date (DD/MM/YYYY) → UTC-based day-of-year → Tropical longitude (0° Aries = March 21) → Mansion index (360°/28 = 12°51'26" per mansion)
4. **Local Storage**: Profiles, zodiac data, match people, and API keys cached in localStorage for persistence
5. **State Management**: TanStack Query handles API calls and caching
6. **Social Sharing**: Profile data → Generate shareable text → Platform-specific share URLs or clipboard copy

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, TypeScript)
- Vite for development and build tooling
- Express for backend server

### Database & ORM
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL driver
- connect-pg-simple for session management

### UI & Styling
- Tailwind CSS for utility-first styling
- shadcn/ui component library
- Radix UI primitives for accessibility
- Framer Motion for animations
- Lucide React for icons

### Form & Validation
- React Hook Form for form state management
- Zod for schema validation (shared across frontend/backend)
- @hookform/resolvers for Zod integration

### Development Tools
- tsx for TypeScript execution
- esbuild for production builds
- Replit-specific plugins for development environment

## Deployment Strategy

### Development
- **Server**: tsx with hot reloading for TypeScript files
- **Client**: Vite dev server with HMR
- **Database**: Configured for Neon PostgreSQL with fallback to memory storage

### Production
- **Build Process**: Vite builds client assets, esbuild bundles server
- **Server Bundle**: Single ESM file with external packages
- **Static Assets**: Served from dist/public directory
- **Environment**: NODE_ENV=production with optimized builds

### Database Management
- **Schema**: Managed through Drizzle migrations
- **Connection**: Environment variable DATABASE_URL required
- **Deployment**: `db:push` command for schema updates

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
- July 1, 2025. Added PostgreSQL database integration, fixed zodiac calculation bugs
- July 6, 2025. Completed full app navigation structure with functional Match page (person addition, compatibility scoring, detailed insights), interactive Daily page with energy charts and moon phase tracking, and proper profile saving system
- October 22, 2025. Major feature release:
  * Added Medieval Arabic Astrology as 6th zodiac system (28 Lunar Mansions - Al Manazil al-Qamar)
  * Implemented UTC-based astronomical calculation for accurate mansion assignments across all timezones
  * Added API Keys management for AI providers (Gemini Flash 2.5, Claude AI, ChatGPT GPT-5 Nano)
  * Integrated social share buttons (Facebook, X/Twitter, TikTok) on home page
  * Added friend invite functionality on Match page with shareable compatibility links
  * Added developer attribution (sandorkardos.com) in Settings
  * All zodiac systems now display in carousel with proper navigation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```