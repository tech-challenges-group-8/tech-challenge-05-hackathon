import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateCognitiveSettingsDTO {
  @IsString()
  idUser!: string;

  @IsOptional()
  @IsString()
  themeMode?: string;

  @IsOptional()
  @IsObject()
  typography?: object;

  @IsOptional()
  @IsObject()
  focusMode?: object;

  @IsOptional()
  @IsObject()
  sensory?: object;
}
