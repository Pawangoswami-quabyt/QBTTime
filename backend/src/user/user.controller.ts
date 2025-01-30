import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/middleware/roles.decorator';
import { RolesGuard } from 'src/middleware/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

   @Roles('admin')
   @Get()
   async getUsers() {
       return this.userService.getUsers();
   }
  @Roles('admin','employee')
    @Get(':id')
   async getUserById(@Param('id') id: string) {
     return this.userService.findById(id);
   }
}