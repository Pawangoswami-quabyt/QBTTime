import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/middleware/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/middleware/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('admin')
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
      return this.projectService.createProject(createProjectDto);
  }

  @Roles('admin')
   @Put(':id')
    async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectService.updateProject(id, updateProjectDto);
     }
    @Roles('admin')
  @Get()
  async getProjects() {
        return this.projectService.getProjects();
    }

    @Roles('admin')
    @Get(':id')
    async getProjectById(@Param('id') id: string) {
        return this.projectService.getProjectById(id);
    }
    @Roles('admin')
   @Delete(':id')
   async deleteProject(@Param('id') id: string) {
        return this.projectService.deleteProject(id);
    }
    @Roles('admin')
  @Post(':id/assign')
  async assignProject(@Param('id') projectId: string, @Body() { userId }: { userId: string }) {
    return this.projectService.assignProject(projectId, userId);
     }
    @Roles('admin')
    @Delete(':id/assign')
    async unassignProject(@Param('id') projectId: string, @Body() { userId }: { userId: string }) {
       return this.projectService.unassignProject(projectId, userId);
    }
}