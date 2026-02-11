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

  constructor(
    foco: number,
    pausaCurta: number,
    pausaLonga: number,
  ) {
    this.foco = foco;
    this.pausaCurta = pausaCurta;
    this.pausaLonga = pausaLonga;
  }
}