import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async resetDatabase() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Disable FK checks so we can truncate in any order
      await queryRunner.query('SET session_replication_role = replica');

      // Get all user-defined tables in the public schema
      const tables: { tablename: string }[] = await queryRunner.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
      );

      for (const { tablename } of tables) {
        await queryRunner.query(`TRUNCATE TABLE "${tablename}" CASCADE`);
      }

      // Re-enable FK checks
      await queryRunner.query('SET session_replication_role = DEFAULT');

      return `✅ Database wiped. ${tables.length} table(s) truncated: ${tables.map((t) => t.tablename).join(', ')}`;
    } finally {
      await queryRunner.release();
    }
  }
}
