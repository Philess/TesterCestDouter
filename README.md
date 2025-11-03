# Tester c'est douter! Music Store Demo 

## Demo Scenarios

### To start discovering Github Copilot jump to [`The Ultimate GitHub Copilot Tutorial on MOAW`](https://aka.ms/github-copilot-hol)
<br/>


## Solution Overview


This repository has been inspired by the [Azure Container Apps: Dapr Albums Sample](https://github.com/Azure-Samples/containerapps-dapralbums)

It's used as a code base to demonstrate Github Copilot capabilities.

The solution is composed of two services: the Node.js album API and the Vue.js album viewer, both built with TypeScript.


### Album API (`albums-api`)

The [`albums-api`](./albums-api) is a Node.js REST API built with Express.js and TypeScript that manages a list of albums in memory. It features full type safety with TypeScript strict mode, RESTful endpoints, and CORS support for cross-origin requests.

### Album Viewer (`album-viewer`)

The [`album-viewer`](./album-viewer) is a modern Vue.js 3 application built with TypeScript through which the albums retrieved by the API are surfaced. The application uses the Vue 3 Composition API with full TypeScript support for enhanced developer experience and type safety. In order to display the repository of albums, the album viewer contacts the backend album API.

## Getting Started

There are multiple ways to run this solution locally. Choose the method that best fits your development workflow.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [TypeScript](https://www.typescriptlang.org/) (automatically installed with project dependencies)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Option 1: Using VS Code Debug Panel (Recommended)

This is the easiest way to run the solution with full debugging capabilities.

1. Open the solution in Visual Studio Code
2. Open the Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
3. Select **"All services"** from the dropdown
4. Click the green play button or press F5

This will automatically:
- Build and start the Node.js TypeScript API on `http://localhost:3000`
- Start the Vue.js TypeScript app on `http://localhost:3001`
- Open both services in your default browser

You can also run individual services:
- **"Node.js: Album API Debug"** - Runs only the Node.js TypeScript API
- **"Node.js: Album Viewer Debug"** - Runs only the Vue.js TypeScript frontend

### Option 2: Command Line

#### Starting the Album API (Node.js + TypeScript)

```powershell
# Navigate to the API directory
cd albums-api

# Install dependencies (first time only)
npm install

# Build TypeScript code
npm run build

# Run the API in development mode
npm run dev

# Optional: Run TypeScript type checking
npm run type-check
```

The API will start on `http://localhost:3000`.

#### Starting the Album Viewer (Vue.js + TypeScript)

```powershell
# Navigate to the viewer directory
cd album-viewer

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev

# Optional: Run TypeScript type checking
npm run type-check
```

The Vue.js TypeScript app will start on `http://localhost:3001` and automatically open in your browser.

#### Running Both Services

You can run both services simultaneously using separate terminal windows:

```powershell
# Terminal 1 - Start the Node.js TypeScript API
cd albums-api
npm install
npm run dev

# Terminal 2 - Start the Vue TypeScript app
cd album-viewer
npm install
npm run dev
```

### Environment Configuration

The solution uses the following default configuration:

- **Album API**: Runs on `http://localhost:3000`
- **Album Viewer**: Runs on `http://localhost:3001` (TypeScript + Vue 3)
- **API Endpoint**: The Vue app is configured to call the API at `localhost:3000`

If you need to change these settings, you can modify:
- API port: Set `PORT` environment variable or modify in `albums-api/src/server.ts`
- Vue app configuration: Environment variables in `.vscode/launch.json` or set `VITE_ALBUM_API_HOST` environment variable

### Alternative: GitHub Codespaces

The easiest way is to open this solution in a GitHub Codespace, or run it locally in a devcontainer. The development environment will be automatically configured for you.