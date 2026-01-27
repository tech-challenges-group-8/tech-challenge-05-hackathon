import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}