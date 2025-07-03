# Customer Profile Management System - Specifications

## Table of Contents
1. [System Overview](#system-overview)
2. [Application Flow](#application-flow)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [User Interface Design](#user-interface-design)
6. [Data Models](#data-models)
7. [API Endpoints](#api-endpoints)
8. [Feature Specifications](#feature-specifications)

## System Overview

The Customer Profile Management System is a sophisticated React-based application designed to provide comprehensive customer insights through intelligent data processing and interactive visualization. The system enables businesses to manage customer contacts, analyze survey data, track activities, and generate NLP-powered insights.

### Key Technologies
- **Frontend**: React 18 with TypeScript
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Data Storage**: In-memory storage with JSON/CSV import support
- **Natural Language Processing**: Sentiment analysis and theme extraction
- **Charts**: Recharts for data visualization

## Application Flow

### 1. Entry Point - Customer Directory
```
User Access → Customer Directory → View Contacts Table → Select Contact → Profile View
                      ↓
                 Import CSV/JSON → Process Data → Update Directory
```

### 2. Customer Profile Workflow
```
Profile Page → Contact Info Sidebar → Main Content Tabs
                      ↓                      ↓
              Profile Summary Cards    Activity Timeline
              Communication Metrics   Survey History
              Tags & Scores          NLP Insights
                                     Notes Section
```

### 3. Data Processing Flow
```
CSV/JSON Import → Parse Contact Data → Extract Activities → Process Surveys → Generate Insights
                        ↓                     ↓                   ↓                ↓
                Store Contact Info    Create Activity    Store Survey Data    Calculate Metrics
                                     Timeline Items                          & NLP Analysis
```

## Core Features

### 1. Contact Management
- **CSV/JSON Import**: Drag-and-drop file upload with data validation
- **Contact Directory**: Searchable table with pagination
- **Profile Views**: Detailed individual contact profiles
- **Field Management**: Show/hide contact information fields

### 2. Activity Tracking
- **Timeline View**: Chronological activity display
- **Activity Types**: Support for various business activities
- **Time Filtering**: Filter activities by date ranges
- **Activity Details**: Expandable activity information

### 3. Survey Management
- **Survey History**: Complete survey interaction history
- **Multi-Channel Support**: Email, SMS, phone, app channels
- **Status Tracking**: Comprehensive survey status management
- **Response Analysis**: Survey completion and engagement metrics

### 4. NLP Insights
- **Sentiment Analysis**: Overall sentiment scoring with confidence levels
- **Theme Extraction**: Automatic identification of key themes
- **Emotion Detection**: Emotional tone analysis
- **Word Cloud**: Visual representation of key terms

### 5. Communication Metrics
- **Email Read Rate**: Calculated from email survey interactions
- **Response Rate**: Completion rate across all communication channels
- **Last Contact**: Most recent interaction timestamp

## Technical Architecture

### Frontend Architecture
```
src/
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── activity-timeline.tsx
│   ├── survey-history.tsx
│   ├── nlp-insights.tsx
│   ├── notes-section.tsx
│   └── time-filter.tsx
├── pages/
│   ├── customer-directory.tsx
│   ├── customer-profile.tsx
│   └── not-found.tsx
├── lib/
│   ├── queryClient.ts
│   ├── utils.ts
│   └── time-filter-utils.ts
└── hooks/
    └── use-toast.ts
```

### Backend Architecture
```
server/
├── index.ts              # Express server setup
├── routes.ts             # API route definitions
├── storage.ts            # Data storage interface
└── vite.ts              # Development server integration
```

### Shared Schema
```
shared/
└── schema.ts            # TypeScript types and Zod schemas
```

## User Interface Design

### Design Principles
- **Monochrome Theme**: Black and white color scheme
- **Full-Width Layout**: Maximizes screen real estate
- **Clean Typography**: Readable fonts with proper hierarchy
- **Responsive Design**: Mobile-first approach
- **Minimal UI**: Simple, underlined tab navigation

### Layout Structure
```
Header (Navigation + Time Filter)
├── Customer Directory (Table View)
└── Customer Profile
    ├── Contact Info Sidebar (1/5 width)
    └── Main Content Area (4/5 width)
        ├── Profile Summary Cards
        └── Tabbed Content
            ├── Activity Timeline
            ├── Survey History
            ├── NLP Insights
            └── Notes
```

## Data Models

### Contact Model
```typescript
interface Contact {
  id: string;
  directory: string;
  directoryFields: {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    industry: string;
    annual_revenue: number;
    location: string;
    join_date: string;
    segment: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity Model
```typescript
interface Activity {
  id: string;
  contactId: string;
  activity: string;
  activityFields: unknown;
  activityUploadDate: Date | null;
  createdAt: Date;
}
```

### Survey Model
```typescript
interface Survey {
  id: string;
  contactId: string;
  activityId: string | null;
  surveyTitle: string;
  feedbackRecipient: unknown;
  channel: string;
  sentAt: Date;
  language: string | null;
  status: string;
  participationMethod: string | null;
  participatedDate: Date | null;
  surveyResponseLink: string | null;
  metricScores: unknown;
  driverScores: unknown;
  openEndedSentiment: string | null;
  openEndedThemes: unknown;
  openEndedEmotions: unknown;
}
```

## API Endpoints

### Contact Endpoints
- `GET /api/contacts` - Retrieve all contacts
- `GET /api/contacts/:id` - Retrieve specific contact with full data
- `POST /api/contacts` - Create new contact
- `POST /api/contacts/import` - Import contacts from CSV/JSON
- `DELETE /api/contacts` - Delete all contacts

### Activity Endpoints
- `GET /api/activities/:contactId` - Get activities for contact
- `POST /api/activities` - Create new activity

### Survey Endpoints
- `GET /api/surveys/:contactId` - Get surveys for contact
- `POST /api/surveys` - Create new survey

### Note Endpoints
- `GET /api/notes/:contactId` - Get notes for contact
- `POST /api/notes` - Create new note

## Feature Specifications

### 1. CSV/JSON Import Feature

#### Supported File Formats
- **CSV**: Comma-separated values with header row
- **JSON**: Array of contact objects

#### Required CSV Columns
- Contact ID
- Directory
- Directory Fields (JSONb)
- Activity
- Activity Upload Date
- Activity Fields (JSONb)
- Survey ID
- Survey Title
- Channel
- Sent At
- Language
- Status
- Participated Via
- Participated Date
- Survey Response Link
- Metric and Custom Metric Scores (JSONb)
- Driver Scores (JSONb)
- Open-Ended Sentiment
- Open-Ended Themes (JSONb)
- Open-Ended Emotions (JSONb)

#### Import Process
1. File validation and parsing
2. Data transformation and normalization
3. Duplicate detection and handling
4. Batch processing for large files
5. Error reporting and validation feedback

### 2. Communication Metrics Calculation

#### Email Read Rate
**Formula**: (Email Read Count / Total Email Surveys) × 100

**Read Status Criteria**:
- Email Read
- Not Participated
- Completed
- Incomplete
- Dropped out on page
- Completed (Edited)
- Incomplete (Edited)

#### Response Rate
**Formula**: (Completed Surveys / Total Surveys) × 100

**Channels Included**: Email, SMS, Email and SMS
**Completion Status**: Completed, Completed (Edited)

### 3. Time Filtering System

#### Filter Types
- **Fixed Periods**: Last 7 days, Last 30 days, Last 3 months, Last 6 months, Last year, All time
- **Rolling Periods**: Last 7 days (rolling), Last 30 days (rolling)
- **Custom Range**: User-defined start and end dates

#### Filtered Data
- Activities (by creation date)
- Surveys (by sent date)
- Notes (by creation date)

### 4. NLP Insights Engine

#### Sentiment Analysis
- **Overall Sentiment**: Positive, Neutral, Negative
- **Confidence Score**: 0-1 scale
- **Per-Theme Analysis**: Sentiment breakdown by topic

#### Theme Extraction
- Automatic identification of key topics
- Relevance scoring
- Theme categorization

#### Emotion Detection
- Primary emotions: satisfaction, trust, frustration, confusion
- Secondary emotions: relief, confidence, disappointment
- Emotional intensity scoring

#### Word Cloud Generation
- Frequency-based word sizing
- Stop word filtering
- Custom color schemes

### 5. Activity Timeline

#### Timeline Features
- Chronological ordering (newest first)
- Activity type icons
- Expandable details
- Related survey information
- Status indicators

#### Activity Types
- Purchase
- Product Integration
- Training Completion
- Support Ticket
- Feature Request
- Feedback Submission

### 6. Survey History Management

#### Survey Table Features
- Sortable columns
- Filterable by survey title, channel, status
- Pagination support
- Export capabilities

#### Survey Details
- Expandable survey information
- Response data visualization
- Metric score display
- Related activity linking

#### Survey Status Types
- Completed
- Incomplete
- Bounced
- Dropped out on page
- SMS Scheduled
- SMS Delivered
- Sent for Delivery
- Completed (Edited)
- Incomplete (Edited)

### 7. Contact Information Management

#### Dynamic Field Display
- Show/hide contact fields
- Customizable field visibility
- Field categorization
- Quick field addition

#### Contact Fields
- Basic Info: Name, Email, Phone
- Company Details: Company, Role, Industry
- Business Metrics: Annual Revenue, Segment
- Location: Address, City, State, Country
- Timeline: Join Date, Last Contact

### 8. Notes System

#### Note Features
- Rich text support
- Timestamp tracking
- Author attribution
- Searchable content
- Tagging support

#### Note Categories
- General Notes
- Follow-up Items
- Meeting Notes
- Issue Reports
- Feedback Summary

### 9. Profile Summary Cards

#### Summary Metrics
- Total Activities
- Total Surveys
- Communication Metrics
- Latest Scores
- Tag Summary

#### Card Features
- Real-time updates
- Clickable drill-down
- Responsive layout
- Color-coded indicators

### 10. Search and Filtering

#### Global Search
- Cross-entity search
- Fuzzy matching
- Search history
- Quick filters

#### Advanced Filtering
- Multi-field filtering
- Date range filtering
- Status-based filtering
- Custom filter combinations

## Performance Considerations

### Frontend Optimization
- Component lazy loading
- Virtual scrolling for large datasets
- Memoized calculations
- Optimized re-renders

### Backend Performance
- Efficient data structures
- Batch processing
- Caching strategies
- Memory management

### Data Processing
- Streaming large file imports
- Background processing
- Progress indicators
- Error recovery

## Security Features

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Secure file uploads

### Access Control
- Session management
- Role-based permissions
- Audit logging
- Data encryption

## Future Enhancements

### Planned Features
- Real-time notifications
- Advanced analytics dashboard
- Export capabilities
- API integrations
- Mobile app support
- Advanced NLP features
- Machine learning insights
- Automated workflows

### Technical Improvements
- Database persistence
- Horizontal scaling
- Advanced caching
- Performance monitoring
- Automated testing
- CI/CD pipeline

---

*This specification document provides a comprehensive overview of the Customer Profile Management System. It serves as a reference for developers, stakeholders, and users to understand the system's capabilities and architecture.*