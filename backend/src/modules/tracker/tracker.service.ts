import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TrackerService {
  constructor(private prisma: PrismaService) {}

  async logAction(userId: string, dto: any) {
    const { actionType, category, co2Delta } = dto;
    if (!actionType || !category || co2Delta === undefined) {
      throw new BadRequestException('actionType, category, and co2Delta are required');
    }

    // 1. Create the DailyLog
    const log = await this.prisma.dailyLog.create({
      data: {
        userId,
        actionType,
        category,
        co2Delta: parseFloat(co2Delta),
      },
    });

    // 1.5 Update the user's CarbonProfile annualTotal and specific category score
    let categoryField = category.toLowerCase() + 'Score';
    if (category.toLowerCase() === 'travel') categoryField = 'flightScore';

    const updateData: any = {
      annualTotal: {
        increment: parseFloat(co2Delta),
      },
    };

    if (['transportScore', 'dietScore', 'homeScore', 'flightScore', 'shoppingScore'].includes(categoryField)) {
      updateData[categoryField] = {
        increment: parseFloat(co2Delta),
      };
    }

    await this.prisma.carbonProfile.update({
      where: { userId },
      data: updateData,
    });

    // 2. Re-evaluate streaks (Daily active streak increases when today is net-negative)
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = this.getYesterdayString();

    // Fetch all logs for today to compute daily sum
    const todayLogs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: new Date(todayStr),
        },
      },
    });

    const dailySum = todayLogs.reduce((sum, item) => sum + item.co2Delta, 0);

    let streakUpdated = false;
    let currentStreak = 0;
    let bestStreak = 0;

    // If today is net-saving (net-negative carbon logs)
    if (dailySum < 0) {
      const userStreak = await this.prisma.streak.findUnique({ where: { userId } });
      if (userStreak) {
        currentStreak = userStreak.currentStreak;
        bestStreak = userStreak.bestStreak;

        if (userStreak.lastLoggedDay === yesterdayStr) {
          // Logged yesterday, increment streak
          currentStreak += 1;
          streakUpdated = true;
        } else if (userStreak.lastLoggedDay === todayStr) {
          // Already logged today, streak remains same
          streakUpdated = false;
        } else {
          // Reset streak to 1
          currentStreak = 1;
          streakUpdated = true;
        }

        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }

        if (streakUpdated || !userStreak.lastLoggedDay) {
          await this.prisma.streak.update({
            where: { userId },
            data: {
              currentStreak,
              bestStreak,
              lastLoggedDay: todayStr,
            },
          });
        }
      }
    }

    // 3. Update Weekly Leaderboard Entry
    // Cumulative saved is the negative of dailyLog co2Delta (if it saves carbon)
    if (co2Delta < 0) {
      const currentWeek = this.getWeekString();
      const savedAmount = Math.abs(co2Delta);

      await this.prisma.leaderboardEntry.upsert({
        where: {
          userId_week: {
            userId,
            week: currentWeek,
          },
        },
        update: {
          greenScore: {
            increment: savedAmount,
          },
        },
        create: {
          userId,
          greenScore: savedAmount,
          week: currentWeek,
        },
      });
    }

    // 4. Evaluate and award badges
    const newlyUnlockedBadges = await this.evaluateBadges(userId, currentStreak);

    return {
      log,
      currentStreak,
      bestStreak,
      newlyUnlockedBadges,
    };
  }

  async getLogs(userId: string) {
    return this.prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      take: 50,
    });
  }

  async getStreak(userId: string) {
    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    });
    if (!streak) {
      return { currentStreak: 0, bestStreak: 0, lastLoggedDay: null };
    }
    return streak;
  }

  async getBadges(userId: string) {
    // Return all badges, with a flag indicating if unlocked by user
    const allBadges = await this.prisma.badge.findMany();
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
    });

    const unlockedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

    return allBadges.map((badge) => ({
      ...badge,
      unlocked: unlockedBadgeIds.has(badge.id),
      earnedAt: userBadges.find((ub) => ub.badgeId === badge.id)?.earnedAt || null,
    }));
  }

  private async evaluateBadges(userId: string, currentStreak: number) {
    const newlyUnlocked: any[] = [];
    const allBadges = await this.prisma.badge.findMany();
    const existingUserBadges = await this.prisma.userBadge.findMany({
      where: { userId },
    });
    const existingBadgeIds = new Set(existingUserBadges.map((ub) => ub.badgeId));

    const totalLogsCount = await this.prisma.dailyLog.count({ where: { userId } });

    // Calculate total carbon saved (sum of all negative deltas)
    const savingsAggregate = await this.prisma.dailyLog.aggregate({
      where: {
        userId,
        co2Delta: { lt: 0 },
      },
      _sum: {
        co2Delta: true,
      },
    });
    const totalSavedKg = Math.abs(savingsAggregate._sum.co2Delta || 0);

    for (const badge of allBadges) {
      if (existingBadgeIds.has(badge.id)) continue;

      let shouldUnlock = false;

      if (badge.condition === 'first_log' && totalLogsCount >= 1) {
        shouldUnlock = true;
      } else if (badge.condition === 'seven_day_streak' && currentStreak >= 7) {
        shouldUnlock = true;
      } else if (badge.condition === 'one_ton_saved' && totalSavedKg >= 1000) {
        shouldUnlock = true;
      } else if (badge.condition === 'flight_free_month') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const flightLogs = await this.prisma.dailyLog.count({
          where: {
            userId,
            actionType: { contains: 'flight' },
            loggedAt: { gte: thirtyDaysAgo },
          },
        });
        
        // If no flights logged in last 30 days and user logged something in this period
        if (flightLogs === 0 && totalLogsCount >= 5) {
          shouldUnlock = true;
        }
      } else if (badge.condition === 'vegan_week') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const meatLogs = await this.prisma.dailyLog.count({
          where: {
            userId,
            actionType: { contains: 'red meat' },
            loggedAt: { gte: sevenDaysAgo },
          },
        });

        const plantLogs = await this.prisma.dailyLog.count({
          where: {
            userId,
            actionType: { contains: 'plant-based meal' },
            loggedAt: { gte: sevenDaysAgo },
          },
        });

        if (meatLogs === 0 && plantLogs >= 7) {
          shouldUnlock = true;
        }
      }

      if (shouldUnlock) {
        await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });

        // Send notification
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'badge',
            title: `Badge Unlocked: ${badge.title} ${badge.icon}`,
            message: `Congratulations! You unlocked the "${badge.title}" badge: ${badge.description}`,
          },
        });

        newlyUnlocked.push(badge);
      }
    }

    return newlyUnlocked;
  }

  private getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  private getWeekString() {
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  }
}
