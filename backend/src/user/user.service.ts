import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
  ) {}

    async findById(id: string): Promise<User> {
        const user =  await this.userRepository.findOne({ where: { id } });
        if(!user){
             throw new NotFoundException(`User with ID "${id}" not found`)
        }
        return user
    }

   async getUsers(): Promise<User[]>{
      return await this.userRepository.find();
   }
}