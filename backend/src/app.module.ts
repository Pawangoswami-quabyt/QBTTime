import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TimeEntryModule } from './time-entry/time-entry.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { NotificationModule } from './notification/notification.module';
import { ReportModule } from './report/report.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
  }),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('database')
      }),
    UserModule,
    NotificationModule,
    TimeEntryModule,
    ProjectModule,
    ReportModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}