import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class EstablishTransactionCategoryRelation1594618140370
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // create category_id foreign relation
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
  }
}
