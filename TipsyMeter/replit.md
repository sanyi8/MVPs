# Overview

TipsyCalculator is a mobile-optimized React web application that helps users track their alcohol consumption and estimate their intoxication level in real-time. The app provides a gamified approach to responsible drinking by calculating "tipsy points" based on different types of alcoholic beverages consumed. Users can add drinks (beer, wine, spirits, water, or custom drinks), monitor their progress through a visual progress bar, and access emergency contacts and taxi services when needed.

The application features a modern UI built with shadcn/ui components, real-time calculations, drag-and-drop functionality for drink management, customizable settings for intoxication thresholds, and social sharing capabilities. It's designed as a single-page application focused on simplicity and ease of use during social situations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client is built as a React single-page application using modern patterns:

- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with local component state, no global state management library
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds
- **Package Manager**: npm with lockfile for dependency management

## Backend Architecture

The server follows a RESTful API pattern with Express.js:

- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api` namespace
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling middleware
- **Development**: Vite middleware integration for hot reloading

## Database Design

The application uses a PostgreSQL database with three main entities:

- **Users Table**: Stores user authentication data (id, username, password, created_at)
- **Sessions Table**: Tracks individual drinking sessions (id, user_id, total_points, has_mixed_drinks, created_at)
- **Drinks Table**: Records individual drinks within sessions (id, session_id, type, amount, points, created_at)

The schema uses UUID for session IDs and includes an enum for drink types (beer, wine, spirits, water). Foreign key relationships maintain data integrity between users, sessions, and drinks.

## Data Flow

The application calculates intoxication levels using a points-based system:

- **Beer**: 5 points per deciliter (5dl standard = 25 points)
- **Wine**: 12 points per deciliter (2dl standard = 24 points)  
- **Spirits**: 40 points per deciliter (0.5dl standard = 20 points)
- **Water**: -5 points per deciliter (helps reduce tipsy level)
- **Custom Drinks**: Calculated based on alcohol percentage and volume

Mixed drink sessions receive a 20% point penalty to account for increased intoxication effects. The system uses configurable thresholds (default: 40 points for tipsy, 60 points for drunk) with visual progress indicators.

## Component Architecture

The frontend follows a component-based architecture with clear separation of concerns:

- **Pages**: Minimal routing with Home and NotFound pages
- **Core Components**: TipsyCalculator (main app), DrinkSelector, DrinksList, TipsyResult
- **UI Components**: Reusable shadcn/ui components for consistent design
- **Hooks**: Custom hooks for settings management and toast notifications
- **Utils**: Calculation logic and API client functions

## Deployment Architecture

The application is configured for full-stack deployment:

- **Development**: Vite dev server with Express API proxy
- **Production**: Static client build served by Express with API routes
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: Node.js runtime with ESM modules

# External Dependencies

## Database Services
- **PostgreSQL**: Primary database using CONNECTION_URL environment variable
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with migration support

## UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library
- **React Beautiful DnD**: Drag and drop functionality for drink management

## Development Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Zod**: Schema validation for API requests and responses

## React Ecosystem
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation resolvers
- **Wouter**: Lightweight routing library
- **React DOM**: Core React rendering

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **uuid**: UUID generation for session identifiers
- **clsx**: Conditional class name utility
- **class-variance-authority**: Component variant management

## Replit Integration
- **@replit/vite-plugin-shadcn-theme-json**: Theme configuration integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development debugging tools (conditional)

The application is designed to be self-contained with minimal external API dependencies, focusing on client-side calculations and local data persistence.