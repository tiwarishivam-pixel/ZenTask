import { Request, Response } from 'express';
import ProjectService from '../services/project.service';

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err });
  }
};

export const listProjects = async (req: Request, res: Response) => {
  try {
    const projects = await ProjectService.listProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list projects', error: err });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await ProjectService.deleteProject(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err });
  }
};
