import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class Favorites1700935325883 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'favorites',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {name: 'contents', type: 'json', isNullable: false},
                    {name: 'user_id', type: 'integer', isNullable: false},
                    { name: 'created_at', type: 'timestamp', default: 'now()' },
                    { name: 'updated_at', type: 'timestamp', default: 'now()' },
                ],
            }),
        )

        await queryRunner.createForeignKey(
            'favorites',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('favorites', 'FK_user_id');
        await queryRunner.dropTable('favorites');
    }

}
