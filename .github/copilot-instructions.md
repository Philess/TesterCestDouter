---
description: 'Instructions for GitHub Copilot to assist with the Music Store Demo application'
applyTo: '**'
---

# Copilot Instructions for "Tester c'est douter!" Music Store Demo

## Project Overview

This is a demo project showcasing GitHub Copilot capabilities through a modern music store application. The project demonstrates full-stack development practices, cloud-native architecture, and infrastructure-as-code patterns through two main services.

### Technology Stack

| Component | Technology | Version | Description |
|-----------|------------|---------|-------------|
| Backend | Node.js | 20.x+ | Express.js RESTful API |
| Frontend | Vue.js 3 | 3.4+ | Modern SPA with Composition API |
| Language | TypeScript | 5.9+ | Type-safe JavaScript development |
| Build Tools | Vite, Node.js | 5.0+, 20.x+ | Modern build tooling for both stacks |
| Infrastructure | Azure Container Apps | Latest | Cloud-native container hosting |
| IaC | Bicep, Terraform | Latest | Infrastructure as Code templates |
| State Management | Dapr | Latest | Distributed application runtime |

## Project Structure

### Root Level
- **README.md**: Main project documentation and getting started guide

### `/albums-api` - Backend Service
Node.js Express API that manages album data in memory.

**Architecture Notes:**
- Express.js RESTful API with modular routing
- Configured for CORS to allow frontend access
- TypeScript for type safety and improved developer experience
- Modular architecture with separation of concerns
- Default port configuration via environment variables

### `/album-viewer` - Frontend Application
Modern Vue.js 3 application with TypeScript and Composition API.

**Frontend Architecture:**
- Vue 3 with Composition API for reactive state management
- TypeScript for type safety and enhanced developer experience
- Vite for fast development and optimized builds
- Axios for HTTP client communication with backend API
- Component-based architecture with reusable UI elements


## Development Guidelines

### Code Style and Standards

#### Backend (Node.js)
- Follow Node.js and Express best practices for API design
- Use ES modules for module imports/exports
- Follow JavaScript/TypeScript naming conventions:
  - camelCase for variables, functions, and methods
  - PascalCase for classes and types
- Implement proper error handling middleware
- Use async/await for asynchronous operations
- Leverage TypeScript for type safety and better tooling

#### Frontend (Vue.js)

Specific instructions for Vue.js and TypeScript are defined in the dedicated Copilot instructions:
- [Vue.js Copilot Instructions](./instructions/vuejs3.instructions.md)
- [TypeScript Copilot Instructions](./instructions/typescript-5-es2022.instructions.md)

#### API Design
- Follow RESTful conventions:
  - Use proper HTTP methods (GET, POST, PUT, DELETE)
  - Return appropriate status codes
  - Implement consistent error responses
- Implement CORS policies correctly
- Version APIs when making breaking changes
- Document endpoints with OpenAPI/Swagger

### Environment Configuration
- Backend API runs on configurable ports 
- Frontend development server configured through Vite
- Environment variables for API endpoints and feature flags
- CORS enabled for cross-origin requests during development

### Build and Development Tasks

#### Backend Tasks
| Task | Command | Description | Usage |
|------|---------|-------------|--------|
| `npm install` | `npm install` | Installs dependencies | Initial setup, dependency updates |
| `npm start` | `node server.js` | Starts the API server | Production execution |
| `npm run dev` | `nodemon server.js` | Runs API in watch mode | Local development |

#### Frontend Tasks
| Task | Command | Description | Usage |
|------|---------|-------------|--------|
| `npm: install` | `npm install` | Installs dependencies | Initial setup, dependency updates |
| `npm: dev` | `npm run dev` | Starts dev server | Local development with HMR |

#### Environment Setup
```env
# Frontend (.env)
VITE_ALBUM_API_HOST=localhost:3000
VITE_BACKGROUND_COLOR=black

# Backend (appsettings.Development.json)
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

#### Development Workflow
1. Start the backend API:
   ```bash
   cd albums-api
   npm install
   npm run dev
   ```
2. Start the frontend development server:
   ```bash
   cd album-viewer
   npm install
   npm run dev
   ```
3. Access the application at http://localhost:3001

### Testing and Quality

#### Backend Testing
- Unit tests located in `/albums-api/tests`
- Coverage reports:
  - HTML reports in `/albums-api/coverage/lcov-report`
  - JSON format in `/albums-api/coverage/coverage-final.json`
  - Clover XML in `/albums-api/coverage/clover.xml`
- Test requirements:
  - Controllers must have 80%+ coverage
  - Integration tests for API endpoints
  - Mock external dependencies

#### Frontend Testing
- Type validation using `vue-tsc`
- Component testing guidelines:
  - Test UI interactions
  - Verify prop validation
  - Check emitted events
- End-to-end testing with Cypress:
  - Cover critical user flows
  - Test API integration
  - Verify responsive design

#### Quality Gates
| Metric | Threshold | Tool |
|--------|-----------|------|
| Code Coverage | 80% | Jest/VSTest |
| Type Safety | Strict | TypeScript/vue-tsc |
| Linting | 0 errors | ESLint/StyleCop |
| Build Status | Pass | GitHub Actions |


## Development Workflow
1. Use `npm run dev` with nodemon for backend development with auto-reload
2. Use `npm run dev` for frontend development with Vite HMR
3. Both services can run simultaneously for full-stack development
4. Use API documentation for endpoint reference

## Key Dependencies
**Backend:**
- Express.js for API development
- TypeScript for type safety
- Nodemon for development auto-reload

**Frontend:**
- Vue 3.4+ with Composition API
- TypeScript 5.9+
- Vite 5.0+ for build tooling
- Axios for HTTP requests

## Notes for Copilot
- This is a demonstration project for GitHub Copilot capabilities
- Focus on modern development practices and cloud-native patterns
- Emphasize type safety and clean architecture principles
- Consider Azure deployment scenarios when suggesting improvements
- Maintain separation of concerns between frontend and backend services
