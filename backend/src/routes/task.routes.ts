import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller';

const router = Router();

router.post('/', createTask);                 // Create Task
router.get('/:projectId', getTasks);         // Get tasks by project with filters
router.put('/:id', updateTask);              // Update Task
router.delete('/:id', deleteTask);           // Delete Task

export default router;
