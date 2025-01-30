import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
    imports: [TypeOrmModule.forFeature([Project]), AuthModule], // Import AuthModule
    controllers: [ProjectController],
    providers: [ProjectService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ]
})
export class ProjectModule {}
