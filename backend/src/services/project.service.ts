import ProjectRepository from '../repositories/project.repository';
import { IProject } from '../models/project.model';

class ProjectService {
  async createProject(data: Partial<IProject>) {
    return await ProjectRepository.create(data);
  }

  async listProjects() {
    return await ProjectRepository.list();
  }

  async deleteProject(id: string) {
    return await ProjectRepository.delete(id);
  }

  async getProjectById(id: string) {
    return await ProjectRepository.getById(id);
  }
}

export default new ProjectService();
