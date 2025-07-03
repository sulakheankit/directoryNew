# Customer Profile Management System

## Project Overview
A sophisticated React-based Customer Profile Management System that delivers comprehensive customer insights through advanced data processing and interactive visualization. The application provides a complete solution for managing customer contacts, analyzing survey data, tracking activities, and generating AI-powered insights.

## Key Features
- **Contact Directory**: CSV/JSON import with drag-and-drop functionality
- **Customer Profiles**: Detailed individual contact views with comprehensive data
- **Activity Timeline**: Chronological activity tracking with filtering
- **Survey Management**: Multi-channel survey history with detailed analytics
- **NLP Insights**: Sentiment analysis, theme extraction, and word clouds
- **Communication Metrics**: Email read rates and response rate calculations
- **Time-based Filtering**: Comprehensive filtering across all data types
- **Simple Tab Interface**: Clean, underlined navigation design

## Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend**: Express.js + TypeScript
- **Data Management**: TanStack Query + In-memory storage
- **Visualization**: Recharts for charts and data visualization
- **File Processing**: CSV/JSON import with validation

## Architecture
- **Monolithic Structure**: Single application with frontend/backend integration
- **Component-based UI**: Reusable React components with TypeScript
- **Memory Storage**: In-memory data storage with JSON/CSV import capabilities
- **RESTful API**: Express routes for data operations
- **Responsive Design**: Full-width layout optimized for desktop use

## Recent Changes
- **January 7, 2025**: Created comprehensive specifications document (SPECIFICATIONS.md)
- **January 3, 2025**: Updated communication metrics to use authentic survey status data
- **January 3, 2025**: Implemented contact-specific dropdowns in Survey History
- **January 3, 2025**: Hidden Activity and Survey IDs from all user interfaces
- **January 3, 2025**: Simplified tab navigation to match clean underlined design
- **December 2024**: Implemented time filtering across all profile sections
- **December 2024**: Added CSV import functionality with comprehensive data processing

## User Preferences
- **Design Style**: Black and white monochrome UI with clean, minimal interface
- **Layout**: Full-width design without excessive margins
- **Navigation**: Simple underlined tabs instead of complex tab components
- **Data Display**: Hide internal system IDs, show only business-relevant information
- **Communication Metrics**: Calculate from real survey data with specific status criteria

## Project Goals
- Provide comprehensive customer insight through data visualization
- Support efficient contact management and interaction tracking
- Enable data-driven decision making through metrics and analytics
- Maintain clean, professional interface design
- Ensure accurate calculations based on real survey interaction data

## Development Guidelines
- Follow full-stack JavaScript architecture patterns
- Use TypeScript for type safety across frontend and backend
- Implement responsive design with Tailwind CSS
- Maintain component reusability and clean code structure
- Use authentic data processing instead of mock data
- Document major architectural changes and user preferences

## File Structure
```
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── lib/           # Utility functions and configurations
│   └── hooks/         # Custom React hooks
├── server/            # Express backend
├── shared/            # Shared TypeScript schemas
└── SPECIFICATIONS.md  # Comprehensive feature documentation
```

## Key Components
- **CustomerDirectory**: Main contact table with import functionality
- **CustomerProfile**: Detailed contact view with tabbed interface
- **ActivityTimeline**: Chronological activity display
- **SurveyHistory**: Survey interaction management
- **NLPInsights**: AI-powered sentiment and theme analysis
- **TimeFilter**: Date range filtering component

## Data Models
- **Contact**: Customer profile with directory fields
- **Activity**: Business interactions and events
- **Survey**: Multi-channel communication tracking
- **Note**: Customer interaction notes

## Current Status
The application is fully functional with comprehensive customer profile management capabilities. All core features are implemented including CSV import, contact profiles, activity tracking, survey management, and NLP insights. The interface uses a clean, professional design with accurate metric calculations from real survey data.