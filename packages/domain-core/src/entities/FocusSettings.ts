import { FocusTask } from './FocusTask';
import { AudioTheme } from './AudioTheme';
import { FocusSession } from './FocusSession';

export class FocusSettings {
    idUser: string;
    foco: number;
    pausaCurta: number;
    pausaLonga: number;
    pomodorosCompleted: number;
    tasks: FocusTask[];
    audioThemes: AudioTheme[];
    sessions: FocusSession[];

    constructor(
        idUser: string,
        foco: number = 25,
        pausaCurta: number = 5,
        pausaLonga: number = 15,
        pomodorosCompleted: number = 0,
        tasks: FocusTask[] = [],
        audioThemes: AudioTheme[] = [],
        sessions: FocusSession[] = [],
    ) {
        if (!idUser || idUser.trim().length === 0) {
            throw new Error('idUser is required');
        }

        this.idUser = idUser;
        this.foco = foco;
        this.pausaCurta = pausaCurta;
        this.pausaLonga = pausaLonga;
        this.pomodorosCompleted = pomodorosCompleted;
        this.tasks = tasks;
        this.audioThemes = audioThemes;
        this.sessions = sessions;
    }
}