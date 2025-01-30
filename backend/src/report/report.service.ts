import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { Repository } from 'typeorm';
import * as json2csv from 'json2csv';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,
  ) {}

  async exportToCsv(data: any[], fields: string[], fileName: string): Promise<string> {
    try {
      const csv = json2csv.parse(data, { fields });
      return csv;
    } catch (error) {
      throw new Error(`Error generating CSV: ${error.message}`);
    }
  }

  async generateTimesheetReport(
    projectId: string | undefined,
    employeeId: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
  ): Promise<string> {
    let queryBuilder = this.timeEntryRepository.createQueryBuilder('time_entries');

    if (projectId) {
      queryBuilder = queryBuilder.where('time_entries.project = :projectId', { projectId });
    }

    if (employeeId) {
      queryBuilder = queryBuilder.andWhere('time_entries.userId = :employeeId', { employeeId });
    }

    if (startDate) {
      queryBuilder = queryBuilder.andWhere('time_entries.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere('time_entries.date <= :endDate', { endDate });
    }

    const timeEntries = await queryBuilder.getMany();
    const fields = ['date', 'startTime', 'endTime', 'description', 'project', 'submitted', 'status', 'userId'];
    return await this.exportToCsv(timeEntries, fields, 'timesheet_report.csv');
  }

  async getTotalHoursPerProjectReport(startDate: Date | undefined, endDate: Date | undefined): Promise<string> {
    let queryBuilder = this.timeEntryRepository.createQueryBuilder('time_entries');

    if (startDate) {
      queryBuilder = queryBuilder.andWhere('time_entries.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere('time_entries.date <= :endDate', { endDate });
    }

    const timeEntries = await queryBuilder.getMany();
    const projectHoursMap = new Map<string, number>();

    timeEntries.forEach((entry) => {
      if (!projectHoursMap.has(entry.project)) {
        projectHoursMap.set(entry.project, 0);
      }

      const startTime = new Date(`${entry.date}T${entry.startTime}`);
      const endTime = new Date(`${entry.date}T${entry.endTime}`);
      const difference = Math.abs(endTime.getTime() - startTime.getTime());
      const totalHours = difference / (1000 * 60 * 60);

      projectHoursMap.set(entry.project, projectHoursMap.get(entry.project)! + totalHours);
    });

    const report = Array.from(projectHoursMap.entries()).map(([project, hours]) => ({
      project,
      totalHours: hours,
    }));

    const fields = ['project', 'totalHours'];
    return await this.exportToCsv(report, fields, 'project_hours_report.csv');
  }

  async getEmployeeContributionReport(startDate: Date | undefined, endDate: Date | undefined): Promise<string> {
    let queryBuilder = this.timeEntryRepository.createQueryBuilder('time_entries');

    if (startDate) {
      queryBuilder = queryBuilder.andWhere('time_entries.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere('time_entries.date <= :endDate', { endDate });
    }

    const timeEntries = await queryBuilder.getMany();
    const employeeHoursMap = new Map<string, number>();

    timeEntries.forEach((entry) => {
      if (!employeeHoursMap.has(entry.userId)) {
        employeeHoursMap.set(entry.userId, 0);
      }

      const startTime = new Date(`${entry.date}T${entry.startTime}`);
      const endTime = new Date(`${entry.date}T${entry.endTime}`);
      const difference = Math.abs(endTime.getTime() - startTime.getTime());
      const totalHours = difference / (1000 * 60 * 60);

      employeeHoursMap.set(entry.userId, employeeHoursMap.get(entry.userId)! + totalHours);
    });

    const report = Array.from(employeeHoursMap.entries()).map(([employeeId, hours]) => ({
      employeeId,
      totalHours: hours,
    }));

    const fields = ['employeeId', 'totalHours'];
    return await this.exportToCsv(report, fields, 'employee_contribution_report.csv');
  }
}
