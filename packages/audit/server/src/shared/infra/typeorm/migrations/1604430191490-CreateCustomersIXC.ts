import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomersIXC1604430191490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers_ixc',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'ixc_id',
            type: 'varchar',
          },
          {
            name: 'ixc_name',
            type: 'varchar',
          },
          {
            name: 'conta_azul_name',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'bool',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customers_ixc');
  }
}
