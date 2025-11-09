# Albums API - Node.js with TypeScript

A modern Node.js REST API for managing music albums, built with Express.js and TypeScript. This API replaces the original C# implementation while maintaining full compatibility with the existing frontend.

## Features

- ✅ RESTful API with full CRUD operations
- ✅ TypeScript for type safety and enhanced developer experience
- ✅ In-memory data storage
- ✅ CORS enabled for cross-origin requests
- ✅ ES2022 modules with modern JavaScript
- ✅ Compatible with existing Vue.js frontend
- ✅ Runs on port 3000 (configurable)
- ✅ Strict TypeScript configuration for maximum type safety

## Prerequisites

- Node.js 20.0.0 or higher
- npm (comes with Node.js)

## Installation

```bash
# Navigate to the project directory
cd albums-api

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

## Running the API

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Type Checking
```bash
# Check types without building
npm run type-check

# Watch mode for TypeScript compilation
npm run dev:watch
```

The API will start on `http://localhost:3000` by default.

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/` | Welcome message | - | Text message |
| GET | `/albums` | Get all albums | - | Array of albums |
| GET | `/albums/:id` | Get album by ID | - | Album object |
| POST | `/albums` | Create new album | Album data | Created album |
| PUT | `/albums/:id` | Update album | Partial album data | Updated album |
| DELETE | `/albums/:id` | Delete album | - | 204 No Content |

## Album Data Model

```json
{
  "id": 1,
  "title": "You, Me and an App Id",
  "artist": "Daprize",
  "price": 10.99,
  "image_url": "https://aka.ms/albums-daprlogo"
}
```

## Example Requests

### Get all albums
```bash
curl http://localhost:3000/albums
```

### Get a specific album
```bash
curl http://localhost:3000/albums/1
```

### Create a new album
```bash
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Album",
    "artist": "New Artist",
    "price": 15.99,
    "image_url": "https://example.com/image.jpg"
  }'
```

### Update an album
```bash
curl -X PUT http://localhost:3000/albums/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 11.99
  }'
```

### Delete an album
```bash
curl -X DELETE http://localhost:3000/albums/1
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DAPR_HTTP_PORT` | `3500` | Dapr HTTP port (for future use) |
| `COLLECTION_ID` | `GreatestHits` | Collection identifier |
| `NODE_ENV` | - | Environment (development/production) |

## Project Structure

```
albums-api/
├── src/                   # TypeScript source files
│   ├── server.ts         # Main application entry point
│   ├── types/
│   │   └── album.ts      # TypeScript type definitions
│   ├── data/
│   │   └── albums.ts     # In-memory data store and operations
│   └── routes/
│       └── albums.ts     # Album route handlers
├── tests/                 # Test files
│   └── load/             # Load testing with Azure Load Testing
│       ├── album-api-load-test.jmx  # JMeter test plan
│       ├── load-test.yaml           # Azure Load Testing config
│       ├── deploy-load-test.ps1     # Deployment script
│       ├── run-load-test.ps1        # Execution script
│       └── README.md                # Load testing guide
├── dist/                  # Compiled JavaScript (generated)
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project configuration and dependencies
├── README.md            # This file
└── TYPESCRIPT-MIGRATION.md  # TypeScript migration guide
```

## Compatibility with Frontend

This Node.js API is designed to be a drop-in replacement for the C# API:

- Same port (3000)
- Same routes (`/albums`, `/albums/:id`)
- Same response format (JSON with snake_case `image_url`)
- CORS enabled for frontend access

No changes are required to the Vue.js frontend to use this API.

## TypeScript Features

### Type Definitions

The API uses TypeScript interfaces for type safety:

```typescript
interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  image_url: string;
}

type CreateAlbumDto = Omit<Album, 'id'>;
type UpdateAlbumDto = Partial<Omit<Album, 'id'>>;
```

### Build Process

- TypeScript code in `src/` compiles to JavaScript in `dist/`
- Target: ES2022 with ES modules
- Strict mode enabled for maximum type safety
- Source maps generated for debugging

## Development Notes

- Data is stored in memory and resets when the server restarts
- Uses ES modules (`type: "module"` in package.json)
- TypeScript compiled to ES2022 JavaScript
- Follows RESTful conventions and HTTP status codes
- Includes input validation and error handling
- Compatible with the original C# API contract
- Full type safety with TypeScript strict mode

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `tsc` | Compile TypeScript to JavaScript |
| `start` | `node dist/server.js` | Run compiled server (production) |
| `dev` | `tsc && node --watch dist/server.js` | Build and run with auto-restart |
| `dev:watch` | `tsc --watch` | Run TypeScript compiler in watch mode |
| `clean` | `rm -rf dist` | Remove compiled files |
| `type-check` | `tsc --noEmit` | Check types without emitting files |

## Load Testing

The API includes comprehensive load testing capabilities using Azure Load Testing and Apache JMeter. The load tests simulate progressive load from 0 to 1000 requests per second.

### Quick Start

```powershell
# Navigate to load test directory
cd tests/load

# Deploy test to Azure Load Testing
.\deploy-load-test.ps1 -ResourceGroup "rg-albums-loadtest" -LoadTestResource "loadtest-albums-api"

# Run the test
.\run-load-test.ps1 -ResourceGroup "rg-albums-loadtest" -LoadTestResource "loadtest-albums-api" -Wait
```

### Test Phases

1. **Warm-up** (1 min): 100 concurrent users
2. **Medium Load** (2 min): 500 concurrent users
3. **Peak Load** (2 min): 1000 concurrent users

### Local Testing with JMeter

```powershell
# Run with JMeter (requires JMeter 5.6+)
cd tests/load
jmeter -n -t album-api-load-test.jmx -l results.jtl -e -o reports/
```

For detailed documentation, see [`tests/load/README.md`](./tests/load/README.md).

## Future Enhancements

- Add database persistence (PostgreSQL, MongoDB, etc.)
- Implement Dapr state store integration
- Add authentication and authorization
- Implement request validation with a schema library (e.g., Zod)
- Add comprehensive test suite with Jest
- Add API documentation with Swagger/OpenAPI
- Add input validation decorators
