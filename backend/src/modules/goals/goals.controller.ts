import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('api/v1/goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  async createGoal(
    @CurrentUser('sub') userId: string,
    @Body() dto: any,
  ) {
    return this.goalsService.createGoal(userId, dto);
  }

  @Get()
  async getGoals(@CurrentUser('sub') userId: string) {
    return this.goalsService.getGoals(userId);
  }

  @Patch(':id')
  async updateProgress(
    @CurrentUser('sub') userId: string,
    @Param('id') goalId: string,
    @Body() dto: any,
  ) {
    return this.goalsService.updateProgress(userId, goalId, dto);
  }

  @Delete(':id')
  async deleteGoal(
    @CurrentUser('sub') userId: string,
    @Param('id') goalId: string,
  ) {
    return this.goalsService.deleteGoal(userId, goalId);
  }
}
