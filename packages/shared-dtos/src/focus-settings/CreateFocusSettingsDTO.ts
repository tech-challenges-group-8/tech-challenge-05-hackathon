import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FocusTaskDTO } from './FocusTaskDTO';
import { AudioThemeDTO } from './AudioThemeDTO';
import { FocusSessionDTO } from './FocusSessionDTO';

export class CreateFocusSettingsDTO {
  @IsString()
  idUser!: string;

  @IsNumber()
  @IsOptional()
  foco?: number;

  @IsNumber()
  @IsOptional()
  pausaCurta?: number;

  @IsNumber()
  @IsOptional()
  pausaLonga?: number;

  @IsNumber()
  @IsOptional()
  pomodorosCompleted?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FocusTaskDTO)
  tasks?: FocusTaskDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AudioThemeDTO)
  audioThemes?: AudioThemeDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FocusSessionDTO)
  sessions?: FocusSessionDTO[];
}