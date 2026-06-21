import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('api/v1/tracker')
@UseGuards(JwtAuthGuard)
export class TrackerController {
  constructor(private trackerService: TrackerService) {}

  @Post('log')
  async logAction(
    @CurrentUser('sub') userId: string,
    @Body() dto: any,
  ) {
    return this.trackerService.logAction(userId, dto);
  }

  @Get('logs')
  async getLogs(@CurrentUser('sub') userId: string) {
    return this.trackerService.getLogs(userId);
  }

  @Get('streak')
  async getStreak(@CurrentUser('sub') userId: string) {
    return this.trackerService.getStreak(userId);
  }

  @Get('badges')
  async getBadges(@CurrentUser('sub') userId: string) {
    return this.trackerService.getBadges(userId);
  }
}
