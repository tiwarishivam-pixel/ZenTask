import { ProjectModel, IProject } from '../models/project.model';

class ProjectRepository {
  async create(data: Partial<IProject>): Promise<IProject> {
    const project = new ProjectModel(data);
    return await project.save();
  }

  async list(): Promise<IProject[]> {
    return await ProjectModel.find().sort({ createdAt: -1 });
  }

  async delete(id: string): Promise<IProject | null> {
    return await ProjectModel.findByIdAndDelete(id);
  }

  async getById(id: string): Promise<IProject | null> {
    return await ProjectModel.findById(id);
  }
}

export default new ProjectRepository();
