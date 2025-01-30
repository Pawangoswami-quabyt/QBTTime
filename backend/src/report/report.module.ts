import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from '../entities/time-entry.entity'; // Import the TimeEntry entity
import { TimeEntryModule } from '../time-entry/time-entry.module'; // Import TimeEntryModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([TimeEntry]), TimeEntryModule,AuthModule], // Import TypeOrmModule and TimeEntryModule
    providers: [ReportService],
    exports: [ReportService],
})
export class ReportModule {}