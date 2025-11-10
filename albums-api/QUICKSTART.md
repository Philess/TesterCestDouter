# Quick Start Guide - Node.js Albums API

## Start the API Server

Option 1 - In current terminal (will block):
```powershell
cd albums-api
npm start
```

Option 2 - In new window (recommended):
```powershell
cd albums-api
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd $PWD; npm start"
```

Option 3 - Development mode with auto-reload:
```powershell
cd albums-api
npm run dev
```

## Test the API

### Get all albums
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/albums" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Get a specific album
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/albums/1" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Create a new album
```powershell
$body = @{
    title = "New Album"
    artist = "New Artist"
    price = 15.99
    image_url = "https://example.com/image.jpg"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/albums" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Update an album
```powershell
$updateBody = @{
    price = 19.99
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/albums/1" -Method PUT -Body $updateBody -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Delete an album
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/albums/1" -Method DELETE -UseBasicParsing | Select-Object StatusCode
```

## Run with the Vue.js Frontend

1. Start the Node.js API (port 3000):
```powershell
cd albums-api
npm start
```

2. In another terminal, start the Vue.js frontend:
```powershell
cd album-viewer
npm run dev
```

3. Access the application at: http://localhost:3001

## Stop the Server

Press `Ctrl+C` in the terminal where the server is running.

## Notes

- The Node.js API runs on the same port (3000) as the C# API
- It uses the same routes and data structure
- No changes to the frontend are needed
- Data is stored in memory and resets on server restart
