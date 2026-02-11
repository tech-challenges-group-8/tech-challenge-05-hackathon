import { IsArray, IsDateString, IsString } from 'class-validator';

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

  @IsDateString()
  createdAt!: Date;

  @IsDateString()
  updatedAt!: Date;

  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  constructor(
    id: string,
    idUser: string,
    title: string,
    description: string | undefined,
    status: string,
    priority: string,
    dueDate: Date | undefined,
    createdAt: Date,
    updatedAt: Date,
    tags: string[] | undefined
  ) {
    this.id = id;
    this.idUser = idUser;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tags = tags;
  }
}
