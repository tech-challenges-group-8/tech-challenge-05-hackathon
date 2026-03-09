export interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
  timeSpent?: number;
}

export interface AudioTheme {
  id: string;
  name: string;
  videoId: string;
}

export interface FocusSettings {
  foco: number;
  pausaCurta: number;
  pausaLonga: number;
  pomodorosCompleted: number;
  tasks: FocusTask[];
  audioThemes: AudioTheme[];
}

export interface UpdateFocusSettingsDTO {
  foco?: number;
  pausaCurta?: number;
  pausaLonga?: number;
  pomodorosCompleted?: number;
  tasks?: FocusTask[];
  audioThemes?: AudioTheme[];
}

export interface ResponseFocusSettingsDTO {
  foco: number;
  pausaCurta: number;
  pausaLonga: number;
  pomodorosCompleted: number;
  tasks: FocusTask[];
  audioThemes: AudioTheme[];
}

export interface CreateFocusSettingsDTO {
  foco: number;
  pausaCurta: number;
  pausaLonga: number;
}
