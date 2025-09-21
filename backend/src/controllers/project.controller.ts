import { Request, Response } from 'express';
import * as projectService from '../services/project.service';

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProjectService(req.body);
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await projectService.listProjectsService();
    res.status(200).json(projects);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await projectService.deleteProjectService(req.params.id);
    res.status(200).json(project);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
