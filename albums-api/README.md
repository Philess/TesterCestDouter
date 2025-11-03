# Albums API - Node.js

A modern Node.js REST API for managing music albums, built with Express.js. This API replaces the original C# implementation while maintaining full compatibility with the existing frontend.

## Features

- ✅ RESTful API with full CRUD operations
- ✅ In-memory data storage
- ✅ CORS enabled for cross-origin requests
- ✅ ES2022 modules with modern JavaScript
- ✅ Compatible with existing Vue.js frontend
- ✅ Runs on port 3000 (configurable)

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

## Installation

```bash
# Navigate to the project directory
cd albums-api

# Install dependencies
npm install
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
├── data/
│   └── albums.js          # In-memory data store and operations
├── routes/
│   └── albums.js          # Album route handlers
├── server.js              # Main application entry point
├── package.json           # Project configuration and dependencies
└── README.md             # This file
```

## Compatibility with Frontend

This Node.js API is designed to be a drop-in replacement for the C# API:

- Same port (3000)
- Same routes (`/albums`, `/albums/:id`)
- Same response format (JSON with snake_case `image_url`)
- CORS enabled for frontend access

No changes are required to the Vue.js frontend to use this API.

## Development Notes

- Data is stored in memory and resets when the server restarts
- Uses ES modules (`type: "module"` in package.json)
- Follows RESTful conventions and HTTP status codes
- Includes input validation and error handling
- Compatible with the original C# API contract

## Future Enhancements

- Add database persistence (PostgreSQL, MongoDB, etc.)
- Implement Dapr state store integration
- Add authentication and authorization
- Implement request validation with a schema library (e.g., Joi, Zod)
- Add comprehensive test suite
- Add API documentation with Swagger/OpenAPI
