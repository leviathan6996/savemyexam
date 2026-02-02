import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import config from './config';
import connectDB from './config/database';

const app: Application = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(morgan(config.env === 'development' ? 'dev' : 'combined')); // Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get(`/api/${config.apiVersion}`, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'SaveMyIGCSE API',
    version: config.apiVersion,
  });
});

// Import routes (will be created)
// import authRoutes from './routes/auth';
// import userRoutes from './routes/user';
// app.use(`/api/${config.apiVersion}/auth`, authRoutes);
// app.use(`/api/${config.apiVersion}/users`, userRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

// Start Server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════╗
    ║   SaveMyIGCSE Server Running          ║
    ║   Environment: ${config.env.padEnd(23)}║
    ║   Port: ${String(PORT).padEnd(30)}║
    ║   API Version: ${config.apiVersion.padEnd(23)}║
    ╚═══════════════════════════════════════╝
  `);
});

export default app;
