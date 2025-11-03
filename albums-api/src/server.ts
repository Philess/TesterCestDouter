import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import albumsRouter from './routes/albums.js';

const app = express();

// Environment configuration
const PORT = parseInt(process.env.PORT || '3000', 10);
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || '3500';
const COLLECTION_ID = process.env.COLLECTION_ID || 'GreatestHits';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send('Hit the /albums endpoint to retrieve a list of albums!');
});

app.use('/albums', albumsRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Albums API Server running on port ${PORT}`);
  console.log(`📁 Collection ID: ${COLLECTION_ID}`);
  console.log(`🔧 Dapr HTTP Port: ${DAPR_HTTP_PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📍 Available endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/`);
  console.log(`   GET    http://localhost:${PORT}/albums`);
  console.log(`   GET    http://localhost:${PORT}/albums/:id`);
  console.log(`   POST   http://localhost:${PORT}/albums`);
  console.log(`   PUT    http://localhost:${PORT}/albums/:id`);
  console.log(`   DELETE http://localhost:${PORT}/albums/:id`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
