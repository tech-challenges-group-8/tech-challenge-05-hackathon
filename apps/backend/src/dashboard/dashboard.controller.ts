import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDashboardStatsDto } from '@mindease/dtos';

@Controller('dashboard')
@ApiTags('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics for the authenticated user' })
    @ApiResponse({ status: 200, description: 'Statistics found', type: ResponseDashboardStatsDto })
    async getStats(@Request() req: any) {
        const userId = req.user.sub;
        return this.dashboardService.getStats(userId);
    }
}
