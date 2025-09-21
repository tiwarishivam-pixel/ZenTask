import { Project, IProject } from '../models/project.model';

/**
 * Create a new project
 * @param data - Project data
 * @returns Created project document
 */
export const createProject = async (data: Partial<IProject>): Promise<IProject> => {
  const project = new Project(data);
  return project.save();
};

/**
 * Get all projects
 * @returns Array of project documents sorted by createdAt descending
 */
export const getProjects = async (): Promise<IProject[]> => {
  return Project.find().sort({ createdAt: -1 });
};

/**
 * Delete project by ID
 * @param id - Project ID
 * @returns Deleted project document or null
 */
export const deleteProject = async (id: string): Promise<IProject | null> => {
  return Project.findByIdAndDelete(id);
};
