export class FocusSettings {
    idUser: string;
    foco: number;
    pausaCurta: number;
    pausaLonga: number;

    constructor(
        idUser: string,
        foco: number = 25,
        pausaCurta: number = 5,
        pausaLonga: number = 15,
    ) {
        if (!idUser || idUser.trim().length === 0) {
            throw new Error('idUser is required');
        }

        this.idUser = idUser;
        this.foco = foco;
        this.pausaCurta = pausaCurta;
        this.pausaLonga = pausaLonga;
    }
}