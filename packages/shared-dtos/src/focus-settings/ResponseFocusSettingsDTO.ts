import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FocusTaskDTO } from './FocusTaskDTO';
import { AudioThemeDTO } from './AudioThemeDTO';
import { FocusSessionDTO } from './FocusSessionDTO';

export class ResponseFocusSettingsDTO {
  @IsString()
  idUser!: string;

  @IsNumber()
  foco!: number;

  @IsNumber()
  pausaCurta!: number;

  @IsNumber()
  pausaLonga!: number;

  @IsNumber()
  pomodorosCompleted!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FocusTaskDTO)
  tasks!: FocusTaskDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AudioThemeDTO)
  audioThemes!: AudioThemeDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FocusSessionDTO)
  sessions!: FocusSessionDTO[];

  constructor(
    foco: number,
    pausaCurta: number,
    pausaLonga: number,
    pomodorosCompleted: number,
    tasks: FocusTaskDTO[] = [],
    audioThemes: AudioThemeDTO[] = [],
    sessions: FocusSessionDTO[] = [],
  ) {
    this.foco = foco;
    this.pausaCurta = pausaCurta;
    this.pausaLonga = pausaLonga;
    this.pomodorosCompleted = pomodorosCompleted;
    this.tasks = tasks;
    this.audioThemes = audioThemes;
    this.sessions = sessions;
  }
}