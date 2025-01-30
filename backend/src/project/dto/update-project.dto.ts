import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateProjectDto {
    @IsOptional()
   @IsString()
    name: string;

   @IsOptional()
   @IsString()
   description: string;

    @IsOptional()
    @IsDateString()
    startDate: Date;

    @IsOptional()
    @IsDateString()
    endDate: Date;

    @IsOptional()
   status: string;
}