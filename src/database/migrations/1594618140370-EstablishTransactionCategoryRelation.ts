import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class EstablishTransactionCategoryRelation1594618140370
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create new Column
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // create category_id foreign relation
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // undo column creation
    await queryRunner.dropColumn('transactions', 'category_id');

    // undo foreign key
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
  }
}
