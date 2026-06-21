import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

const recommendationTemplates: Record<string, Array<{ title: string; description: string; co2Savings: number }>> = {
  transport: [
    {
      title: 'Switch to Public Transport',
      description: 'Commute by bus or train instead of driving alone. Saves fuel and congestion.',
      co2Savings: 500,
    },
    {
      title: 'Commute by Bicycle',
      description: 'Ride your bike or walk for short trips under 5 km to completely eliminate commute emissions.',
      co2Savings: 300,
    },
    {
      title: 'Carpool to Work',
      description: 'Share your ride with colleagues to cut your commute carbon emissions in half.',
      co2Savings: 400,
    },
  ],
  diet: [
    {
      title: 'Reduce Meat Consumption',
      description: 'Switch to vegetarian or vegan meals a few days a week to lower food production emissions.',
      co2Savings: 700,
    },
    {
      title: 'Try Meat-free Mondays',
      description: 'Dedicate one day a week to eating purely plant-based meals.',
      co2Savings: 150,
    },
    {
      title: 'Buy Locally Sourced Food',
      description: 'Choose seasonal, local produce to minimize transport food-miles emissions.',
      co2Savings: 100,
    },
  ],
  home: [
    {
      title: 'Switch to Renewable Energy',
      description: 'Power your home with 100% green energy by switching your tariff or installing solar panels.',
      co2Savings: 2700,
    },
    {
      title: 'Lower Heating by 1°C',
      description: 'Turn down your thermostat by just 1 degree to save home heating fuel emissions.',
      co2Savings: 180,
    },
    {
      title: 'Unplug Idle Devices',
      description: 'Avoid standby power leakage by unplugging electronics when not in use.',
      co2Savings: 50,
    },
  ],
  flight: [
    {
      title: 'Take Trains for Intercity Trips',
      description: 'Choose high-speed rail instead of short-haul flights for domestic travel.',
      co2Savings: 600,
    },
    {
      title: 'Limit Long-haul Travel',
      description: 'Consolidate multiple short trips into one longer stay to reduce flights.',
      co2Savings: 1000,
    },
  ],
  shopping: [
    {
      title: 'Buy Clothes Second-hand',
      description: 'Shop vintage or thrift to avoid the carbon footprint of manufacturing brand-new garments.',
      co2Savings: 200,
    },
    {
      title: 'Avoid Single-use Plastics',
      description: 'Bring reusable bags and bottles to decrease production and disposal emissions.',
      co2Savings: 50,
    },
  ],
};

@Injectable()
export class InsightsService {
  constructor(private prisma: PrismaService) {}

  async getInsights(userId: string) {
    // 1. Fetch user's active Kanban board items
    let userInsights = await this.prisma.insight.findMany({
      where: { userId },
    });

    // 2. If board is empty, auto-generate recommendations based on highest carbon category
    if (userInsights.length === 0) {
      const profile = await this.prisma.carbonProfile.findUnique({
        where: { userId },
      });

      if (profile) {
        // Find highest score category
        const categories = [
          { name: 'transport', score: profile.transportScore },
          { name: 'diet', score: profile.dietScore },
          { name: 'home', score: profile.homeScore },
          { name: 'flight', score: profile.flightScore },
          { name: 'shopping', score: profile.shoppingScore },
        ];
        
        categories.sort((a, b) => b.score - a.score);
        const highestCategory = categories[0].name;

        const templates = recommendationTemplates[highestCategory] || recommendationTemplates['transport'];

        // Add templates as TODO insights for the user
        const promises = templates.map((template) =>
          this.prisma.insight.create({
            data: {
              userId,
              title: template.title,
              description: template.description,
              co2Savings: template.co2Savings,
              status: 'TODO',
            },
          }),
        );

        userInsights = await Promise.all(promises);
      }
    }

    return userInsights;
  }

  async saveInsight(userId: string, dto: any) {
    const { title, description, co2Savings } = dto;
    if (!title || co2Savings === undefined) {
      throw new Error('Title and co2Savings are required');
    }

    return this.prisma.insight.create({
      data: {
        userId,
        title,
        description: description || '',
        co2Savings: parseFloat(co2Savings),
        status: 'TODO',
      },
    });
  }

  async updateStatus(userId: string, insightId: string, dto: any) {
    const { status } = dto; // "TODO", "IN_PROGRESS", "DONE"

    const insight = await this.prisma.insight.findFirst({
      where: { id: insightId, userId },
    });

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    const updated = await this.prisma.insight.update({
      where: { id: insightId },
      data: { status },
    });

    // If status changes to DONE, add to progress of the active monthly goals (if any)
    if (status === 'DONE' && insight.status !== 'DONE') {
      // Find active goals
      const activeGoals = await this.prisma.goal.findMany({
        where: { userId, status: 'active' },
      });

      for (const goal of activeGoals) {
        // Let's increment currentProgress by the savings divided by 12 (monthly share of annual savings)
        const monthlySavings = insight.co2Savings / 12;
        const newProgress = Math.min(goal.currentProgress + monthlySavings, goal.targetReduction);
        const goalStatus = newProgress >= goal.targetReduction ? 'achieved' : 'active';

        await this.prisma.goal.update({
          where: { id: goal.id },
          data: {
            currentProgress: newProgress,
            status: goalStatus,
          },
        });

        if (goalStatus === 'achieved') {
          await this.prisma.notification.create({
            data: {
              userId,
              type: 'goal',
              title: 'Goal Achieved! 🎉',
              message: `Congratulations! Your Kanban completion helped you achieve your carbon goal of ${goal.targetReduction} kg reduction!`,
            },
          });
        }
      }
    }

    return updated;
  }

  async removeInsight(userId: string, insightId: string) {
    const insight = await this.prisma.insight.findFirst({
      where: { id: insightId, userId },
    });

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    await this.prisma.insight.delete({
      where: { id: insightId },
    });

    return { message: 'Insight removed successfully' };
  }
}
