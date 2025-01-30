import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule], // Import AuthModule
  controllers: [UserController],
  providers: [UserService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ]
})
export class UserModule {}