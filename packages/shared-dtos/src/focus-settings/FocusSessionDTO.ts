import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class FocusSessionDTO {
  @IsString()
  id!: string;

  @IsNumber()
  duration!: number;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsDateString()
  createdAt!: string;
}
