import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class EstablishTransactionCategoryRelation1594618140370
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create category_id foreign relation
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'transactions',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
  }
}
