import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

const transportWeights: Record<string, number> = {
  car_petrol: 2400,
  car_diesel: 2200,
  car_electric: 700,
  bus: 500,
  train: 150,
  bike_walk: 0,
};

const dietWeights: Record<string, number> = {
  meat_daily: 3300,
  meat_occasional: 2000,
  pescatarian: 1400,
  vegetarian: 1100,
  vegan: 700,
};

const homeWeights: Record<string, number> = {
  coal_gas: 3000,
  mixed: 1500,
  renewable: 300,
};

const flightWeights: Record<string, number> = {
  none: 0,
  few: 900,
  medium: 2500,
  high: 5000,
};

const shoppingWeights: Record<string, number> = {
  daily: 1200,
  weekly: 800,
  monthly: 400,
  rarely: 100,
};

const GLOBAL_AVERAGE = 4700;

@Injectable()
export class CarbonService {
  constructor(private prisma: PrismaService) {}

  async calculateBaseline(dto: any) {
    const transport = dto.transport || 'bike_walk';
    const diet = dto.diet || 'vegan';
    const home = dto.home || 'renewable';
    const flights = dto.flights || 'none';
    const shopping = dto.shopping || 'rarely';

    const transportScore = transportWeights[transport] ?? 0;
    const dietScore = dietWeights[diet] ?? 0;
    const homeScore = homeWeights[home] ?? 0;
    const flightScore = flightWeights[flights] ?? 0;
    const shoppingScore = shoppingWeights[shopping] ?? 0;

    const annualTotal = transportScore + dietScore + homeScore + flightScore + shoppingScore;

    // Calculate global percentile: lower score is better (higher percentile)
    let globalPercentile = 50;
    if (annualTotal < 2000) {
      globalPercentile = 85;
    } else if (annualTotal < 3500) {
      globalPercentile = 70;
    } else if (annualTotal < GLOBAL_AVERAGE) {
      globalPercentile = 60;
    } else if (annualTotal === GLOBAL_AVERAGE) {
      globalPercentile = 50;
    } else if (annualTotal < 7000) {
      globalPercentile = 35;
    } else if (annualTotal < 10000) {
      globalPercentile = 20;
    } else {
      globalPercentile = 10;
    }

    return {
      transportScore,
      dietScore,
      homeScore,
      flightScore,
      shoppingScore,
      annualTotal,
      globalPercentile,
    };
  }

  async saveOnboarding(userId: string, dto: any) {
    const scores = await this.calculateBaseline(dto);

    const profile = await this.prisma.carbonProfile.upsert({
      where: { userId },
      update: {
        transportScore: scores.transportScore,
        dietScore: scores.dietScore,
        homeScore: scores.homeScore,
        flightScore: scores.flightScore,
        shoppingScore: scores.shoppingScore,
        annualTotal: scores.annualTotal,
        globalPercentile: scores.globalPercentile,
      },
      create: {
        userId,
        transportScore: scores.transportScore,
        dietScore: scores.dietScore,
        homeScore: scores.homeScore,
        flightScore: scores.flightScore,
        shoppingScore: scores.shoppingScore,
        annualTotal: scores.annualTotal,
        globalPercentile: scores.globalPercentile,
      },
    });

    // Add activity log
    await this.prisma.activityLog.create({
      data: {
        userId,
        event: 'COMPLETED_ONBOARDING_QUIZ',
      },
    });

    return profile;
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.carbonProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Carbon profile not found. Please complete onboarding.');
    }

    return profile;
  }

  async getHistory(userId: string) {
    // Return logs grouped by day for charts
    const logs = await this.prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'asc' },
    });

    return logs;
  }
}
