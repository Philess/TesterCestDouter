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
Node.js Express API built with TypeScript that manages album data in memory.

**Architecture Notes:**
- Express.js RESTful API with modular routing
- Full TypeScript implementation with strict mode
- Type-safe data models and DTOs (CreateAlbumDto, UpdateAlbumDto)
- Configured for CORS to allow frontend access
- Compiled from TypeScript (src/) to JavaScript (dist/)
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

#### Backend (Node.js + TypeScript)
- Follow Node.js and Express best practices for API design
- Use TypeScript with strict mode for all backend code
- Follow TypeScript naming conventions:
  - camelCase for variables, functions, and methods
  - PascalCase for classes, interfaces, and types
  - Use explicit type annotations for function parameters and return types
- Use ES modules for module imports/exports (with .js extensions)
- Implement proper error handling middleware
- Use async/await for asynchronous operations
- Leverage TypeScript for type safety and better tooling
- Define DTOs (Data Transfer Objects) for API contracts
- Use type guards and runtime validation where needed

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
| `npm run build` | `tsc` | Compiles TypeScript to JavaScript | Before running or deploying |
| `npm start` | `node dist/server.js` | Starts the compiled API server | Production execution |
| `npm run dev` | `tsc && node --watch dist/server.js` | Builds and runs with auto-restart | Local development |
| `npm run type-check` | `tsc --noEmit` | Type checks without compilation | CI/CD validation |

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
```

#### Development Workflow
1. Start the backend API:
   ```bash
   cd albums-api
   npm install
   npm run build  # Compile TypeScript
   npm run dev    # Run in development mode
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
- Unit tests located in `/albums-api/tests` (to be implemented)
- Use Jest for TypeScript testing
- Test requirements:
  - Routes must have 80%+ coverage
  - Integration tests for API endpoints
  - Mock external dependencies
  - Type-safe test utilities
- Coverage reports:
  - HTML reports in `/albums-api/coverage/lcov-report`
  - JSON format in `/albums-api/coverage/coverage-final.json`

#### Frontend Testing
- Type validation using `vue-tsc`
- Component testing guidelines:
  - Test UI interactions
  - Verify prop validation
  - Check emitted events
- End-to-end testing with Playwright:
  - Cover critical user flows
  - Test API integration
  - Verify responsive design

#### Quality Gates
| Metric | Threshold | Tool |
|--------|-----------|------|
| Code Coverage | 80% | Jest |
| Type Safety | Strict | TypeScript (tsc --noEmit) |
| Linting | 0 errors | ESLint |
| Build Status | Pass | GitHub Actions |


## Development Workflow
1. Backend: Use `npm run build` to compile TypeScript, then `npm run dev` for auto-reload
2. Frontend: Use `npm run dev` for Vite HMR
3. Both services can run simultaneously for full-stack development
4. Use API documentation for endpoint reference
5. Run `npm run type-check` before committing to catch type errors

## Key Dependencies
**Backend:**
- Express.js 4.x for API development
- TypeScript 5.3+ for type safety
- Node.js 20+ runtime
- Type definitions: @types/node, @types/express, @types/cors

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
