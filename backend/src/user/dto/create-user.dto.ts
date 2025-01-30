import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()

  role:string;
}
