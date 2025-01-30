import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/middleware/roles.guard';
import { Roles } from 'src/middleware/roles.decorator';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Controller('time-entries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Roles('employee')
  @Post()
  async createTimeEntry(
    @Body() createTimeEntryDto: CreateTimeEntryDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.timeEntryService.createTimeEntry(createTimeEntryDto, userId);
  }

  @Roles('employee')
  @Get()
  async getTimeEntries(@Req() req) {
    const userId = req.user.userId;
    return this.timeEntryService.getTimeEntries(userId);
  }

  @Get(':id')
  async getTimeEntryById(@Param('id') id: string) {
    return this.timeEntryService.getTimeEntryById(id);
  }
  @Roles('employee')
  @Put(':id')
  async updateTimeEntry(
    @Param('id') id: string,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
  ) {
    return this.timeEntryService.updateTimeEntry(id, updateTimeEntryDto);
  }
  @Roles('employee', 'admin')
  @Put(':id/lock')
  async lockTimeEntry(@Param('id') id: string) {
    return this.timeEntryService.updateTimeEntryStatus(id, 'locked');
  }

  @Roles('admin')
  @Put(':id/unlock')
  async unlockTimeEntry(@Param('id') id: string) {
    return this.timeEntryService.updateTimeEntryStatus(id, 'submitted');
  }
  @Roles('admin')
  @Put(':id/approve')
  async approveTimeEntry(@Param('id') id: string) {
    return this.timeEntryService.updateTimeEntryStatus(id, 'approved');
  }

  @Roles('employee', 'admin')
  @Get('by-week')
  async getTimeEntriesByWeek(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.timeEntryService.getTimesheetByDateRange(
      startDate,
      endDate,
      userId,
    );
  }

  @Roles('employee', 'admin')
  @Get('by-project/:projectId')
  async getTimeEntriesByProject(
    @Param('projectId') projectId: string,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.timeEntryService.getTimesheetByProject(projectId, userId);
  }
  @Roles('admin')
  @Get('all-timesheets')
  async getAllTimesheets() {
    return this.timeEntryService.getAllTimesheets();
  }
  @Roles('admin')
  @Get('by-employee/:employeeId')
  async getTimesheetByEmployee(@Param('employeeId') employeeId: string) {
    return this.timeEntryService.getTimesheetByEmployee(employeeId);
  }
  @Roles('admin')
  @Get('by-date-admin')
  async getTimesheetByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.timeEntryService.getTimesheetByDateRangeAdmin(
      startDate,
      endDate,
    );
  }
}
