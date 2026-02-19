import { IsString, IsObject } from 'class-validator';

export class ResponseCognitiveSettingsDTO {
  @IsString()
  idUser!: string;

  @IsString()
  themeMode!: string;

  @IsObject()
  typography!: object;

  @IsObject()
  focusMode!: object;

  @IsObject()
  sensory!: object;
}
