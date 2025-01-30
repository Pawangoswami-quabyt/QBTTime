import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({ ...createUserDto, role: 'employee' });
    return this.userRepository.save(user);
  }

  async validateUser(id: string, email: string, name: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = await this.register({ id, email, name, role: 'employee' });
    }
    return user;
  }

  async generateJwtToken(user: any): Promise<string> {
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    return this.jwtService.sign(payload);
  }

  // Add the findById method
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
