import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date;
}