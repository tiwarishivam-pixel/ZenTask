import { Task, ITask } from "../models/task.model";
import mongoose from "mongoose";

/**
 * Create a new task
 */
export const createTask = async (data: Partial<ITask>): Promise<ITask> => {
  if (data.projectId && typeof data.projectId === "string") {
    data.projectId = new mongoose.Types.ObjectId(data.projectId);
  }
  const task = new Task(data);
  return task.save();
};

/**
 * Get tasks by project ID
 */
export const getTasksByProject = async (projectId: string): Promise<ITask[]> => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);
  return Task.find({ projectId: projectObjectId }).sort({ createdAt: -1 });
};

/**
 * Update a task by ID
 */
export const updateTask = async (id: string, data: Partial<ITask>): Promise<ITask | null> => {
  return Task.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (id: string): Promise<{ deletedCount?: number }> => {
  return Task.deleteOne({ _id: id });
};
