import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('api/v1/insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Get()
  async getInsights(@CurrentUser('sub') userId: string) {
    return this.insightsService.getInsights(userId);
  }

  @Post('save')
  async saveInsight(
    @CurrentUser('sub') userId: string,
    @Body() dto: any,
  ) {
    return this.insightsService.saveInsight(userId, dto);
  }

  @Patch(':id')
  async updateStatus(
    @CurrentUser('sub') userId: string,
    @Param('id') insightId: string,
    @Body() dto: any,
  ) {
    return this.insightsService.updateStatus(userId, insightId, dto);
  }

  @Delete(':id')
  async removeInsight(
    @CurrentUser('sub') userId: string,
    @Param('id') insightId: string,
  ) {
    return this.insightsService.removeInsight(userId, insightId);
  }
}
