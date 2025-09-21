import * as projectRepo from '../repositories/project.repository';
import { IProject } from '../models/project.model';

/**
 * Create a new project
 * @param data - Object containing project name and optional description
 * @returns The created project
 */
export const createProjectService = async (data: { name: string; description?: string }): Promise<IProject> => {
  // Validation or business logic can go here if needed
  return projectRepo.createProject(data);
};

/**
 * List all projects
 * @returns Array of projects, sorted by createdAt descending
 */
export const listProjectsService = async (): Promise<IProject[]> => {
  return projectRepo.getProjects();
};

/**
 * Delete a project by ID
 * @param id - Project ID to delete
 * @returns The deleted project
 */
export const deleteProjectService = async (id: string): Promise<IProject | null> => {
  return projectRepo.deleteProject(id);
};
