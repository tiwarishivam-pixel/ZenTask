import { Task, ITask } from '../models/task.model';
import mongoose from 'mongoose';

/**
 * Create a new task
 * @param data - Task data
 * @returns Created task document
 */
export const createTask = async (data: Partial<ITask>): Promise<ITask> => {
  const task = new Task(data);
  return task.save();
};

/**
 * Get tasks by project with optional filters
 * @param projectId - Project ID to fetch tasks for
 * @param filters - Optional filters (status, priority, deadline)
 * @returns Array of task documents
 */
export const getTasksByProject = async (
  projectId: string,
  filters: any = {},
  page = 1,
  limit = 10
): Promise<ITask[]> => {
  const skip = (page - 1) * limit;
  return Task.find({ projectId: new mongoose.Types.ObjectId(projectId), ...filters })
             .sort({ createdAt: -1 })
             .skip(skip)
             .limit(limit);
};

/**
 * Update task by ID
 * @param id - Task ID
 * @param data - Updated task data
 * @returns Updated task document
 */
export const updateTask = async (id: string, data: Partial<ITask>): Promise<ITask | null> => {
  return Task.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete task by ID
 * @param id - Task ID
 * @returns Deleted task document or null
 */
export const deleteTask = async (id: string): Promise<ITask | null> => {
  return Task.findByIdAndDelete(id);
};
