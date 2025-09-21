import { Request, Response } from 'express';
import * as taskService from '../services/task.service';

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTaskService(req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status, priority, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filters: any = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (startDate || endDate) filters.deadline = {};
    if (startDate) filters.deadline.$gte = new Date(startDate as string);
    if (endDate) filters.deadline.$lte = new Date(endDate as string);

    const tasks = await taskService.getTasksService(projectId, filters, Number(page), Number(limit));
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.updateTaskService(req.params.id, req.body);
    res.status(200).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.deleteTaskService(req.params.id);
    res.status(200).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
