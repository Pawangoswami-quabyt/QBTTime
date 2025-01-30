import { IsNotEmpty, IsDateString, IsString, IsBoolean, IsOptional} from 'class-validator';

export class CreateTimeEntryDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsNotEmpty()
    @IsString()
    endTime: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    project: string;

    @IsBoolean()
    @IsOptional()
    submitted?: boolean;
}