export class ResponseDashboardStatsDto {
  constructor(
    public readonly activeTasks: number,
    public readonly completedToday: number,
    public readonly totalCompleted: number,
    public readonly totalFocusTime: number,
  ) { }
}
