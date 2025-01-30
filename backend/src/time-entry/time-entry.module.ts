import { Module } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { TimeEntryController } from './time-entry.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry]),AuthModule], // Import AuthModule
    controllers: [TimeEntryController],
  providers: [TimeEntryService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class TimeEntryModule {}
