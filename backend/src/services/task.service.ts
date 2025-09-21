import * as taskRepo from '../repositories/task.repository';

/**
 * Create a new task
 * @param data - Task data
 */
export const createTaskService = async (data: any) => {
  return taskRepo.createTask(data);
};

/**
 * Get tasks by project with filters and pagination
 * @param projectId - Project ID
 * @param filters - Optional filters: status, priority, deadline
 * @param page - Page number for pagination
 * @param limit - Number of tasks per page
 */
export const getTasksService = async (
  projectId: string,
  filters: any = {},
  page = 1,
  limit = 10
) => {
  // Pagination handled in repository
  return taskRepo.getTasksByProject(projectId, filters, page, limit);
};

/**
 * Update task by ID
 * @param id - Task ID
 * @param data - Updated fields
 */
export const updateTaskService = async (id: string, data: any) => {
  return taskRepo.updateTask(id, data);
};

/**
 * Delete task by ID
 * @param id - Task ID
 */
export const deleteTaskService = async (id: string) => {
  return taskRepo.deleteTask(id);
};
