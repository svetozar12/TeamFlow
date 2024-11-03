import { Mutation, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project } from '../../../graphql';

@Resolver('Project')
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}
  @Mutation(() => Project)
  createProject() {
    return this.projectService.createProject();
  }
}
