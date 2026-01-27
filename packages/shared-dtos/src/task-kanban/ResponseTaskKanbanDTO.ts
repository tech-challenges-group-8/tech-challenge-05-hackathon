import { IsArray, IsBoolean, IsDateString, IsString } from 'class-validator';

export class ResponseTaskKanbanDTO {
  @IsString()
  id!: string;

  @IsString()
  idUser!: string;

  @IsString()
  title!: string;

  @IsString()
  description?: string;

  @IsString()
  status!: string;

  @IsString()
  priority!: string;

  @IsDateString()
  dueDate?: Date;

  @IsBoolean()
  completed!: boolean;

  @IsDateString()
  createdAt!: Date;

  @IsDateString()
  updatedAt!: Date;

  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
