import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard() {
    const currentWeek = this.getWeekString();

    const entries = await this.prisma.leaderboardEntry.findMany({
      where: { week: currentWeek },
      orderBy: { greenScore: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            country: true,
          },
        },
      },
    });

    // Map rankings with indices
    return entries.map((entry, index) => ({
      id: entry.id,
      userId: entry.userId,
      greenScore: entry.greenScore,
      rank: index + 1,
      week: entry.week,
      user: entry.user,
    }));
  }

  async getMyRank(userId: string) {
    const currentWeek = this.getWeekString();
    
    // Ensure entry exists for current user
    let myEntry = await this.prisma.leaderboardEntry.findFirst({
      where: { userId, week: currentWeek },
    });

    if (!myEntry) {
      myEntry = await this.prisma.leaderboardEntry.create({
        data: {
          userId,
          greenScore: 0,
          week: currentWeek,
        },
      });
    }

    const leaderboard = await this.getLeaderboard();
    const myRankedEntry = leaderboard.find((item) => item.userId === userId);

    return myRankedEntry || {
      id: myEntry.id,
      userId,
      greenScore: 0,
      rank: leaderboard.length + 1,
      week: currentWeek,
    };
  }

  private getWeekString() {
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  }
}
