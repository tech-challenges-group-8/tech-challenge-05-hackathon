export class SensorySettings {
    muteSounds: boolean;
    hideUrgencyIndicators: boolean;

    constructor(
        muteSounds = false,
        hideUrgencyIndicators = false,
    ) {
        this.muteSounds = muteSounds;
        this.hideUrgencyIndicators = hideUrgencyIndicators;
    }
}
