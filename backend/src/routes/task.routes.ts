import { Router } from 'express';
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
} from '../controllers/task.controller';

const router = Router();

// Task routes (unprotected for now)
router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
