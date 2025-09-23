import * as taskRepo from "../repositories/task.repository";
import { ITask } from "../models/task.model";

/**
 * Create task
 */
export const createTaskService = async (data: Partial<ITask>): Promise<ITask> => {
  if (!data.title) throw new Error("Task title is required");
  if (!data.projectId) throw new Error("Project ID is required");
  return taskRepo.createTask(data);
};

/**
 * Get tasks by project
 */
export const getTasksByProjectService = async (projectId: string): Promise<ITask[]> => {
  if (!projectId) throw new Error("Project ID is required");
  return taskRepo.getTasksByProject(projectId);
};

/**
 * Update task
 */
export const updateTaskService = async (id: string, data: Partial<ITask>): Promise<ITask | null> => {
  if (!id) throw new Error("Task ID is required");
  return taskRepo.updateTask(id, data);
};

/**
 * Delete task
 */
export const deleteTaskService = async (id: string): Promise<{ deletedCount?: number }> => {
  if (!id) throw new Error("Task ID is required");
  return taskRepo.deleteTask(id);
};
