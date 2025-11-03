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
| Backend | .NET 8 | 8.0+ | Minimal Web API with ASP.NET Core |
| Frontend | Vue.js 3 | 3.4+ | Modern SPA with Composition API |
| Language | TypeScript | 5.9+ | Type-safe JavaScript development |
| Build Tools | Vite, dotnet CLI | 5.0+, 8.0+ | Modern build tooling for both stacks |
| Infrastructure | Azure Container Apps | Latest | Cloud-native container hosting |
| IaC | Bicep, Terraform | Latest | Infrastructure as Code templates |
| State Management | Dapr | Latest | Distributed application runtime |

## Project Structure

### Root Level
- **README.md**: Main project documentation and getting started guide
- **gh-copilot-demo.sln**: Visual Studio solution file for the .NET components

### `/albums-api` - Backend Service
.NET 8 minimal Web API that manages album data in memory.

**Architecture Notes:**
- Uses minimal API pattern with controller-based routing
- Configured for CORS to allow frontend access
- Includes Swagger/OpenAPI documentation
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

#### Backend (.NET)
- Enable nullable reference types for better type safety
- Use minimal API pattern for simple endpoints
- Follow standard .NET naming conventions:
  - PascalCase for types, methods, and public members
  - camelCase for parameters and local variables
- Implement proper exception handling with custom middleware
- Use async/await consistently for asynchronous operations

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
| `build` | `dotnet build` | Compiles the .NET API project | Development builds |
| `publish` | `dotnet publish` | Creates production build | Deployment preparation |
| `watch` | `dotnet watch run` | Runs API in watch mode | Local development |

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
   dotnet watch run --project albums-api
   ```
2. Start the frontend development server:
   ```bash
   cd album-viewer
   npm run dev
   ```
3. Access the application at http://localhost:5173

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
1. Use `dotnet watch` for backend development with hot reload
2. Use `npm run dev` for frontend development with Vite HMR
3. Both services can run simultaneously for full-stack development
4. API documentation available via Swagger UI in development mode

## Key Dependencies
**Backend:**
- ASP.NET Core 8.0
- Swashbuckle.AspNetCore for API documentation
- Microsoft.Data.SqlClient for data access

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
