import { IsNumber, IsString } from 'class-validator';

export class ResponseFocusSettingsDTO {
  @IsString()
  idUser!: string;

  @IsNumber()
  foco!: number;

  @IsNumber()
  pausaCurta!: number;

  @IsNumber()
  pausaLonga!: number;
}