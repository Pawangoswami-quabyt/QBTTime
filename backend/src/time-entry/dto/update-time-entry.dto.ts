import { IsOptional, IsDateString, IsString, IsBoolean} from 'class-validator';

export class UpdateTimeEntryDto {
    @IsOptional()
    @IsDateString()
    date?: Date;

    @IsOptional()
    @IsString()
    startTime?: string;

    @IsOptional()
    @IsString()
    endTime?: string;

    @IsOptional()
    @IsString()
    description?: string;
   @IsOptional()
    @IsString()
    project?: string;

    @IsOptional()
    @IsBoolean()
   submitted?: boolean;
}