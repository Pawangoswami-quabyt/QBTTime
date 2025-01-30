import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    const newProject = this.projectRepository.create(projectData);
    return await this.projectRepository.save(newProject);
  }

  async updateProject(id: string, projectData: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    Object.assign(project, projectData);
    return await this.projectRepository.save(project);
  }

  async getProjects(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projectRepository.findOne({ where: { id } });
  }
  async deleteProject(id:string):Promise<void>{
   await this.projectRepository.delete(id);
  }
    async assignProject(projectId:string, userId:string):Promise<Project>{
        const project = await this.projectRepository.findOne({where: {id: projectId}, relations: ['assignedUsers']})
        if(!project){
            throw new NotFoundException('Project not found');
        }

        const user = await this.projectRepository.manager.getRepository(User).findOne({where: {id: userId}})
        if(!user){
            throw new NotFoundException('User not found');
        }
        project.assignedUsers.push(user);
        return await this.projectRepository.save(project);
    }
    async unassignProject(projectId:string, userId:string):Promise<Project>{
        const project = await this.projectRepository.findOne({where: {id: projectId}, relations: ['assignedUsers']})
         if(!project){
            throw new NotFoundException('Project not found');
         }
        project.assignedUsers = project.assignedUsers.filter(user => user.id !== userId);

         return await this.projectRepository.save(project);
     }
}