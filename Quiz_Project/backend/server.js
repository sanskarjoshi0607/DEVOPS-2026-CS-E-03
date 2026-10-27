import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import client from 'prom-client';
import { connectDB, initMemoryStorage } from './config/db.js';
import quizRoutes from './models/routes/quizRoutes.js';
import authRoutes from './models/routes/authRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const seconds = duration[0] + duration[1] / 1e9;

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode
      },
      seconds
    );
  });

  next();
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing for frontend requests
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes);

// Root route for server verification
app.get('/', (req, res) => {
  res.json({
    message: 'Quiz Portal API is running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      quizzes: {
        list: 'GET /api/quizzes',
        details: 'GET /api/quizzes/:id',
        submit: 'POST /api/quizzes/:id/submit',
        create: 'POST /api/quizzes',
        delete: 'DELETE /api/quizzes/:id'
      },
      submissions: 'GET /api/submissions',
      status: 'GET /api/status'
    }
  });
});

// 404 Handler for unrecognized routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server and connect to MongoDB asynchronously
const startServer = () => {
  // Pre-initialize in-memory backup quizzes so the API is immediately ready
  initMemoryStorage();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Quiz Portal Server is running on: http://localhost:${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api\n`);

    // Connect to MongoDB without blocking server listening
    connectDB();
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n\x1b[31m[ERROR] Port ${PORT} is already in use by another process.\x1b[0m`);
      console.error(`\x1b[33mTip: Close any previous terminal running node, or change PORT in server/.env\x1b[0m\n`);
    } else {
      console.error('Server error:', err);
    }
  });

  return server;
};

startServer();
