import { IsBoolean, IsString, IsOptional, IsNumber } from 'class-validator';

export class FocusTaskDTO {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsBoolean()
  completed!: boolean;

  @IsOptional()
  @IsNumber()
  timeSpent?: number;

  @IsOptional()
  @IsNumber()
  pomodoros?: number;
}
