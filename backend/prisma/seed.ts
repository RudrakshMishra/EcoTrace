import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = dbUrl.replace('file:', '');

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Badges
  const badges = [
    {
      title: 'First Log',
      description: 'Unlocked by logging your very first daily green or carbon action',
      icon: '🌱',
      condition: 'first_log',
    },
    {
      title: '7-Day Streak',
      description: 'Unlocked by logging daily active savings for 7 consecutive days',
      icon: '⚡',
      condition: 'seven_day_streak',
    },
    {
      title: '1 Ton Saved',
      description: 'Unlocked by achieving a total carbon saving of 1,000 kg',
      icon: '🌍',
      condition: 'one_ton_saved',
    },
    {
      title: 'Flight-Free Month',
      description: 'Unlocked by keeping your logs flight-free for a full month',
      icon: '✈️',
      condition: 'flight_free_month',
    },
    {
      title: 'Vegan Week',
      description: 'Unlocked by logging 7 plant-based meals and no red meat in a week',
      icon: '🥗',
      condition: 'vegan_week',
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { title: badge.title },
      update: {},
      create: badge,
    });
  }
  console.log('Badges seeded.');

  // 2. Seed Mock Users
  const mockUsers = [
    {
      name: 'Emma Green',
      email: 'emma@ecotrace.org',
      country: 'Germany',
      timezone: 'Europe/Berlin',
      annualTotal: 1800,
      greenScore: 420,
      streak: 12,
    },
    {
      name: 'Alex Rivera',
      email: 'alex@ecotrace.org',
      country: 'United States',
      timezone: 'America/New_York',
      annualTotal: 3400,
      greenScore: 280,
      streak: 5,
    },
    {
      name: 'Chloe Sinclair',
      email: 'chloe@ecotrace.org',
      country: 'United Kingdom',
      timezone: 'Europe/London',
      annualTotal: 1100,
      greenScore: 510,
      streak: 18,
    },
    {
      name: 'Kenji Sato',
      email: 'kenji@ecotrace.org',
      country: 'Japan',
      timezone: 'Asia/Tokyo',
      annualTotal: 4600,
      greenScore: 190,
      streak: 3,
    },
    {
      name: 'Marcus Vance',
      email: 'marcus@ecotrace.org',
      country: 'Canada',
      timezone: 'America/Toronto',
      annualTotal: 6200,
      greenScore: 85,
      streak: 1,
    },
  ];

  const defaultPasswordHash = await bcrypt.hash('EcoTrace123!', 10);
  const currentWeek = getWeekString();

  for (const mock of mockUsers) {
    const user = await prisma.user.upsert({
      where: { email: mock.email },
      update: {},
      create: {
        name: mock.name,
        email: mock.email,
        passwordHash: defaultPasswordHash,
        country: mock.country,
        timezone: mock.timezone,
        emailVerified: true,
        preferences: {
          create: {
            theme: 'dark',
            notificationEnabled: true,
            publicProfile: true,
            measurementSystem: 'metric',
          },
        },
        carbonProfile: {
          create: {
            transportScore: mock.annualTotal * 0.3,
            dietScore: mock.annualTotal * 0.25,
            homeScore: mock.annualTotal * 0.25,
            flightScore: mock.annualTotal * 0.1,
            shoppingScore: mock.annualTotal * 0.1,
            annualTotal: mock.annualTotal,
            globalPercentile: mock.annualTotal < 2000 ? 85 : mock.annualTotal < 5000 ? 55 : 25,
          },
        },
        streak: {
          create: {
            currentStreak: mock.streak,
            bestStreak: mock.streak + 5,
            lastLoggedDay: getYesterdayString(),
          },
        },
      },
    });

    // Seed Leaderboard entry for current week
    await prisma.leaderboardEntry.upsert({
      where: {
        userId_week: {
          userId: user.id,
          week: currentWeek,
        },
      },
      update: {
        greenScore: mock.greenScore,
      },
      create: {
        userId: user.id,
        greenScore: mock.greenScore,
        week: currentWeek,
      },
    });
  }

  console.log('Mock users and leaderboard entries seeded.');
  console.log('Database seeding complete!');
}

function getWeekString() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

function getYesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
