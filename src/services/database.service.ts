import { PrismaClient } from '@prisma/client';

class DatabaseService extends PrismaClient {
  [x: string]: any;
  private static instance: DatabaseService;

  private constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  public static getInstance(): DatabaseService {
    if (!this.instance) {
      this.instance = new DatabaseService();
    }
    return this.instance;
  }
}

export const databaseService = DatabaseService.getInstance();
