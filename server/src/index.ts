import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import RED from 'node-red';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import entityRoutes from './routes/entity.routes';
import planRoutes from './routes/plan.routes';
import auditRoutes from './routes/audit.routes';
import findingRoutes from './routes/finding.routes';

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Setup middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/findings', findingRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Internal Audit API is running');
});

// Setup Node-RED for workflow
const nodeRedSettings = {
  httpAdminRoot: "/flow",
  httpNodeRoot: "/api/workflow",
  userDir: "./.node-red",
  functionGlobalContext: {}
};

// Initialize Node-RED
RED.init(app, nodeRedSettings);

// Start the Node-RED runtime
RED.start();

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
