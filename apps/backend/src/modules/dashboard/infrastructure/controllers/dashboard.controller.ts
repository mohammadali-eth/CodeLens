import {
  Controller,
  Get,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { DashboardFilterDto } from './dtos/dashboard-filter.dto';
import {
  UserDashboardSummaryResponseDto,
  AdminDashboardSummaryResponseDto,
  QualityTrendPointDto,
  LanguageDistributionDto,
  ProviderUsageStatDto,
  ActivityTimelineItemDto,
} from './dtos/dashboard-response.dto';
import { GetDashboardSummaryUseCase } from '../../application/use-cases/get-dashboard-summary.use-case';
import { GetQualityTrendUseCase } from '../../application/use-cases/get-quality-trend.use-case';
import { GetLanguageStatsUseCase } from '../../application/use-cases/get-language-stats.use-case';
import { GetProviderUsageUseCase } from '../../application/use-cases/get-provider-usage.use-case';
import { GetRecentActivityUseCase } from '../../application/use-cases/get-recent-activity.use-case';
import { GetAdminDashboardUseCase } from '../../application/use-cases/get-admin-dashboard.use-case';

@ApiTags('Dashboard & Analytics')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly getSummaryUseCase: GetDashboardSummaryUseCase,
    private readonly getQualityTrendUseCase: GetQualityTrendUseCase,
    private readonly getLanguageStatsUseCase: GetLanguageStatsUseCase,
    private readonly getProviderUsageUseCase: GetProviderUsageUseCase,
    private readonly getRecentActivityUseCase: GetRecentActivityUseCase,
    private readonly getAdminDashboardUseCase: GetAdminDashboardUseCase,
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get user dashboard summary KPIs' })
  @ApiResponse({ status: 200, type: UserDashboardSummaryResponseDto })
  async getSummary(
    @CurrentUser('sub') userId: string,
    @Query() filterDto: DashboardFilterDto,
  ): Promise<UserDashboardSummaryResponseDto> {
    const summary = await this.getSummaryUseCase.execute(userId, filterDto);
    return summary;
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get user recent activity timeline items' })
  @ApiResponse({ status: 200, type: [ActivityTimelineItemDto] })
  async getRecentActivity(
    @CurrentUser('sub') userId: string,
    @Query('limit') limit?: number,
  ): Promise<ActivityTimelineItemDto[]> {
    const activities = await this.getRecentActivityUseCase.execute(
      userId,
      limit ? Number(limit) : 20,
    );
    return activities;
  }

  @Get('language-stats')
  @ApiOperation({ summary: 'Get programming language breakdown statistics' })
  @ApiResponse({ status: 200, type: [LanguageDistributionDto] })
  async getLanguageStats(
    @CurrentUser('sub') userId: string,
  ): Promise<LanguageDistributionDto[]> {
    const stats = await this.getLanguageStatsUseCase.execute(userId);
    return stats;
  }

  @Get('quality-trend')
  @ApiOperation({
    summary: 'Get historical code quality trend time-series data',
  })
  @ApiResponse({ status: 200, type: [QualityTrendPointDto] })
  async getQualityTrend(
    @CurrentUser('sub') userId: string,
    @Query('days') days?: number,
  ): Promise<QualityTrendPointDto[]> {
    const trend = await this.getQualityTrendUseCase.execute(
      userId,
      days ? Number(days) : 30,
    );
    return trend;
  }

  @Get('provider-usage')
  @ApiOperation({ summary: 'Get AI Provider distribution metrics' })
  @ApiResponse({ status: 200, type: [ProviderUsageStatDto] })
  async getProviderUsage(
    @CurrentUser('sub') userId: string,
  ): Promise<ProviderUsageStatDto[]> {
    const usage = await this.getProviderUsageUseCase.execute(userId);
    return usage;
  }

  @Get('admin-summary')
  @ApiOperation({ summary: 'Get global system-wide administrator metrics' })
  @ApiResponse({ status: 200, type: AdminDashboardSummaryResponseDto })
  async getAdminSummary(
    @CurrentUser() user: { sub: string; role?: string },
  ): Promise<AdminDashboardSummaryResponseDto> {
    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only system administrators can access the admin dashboard metrics.',
      );
    }
    const adminSummary = await this.getAdminDashboardUseCase.execute();
    return adminSummary;
  }
}
