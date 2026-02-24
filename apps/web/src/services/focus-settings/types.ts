export interface FocusSettings {
  foco: number;
  pausaCurta: number;
  pausaLonga: number;
}

export interface UpdateFocusSettingsDTO {
  foco?: number;
  pausaCurta?: number;
  pausaLonga?: number;
}

export interface ResponseFocusSettingsDTO {
  foco: number;
  pausaCurta: number;
  pausaLonga: number;
}

export interface CreateFocusSettingsDTO {
  foco: number;
  pausaCurta: number;
  pausaLonga: number;
}
