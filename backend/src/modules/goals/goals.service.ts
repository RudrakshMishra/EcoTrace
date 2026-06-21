import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async createGoal(userId: string, dto: any) {
    const { targetReduction, deadline } = dto;
    
    return this.prisma.goal.create({
      data: {
        userId,
        targetReduction: parseFloat(targetReduction),
        deadline: new Date(deadline),
        currentProgress: 0,
        status: 'active',
      },
    });
  }

  async getGoals(userId: string) {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { deadline: 'asc' },
    });
  }

  async updateProgress(userId: string, goalId: string, dto: any) {
    const { currentProgress } = dto;
    const progress = parseFloat(currentProgress);

    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const updatedProgress = progress;
    const status = updatedProgress >= goal.targetReduction ? 'achieved' : 'active';

    // If goal is newly achieved, send a notification
    if (status === 'achieved' && goal.status !== 'achieved') {
      await this.prisma.notification.create({
        data: {
          userId,
          type: 'goal',
          title: 'Goal Achieved! 🎉',
          message: `Congratulations! You have successfully reduced your carbon emissions by ${goal.targetReduction} kg!`,
        },
      });
    }

    return this.prisma.goal.update({
      where: { id: goalId },
      data: {
        currentProgress: updatedProgress,
        status,
      },
    });
  }

  async deleteGoal(userId: string, goalId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    await this.prisma.goal.delete({
      where: { id: goalId },
    });

    return { message: 'Goal deleted successfully' };
  }
}
