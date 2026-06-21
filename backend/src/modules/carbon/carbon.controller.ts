import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CarbonService } from './carbon.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('api/v1/carbon')
export class CarbonController {
  constructor(private carbonService: CarbonService) {}

  @Post('calculate')
  async calculate(@Body() dto: any) {
    return this.carbonService.calculateBaseline(dto);
  }

  @Post('onboarding')
  @UseGuards(JwtAuthGuard)
  async saveOnboarding(
    @CurrentUser('sub') userId: string,
    @Body() dto: any,
  ) {
    return this.carbonService.saveOnboarding(userId, dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('sub') userId: string) {
    return this.carbonService.getProfile(userId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@CurrentUser('sub') userId: string) {
    return this.carbonService.getHistory(userId);
  }
}
