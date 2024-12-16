import { Course, User } from '@prisma/client';
import prisma from '../../../../config/db/prisma';
import { redisService } from '../../../../libs/utils/services/redis';

interface CourseRecommendation {
  courseId: string;
  score: number;
}

export class RecommendationEngine {
  private static CACHE_EXPIRATION = 24 * 60 * 60; // 24 hours

  async generateRecommendations(userId: string): Promise<Course[]> {
    // Check cache first
    const cachedRecommendations = await this.getCachedRecommendations(userId);
    if (cachedRecommendations) {
      return cachedRecommendations;
    }

    // 1. Fetch user's completed courses
    const userCourses = await this.getUserCompletedCourses(userId);

    // 2. Collaborative Filtering
    const collaborativeRecommendations = await this.collaborativeFiltering(userId, userCourses);

    // 3. Content-Based Filtering
    const contentBasedRecommendations = await this.contentBasedFiltering(userCourses);

    // 4. Combine and rank recommendations
    const combinedRecommendations = this.combineRecommendations(
      collaborativeRecommendations,
      contentBasedRecommendations
    );

    // Cache recommendations
    await this.cacheRecommendations(userId, combinedRecommendations);

    return combinedRecommendations;
  }

  private async getCachedRecommendations(userId: string): Promise<Course[] | null> {
    const cachedRecommendations = await redisService.get(`recommendations:${userId}`);
    return cachedRecommendations ? JSON.parse(cachedRecommendations) : null;
  }

  private async cacheRecommendations(userId: string, recommendations: Course[]): Promise<void> {
    await redisService.set(
      `recommendations:${userId}`,
      JSON.stringify(recommendations),
    );
  }

  private async getUserCompletedCourses(userId: string): Promise<Course[]> {
    return await prisma.course.findMany({
      where: {
        userId: userId,
        completed: true
      }
    });
  }

  private async collaborativeFiltering(userId: string, userCourses: Course[]): Promise<Course[]> {
    // Check if user is new (no completed courses)
    if (userCourses.length === 0) {
      return this.getPopularCourses();
    }

    // Find users who have completed similar courses
    const similarUserIds = await this.findSimilarUsers(userId, userCourses);

    // If no similar users found, fall back to popular courses
    if (similarUserIds.length === 0) {
      return this.getPopularCourses();
    }

    // Get courses completed by similar users that the current user hasn't taken
    const recommendedCourses = await prisma.course.findMany({
      where: {
        userId: { in: similarUserIds },
        id: { notIn: userCourses.map(course => course.id) }
      },
      take: 10 // Limit recommendations
    });

    // If not enough recommendations, supplement with popular courses
    if (recommendedCourses.length < 10) {
      const popularCourses = await this.getPopularCourses();
      return [
        ...recommendedCourses,
        ...popularCourses.slice(0, 10 - recommendedCourses.length)
      ];
    }

    return recommendedCourses;
  }

  private async findSimilarUsers(userId: string, userCourses: Course[]): Promise<string[]> {
    // Find users with overlapping course completions
    const courseIds = userCourses.map(course => course.id);

    const similarUsers = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
        completed: true
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    return similarUsers
      .map(user => user.userId)
      .filter(id => id !== userId); // Exclude current user
  }

  private async contentBasedFiltering(userCourses: Course[]): Promise<Course[]> {
    // Recommend courses based on similar categories, difficulty levels, etc.
    const categories = [...new Set(userCourses.map(course => course.category))];
    const difficultyLevels = [...new Set(userCourses.map(course => course.difficultyLevel))];

    const recommendedCourses = await prisma.course.findMany({
      where: {
        OR: [
          { category: { in: categories as string[] } },
          { difficultyLevel: { in: difficultyLevels as string[] } }
        ],
        id: { notIn: userCourses.map(course => course.id) }
      },
      take: 10 // Limit recommendations
    });

    return recommendedCourses;
  }

  private async getPopularCourses(): Promise<Course[]> {
    try {
      // Fetch courses with the most completions using Prisma
      const popularCourses = await prisma.course.findMany({
        where: {
          completed: true
        },
        include: {
          user: true
        },
        orderBy: {
          user: {
            email: 'desc'
          }
        },
        take: 20
      });

      return popularCourses;
    } catch (error) {
      console.error('Error fetching popular courses:', error);
      return []; // Return empty array if there's an error
    }
  }

  private combineRecommendations(collaborative: Course[], contentBased: Course[]): Course[] {
    // Combine recommendations, remove duplicates, and rank
    const combinedRecommendations = new Map<string, Course>();

    // Add collaborative recommendations with higher initial score
    collaborative.forEach(course => {
      combinedRecommendations.set(course.id, { ...course });
    });

    // Add content-based recommendations with lower initial score
    contentBased.forEach(course => {
      if (!combinedRecommendations.has(course.id)) {
        combinedRecommendations.set(course.id, { ...course });
      }
    });

    // Convert to sorted array
    return Array.from(combinedRecommendations.values())
  }
}