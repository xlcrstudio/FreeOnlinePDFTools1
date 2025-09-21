# PDF Tools - Online PDF Processing Platform

## Overview

PDF Tools is a comprehensive web-based PDF processing platform that provides 25+ tools for working with PDF documents. The application offers functionality including merge, split, compress, convert, edit, and secure PDF files through an intuitive web interface. Built as a modern full-stack application, it combines a React frontend with an Express.js backend to deliver a seamless user experience for PDF manipulation tasks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and development server. The frontend follows a component-based architecture with clear separation of concerns.

**UI Framework**: Built on Radix UI primitives with shadcn/ui components for consistent design patterns. Uses Tailwind CSS for styling with a custom design system that includes light/dark theme support and responsive layouts.

**State Management**: Uses React Query (@tanstack/react-query) for server state management and caching. Local state is managed through React hooks with a context-based theme provider for global UI state.

**Routing**: Implements wouter for client-side routing, providing a lightweight alternative to React Router for single-page application navigation.

**Design System**: Follows a reference-based design approach inspired by productivity tools like Notion and Asana. Uses a consistent color palette with professional blues for trust, warm orange for call-to-actions, and extensive use of CSS custom properties for theming.

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js. Implements a REST API architecture with middleware for request logging, error handling, and file upload processing.

**File Processing**: Uses Multer for handling multipart/form-data file uploads with configurable size limits (100MB) and MIME type filtering for supported document formats including PDF, Office documents, and images.

**Development Setup**: Integrates Vite middleware for hot module replacement and development server proxy, enabling seamless full-stack development experience.

**API Structure**: RESTful endpoints for file operations, processing jobs, and user management with consistent error handling and response formatting.

### Data Storage Solutions

**Database**: PostgreSQL with Drizzle ORM for type-safe database operations. Database schema includes tables for users, files, and processing jobs with proper relationships and constraints.

**File Storage**: Local file system storage in an uploads directory with organized file naming and metadata tracking. Files are stored with original names preserved and additional metadata stored in the database.

**Session Management**: Uses connect-pg-simple for PostgreSQL-backed session storage, ensuring scalable session persistence.

**Schema Design**: 
- Users table with username/password authentication
- Files table tracking uploaded documents with status, metadata, and file paths
- Processing jobs table for tracking long-running operations with progress indicators

### Authentication and Authorization

**Strategy**: Traditional session-based authentication using username/password credentials. Sessions are stored in PostgreSQL for persistence across server restarts.

**User Management**: Basic user creation and authentication endpoints with password hashing and session management.

**File Access Control**: Files are associated with user sessions, ensuring proper access control for uploaded documents.

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for PostgreSQL with migration support
- **express**: Web application framework for Node.js
- **multer**: Middleware for handling file uploads

### Frontend Libraries
- **@radix-ui/**: Comprehensive set of unstyled, accessible UI primitives
- **@tanstack/react-query**: Data synchronization and server state management
- **wouter**: Lightweight client-side routing
- **tailwindcss**: Utility-first CSS framework
- **react**: Core React library with hooks support

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and management tools
- **esbuild**: Fast JavaScript bundler for production builds

### UI and Styling
- **class-variance-authority**: Utility for creating type-safe variant APIs
- **clsx**: Utility for constructing className strings conditionally
- **tailwind-merge**: Utility for merging Tailwind CSS classes

The application is designed for deployment flexibility with both development and production build configurations, containerization support, and scalable architecture patterns suitable for cloud deployment.