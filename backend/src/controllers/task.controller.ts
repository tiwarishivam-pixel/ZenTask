import { Request, Response } from "express";
import * as taskService from "../services/task.service";

/**
 * Create a new task
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTaskService(req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get tasks by project ID
 */
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const tasks = await taskService.getTasksByProjectService(projectId);
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Update a task
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskService.updateTaskService(id, req.body);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await taskService.deleteTaskService(id);
    if (result.deletedCount === 0) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
