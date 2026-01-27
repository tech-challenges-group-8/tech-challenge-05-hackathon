import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskKanbanDTO {
  @IsString()
  idUser!: string;

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string; // Assumindo string para simplificar a dependência de enum entre pacotes

  @IsString()
  @IsOptional()
  priority?: string; // Assumindo string para simplificar a dependência de enum entre pacotes

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
