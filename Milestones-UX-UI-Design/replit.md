# Professional Timeline Application

## Overview

This is a client-side professional timeline application showcasing career progression through an interactive horizontal timeline interface. The application displays professional milestones with smooth scrolling, touch/swipe support, and responsive design. It includes a backend infrastructure ready for database integration using Drizzle ORM with PostgreSQL.

## System Architecture

### Frontend Architecture
- **Static HTML/CSS/JavaScript**: Pure vanilla JavaScript implementation with no frameworks
- **Interactive Timeline**: Horizontal scrolling timeline with touch/swipe gestures
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Embedded Support**: Includes standalone embeddable version (`timeline-embed.html`)

### Backend Architecture
- **Node.js HTTP Server**: Custom HTTP server for API endpoints
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Storage Abstraction**: Interface-based storage layer for timeline items and users
- **RESTful API**: CRUD operations for timeline management

### Data Storage
- **PostgreSQL Database**: Using Neon serverless database
- **Drizzle ORM**: Type-safe database operations
- **Schema Definition**: Shared TypeScript schema for timeline items and users

## Key Components

### Frontend Components
1. **TimelineController**: Main JavaScript class handling timeline interactions
   - Scroll and swipe gesture management
   - Animation and momentum calculations
   - Navigation button controls
   - Responsive behavior

2. **Timeline Items**: Individual career milestones with:
   - Year indicators
   - Job titles and organizations
   - Detailed descriptions and skills
   - Interactive hover effects

3. **Navigation**: 
   - Left/right scroll buttons
   - Touch/swipe gesture support
   - Smooth scrolling animations

### Backend Components
1. **API Server** (`server/api.ts`):
   - GET /api/timeline - Retrieve all timeline items
   - POST /api/timeline - Create new timeline item
   - GET /api/timeline/:id - Get specific timeline item
   - CRUD operations with CORS support

2. **Database Layer** (`server/db.ts`):
   - Neon PostgreSQL connection
   - Drizzle ORM configuration
   - WebSocket support for serverless functions

3. **Storage Interface** (`server/storage.ts`):
   - Abstract storage interface (IStorage)
   - DatabaseStorage implementation
   - Timeline item and user management

### Database Schema
- **timeline_items**: Core timeline data (year, title, organization, description, skills)
- **users**: User management (username, email)
- **Relations**: One-to-many relationship between users and timeline items

## Data Flow

1. **Static Content**: HTML/CSS/JS served via Python HTTP server
2. **Dynamic Data**: API calls to Node.js backend for timeline data
3. **Database Operations**: Drizzle ORM queries to PostgreSQL
4. **Frontend Updates**: JavaScript dynamically updates timeline display

## External Dependencies

### npm Dependencies
- `@neondatabase/serverless`: Neon PostgreSQL client
- `drizzle-orm`: Type-safe ORM
- `drizzle-kit`: Database migration toolkit
- `ws`: WebSocket support for Neon
- `@types/ws`: TypeScript definitions

### Runtime Environment
- Node.js 20
- Python 3.11 (for static file serving)
- PostgreSQL 16

## Deployment Strategy

### Current Setup
- **Static Serving**: Python HTTP server on port 5000
- **Development**: Replit environment with parallel workflows
- **Database**: Neon serverless PostgreSQL

### Production Considerations
- Backend API server needs to be started separately
- Environment variables required for DATABASE_URL
- Static assets could be served via CDN
- Database migrations via Drizzle Kit

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **June 13, 2025**: Created minified WordPress embed version with:
  - Fixed popup layering system (z-index 5000 base, 100000 on hover)
  - Smart popup boundary detection and positioning
  - Compact navigation buttons (< >) for enhanced usability
  - Mobile-optimized popup sizing (240px vs 280px desktop)
  - Complete code minification for fastest loading

## Changelog

- June 13, 2025: Initial setup and complete WordPress embed implementation