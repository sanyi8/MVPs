# FunnelCV - Tailored CV Generation Platform

## Overview

FunnelCV is a Flask-based web application that generates personalized CV summaries and profiles tailored to specific job applications. The platform uses OpenAI's API to create customized content based on user input and stores CV profiles with analytics for tracking HR engagement.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Tailwind CSS for responsive design
- **Mobile-First Design**: Sticky scrolling sections optimized for mobile viewing
- **Progressive Enhancement**: JavaScript for enhanced user interactions and analytics tracking

### Backend Architecture
- **Framework**: Flask (Python 3.11) with SQLAlchemy ORM
- **Database**: PostgreSQL 16 for persistent data storage
- **AI Integration**: OpenAI API for content generation
- **Deployment**: Gunicorn WSGI server with autoscaling deployment target

### Data Storage Solutions
- **Primary Database**: PostgreSQL with SQLAlchemy ORM
- **Models**: 
  - CVProfile: Stores generated CV data with unique slugs
  - CVFeedback: Tracks HR feedback and engagement metrics
  - CVAnalytics: Performance and usage analytics
- **Session Management**: Flask sessions for temporary data

## Key Components

### Core Models
1. **CVProfile**: Manages CV data including name, job, company, summary, skills, and video content
2. **CVFeedback**: Captures HR feedback with detailed ratings and improvement suggestions
3. **CVAnalytics**: Tracks usage patterns and performance metrics

### AI Content Generation
- **OpenAI Integration**: Uses GPT models to generate tailored CV summaries
- **Content Customization**: Adapts content based on job requirements and company context
- **Skills Extraction**: Automatically identifies and highlights relevant skills

### User Experience Features
- **Slug-based URLs**: Clean, shareable URLs for each CV profile
- **Mobile Optimization**: Touch-friendly interface with scroll snap navigation
- **Real-time Feedback**: HR can provide immediate feedback on CV profiles
- **Analytics Tracking**: Detailed viewing time and section engagement metrics

## Data Flow

1. **CV Generation**:
   - User submits job details and personal information
   - OpenAI API generates tailored summary and skills
   - System creates unique slug and stores CV profile
   - User receives shareable CV link

2. **CV Viewing**:
   - HR accesses CV via unique slug
   - System tracks viewing analytics (time spent, sections viewed)
   - Mobile-optimized display with section indicators

3. **Feedback Collection**:
   - HR provides feedback through rating system
   - Detailed feedback stored with improvement suggestions
   - Analytics updated with engagement metrics

## External Dependencies

### Core Dependencies
- **OpenAI API**: For AI-powered content generation
- **PostgreSQL**: Primary database storage
- **Tailwind CSS**: Frontend styling framework
- **Font Awesome**: Icon library for UI elements

### Python Packages
- **Flask**: Web framework and template engine
- **SQLAlchemy**: Database ORM and migrations
- **Gunicorn**: Production WSGI server
- **psycopg2-binary**: PostgreSQL database adapter

### Development Tools
- **Replit**: Development and hosting platform
- **UV**: Package management and dependency resolution

## Deployment Strategy

### Production Environment
- **Platform**: Replit with autoscale deployment
- **Server**: Gunicorn with bind to 0.0.0.0:5000
- **Process Management**: Automatic restart on code changes
- **Port Configuration**: Internal port 5000, external port 80

### Environment Configuration
- **Secrets Management**: Environment variables for API keys and database URLs
- **Database**: PostgreSQL 16 with connection pooling
- **Logging**: Structured logging for debugging and monitoring

### Scalability Considerations
- **Database Connection Pooling**: Configured for high availability
- **Session Management**: Stateless design for horizontal scaling
- **Static Assets**: CDN delivery for CSS and JavaScript libraries

## Changelog
```
Changelog:
- June 18, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```