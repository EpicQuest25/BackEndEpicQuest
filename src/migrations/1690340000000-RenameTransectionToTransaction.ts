import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTransectionToTransaction1690340000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename the table
    await queryRunner.query(`ALTER TABLE "transections" RENAME TO "transactions"`);
    
    // Rename the column
    await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "transectionId" TO "transactionId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes if needed
    await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "transactionId" TO "transectionId"`);
    await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "transections"`);
  }
}