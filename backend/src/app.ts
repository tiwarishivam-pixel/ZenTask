import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);  // ✅ Projects
app.use('/api/tasks', taskRoutes);        // ✅ Tasks (optional)

// Test route
app.get('/', (req, res) => {
  res.send({ message: "Backend is running!" });
});

export default app;
