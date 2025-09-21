import { Router } from 'express';
import { createProject, listProjects, deleteProject } from '../controllers/project.controller';

const router = Router();

router.post('/', createProject);      // Create Project
router.get('/', listProjects);        // List Projects
router.delete('/:id', deleteProject); // Delete Project

export default router;
