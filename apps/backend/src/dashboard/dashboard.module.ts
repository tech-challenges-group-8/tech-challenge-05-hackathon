import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TaskCheckListModule } from '../task-checklist/task-checklist.module';

@Module({
    imports: [TaskCheckListModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
