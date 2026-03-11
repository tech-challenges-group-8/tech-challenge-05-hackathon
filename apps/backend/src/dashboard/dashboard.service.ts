import { Injectable } from '@nestjs/common';
import { TaskCheckListRepository } from '@mindease/domain';
import { Inject } from '@nestjs/common';
import { ResponseDashboardStatsDto } from '@mindease/dtos';

@Injectable()
export class DashboardService {
    constructor(
        @Inject('TaskCheckListRepository')
        private readonly taskRepository: TaskCheckListRepository,
    ) { }

    async getStats(userId: string): Promise<ResponseDashboardStatsDto> {
        const tasks = (await this.taskRepository.findByUser(userId)) ?? [];

        const activeTasks = tasks.filter(t => !t.completed).length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedToday = tasks.filter(t => {
            if (!t.completed) return false;
            const completionDate = new Date(t.updatedAt || t.createdAt);
            return completionDate >= today;
        }).length;

        const totalCompleted = tasks.filter(t => t.completed).length;
        const totalFocusTime = Math.round(tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0) * 100) / 100;

        return new ResponseDashboardStatsDto(
            activeTasks,
            completedToday,
            totalCompleted,
            totalFocusTime
        );
    }
}
