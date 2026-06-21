import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        country: true,
        timezone: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: any) {
    const { name, avatar, country, timezone } = dto;
    
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatar,
        country,
        timezone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        country: true,
        timezone: true,
      },
    });

    return updatedUser;
  }

  async updateSettings(userId: string, dto: any) {
    const { theme, notificationEnabled, publicProfile, measurementSystem } = dto;

    const updatedPref = await this.prisma.userPreference.update({
      where: { userId },
      data: {
        theme,
        notificationEnabled,
        publicProfile,
        measurementSystem,
      },
    });

    return updatedPref;
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }
}
