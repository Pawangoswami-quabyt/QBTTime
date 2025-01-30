import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTimeEntries1701261700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'time_entries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'start_time',
            type: 'time',
          },
          {
            name: 'end_time',
            type: 'time',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'project',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'submitted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'user_id',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'time_entries',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('time_entries');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    await queryRunner.dropForeignKey('time_entries', foreignKey);
    await queryRunner.dropTable('time_entries');
  }
}
