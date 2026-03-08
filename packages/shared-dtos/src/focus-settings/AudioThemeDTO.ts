import { IsString } from 'class-validator';

export class AudioThemeDTO {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  videoId!: string;
}
