import { ThemeMode } from "./enums/ThemeModeEnum";
import { FocusModeSettings } from "./value-objects/FocusModeSettingsVO";
import { SensorySettings } from "./value-objects/SensorySettingsVO";
import { TypographySettings } from "./value-objects/TypographySettingsVO";


export class CognitiveSettings {
    idUser: string;
    themeMode: ThemeMode;
    typography: TypographySettings;
    focusMode: FocusModeSettings;
    sensory: SensorySettings;

    constructor(
        idUser: string,
        themeMode: ThemeMode = ThemeMode.Light,
        typography: TypographySettings = new TypographySettings(),
        focusMode: FocusModeSettings = new FocusModeSettings(),
        sensory: SensorySettings = new SensorySettings(),
    ) {
        if (!idUser || idUser.trim().length === 0) {
            throw new Error('idUser is required');
        }

        this.idUser = idUser;
        this.themeMode = themeMode;
        this.typography = typography;
        this.focusMode = focusMode;
        this.sensory = sensory;
    }

    static default(idUser: string): CognitiveSettings {
        return new CognitiveSettings(idUser);
    }
}

