export class FocusModeSettings {
    hideSidebar: boolean;
    highlightActiveTask: boolean;
    animationsEnabled: boolean;
    simpleInterface: boolean;

    constructor(
        hideSidebar = false,
        highlightActiveTask = false,
        animationsEnabled = true,
        simpleInterface = false,
    ) {
        this.hideSidebar = hideSidebar;
        this.highlightActiveTask = highlightActiveTask;
        this.animationsEnabled = animationsEnabled;
        this.simpleInterface = simpleInterface;
    }
}
