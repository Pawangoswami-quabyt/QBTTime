import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeEntryService {
  constructor(
    @InjectRepository(TimeEntry)
    private readonly timeEntryRepository: Repository<TimeEntry>,
  ) {}

  async createTimeEntry(
    timeEntryData: CreateTimeEntryDto,
    userId: string,
  ): Promise<TimeEntry> {
    const newTimeEntry = this.timeEntryRepository.create({
      ...timeEntryData,
      userId,
    });
    return await this.timeEntryRepository.save(newTimeEntry);
  }

  async getTimeEntries(userId: string): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find({ where: { userId } });
  }

  async updateTimeEntry(
    id: string,
    timeEntryData: UpdateTimeEntryDto,
  ): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({ where: { id } });
    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }
    Object.assign(timeEntry, timeEntryData);
    return await this.timeEntryRepository.save(timeEntry);
  }
  async getTimeEntryById(id: string): Promise<TimeEntry | null> {
    return this.timeEntryRepository.findOne({ where: { id } });
  }
  async updateTimeEntryStatus(id: string, status: string): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({ where: { id } });
    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }
    timeEntry.status = status;
    return await this.timeEntryRepository.save(timeEntry);
  }

  async getTimesheetByDateRange(
    startDate: Date,
    endDate: Date,
    userId: string,
  ): Promise<TimeEntry[]> {
    return this.timeEntryRepository
      .createQueryBuilder('time_entries')
      .where('time_entries.date >= :startDate', { startDate })
      .andWhere('time_entries.date <= :endDate', { endDate })
      .andWhere('time_entries.userId = :userId', { userId })
      .getMany();
  }
  async getTimesheetByProject(
    projectId: string,
    userId: string,
  ): Promise<TimeEntry[]> {
    return this.timeEntryRepository
      .createQueryBuilder('time_entries')
      .where('time_entries.project = :projectId', { projectId })
      .andWhere('time_entries.userId = :userId', { userId })
      .getMany();
  }
  async getAllTimesheets(): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find();
  }
  async getTimesheetByEmployee(employeeId: string): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find({ where: { userId: employeeId } });
  }
  async getTimesheetByDateRangeAdmin(
    startDate: Date,
    endDate: Date,
  ): Promise<TimeEntry[]> {
    return this.timeEntryRepository
      .createQueryBuilder('time_entries')
      .where('time_entries.date >= :startDate', { startDate })
      .andWhere('time_entries.date <= :endDate', { endDate })
      .getMany();
  }
}
