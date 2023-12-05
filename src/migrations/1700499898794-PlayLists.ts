import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class PlayLists1700499898794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'playlists',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'name', type: 'varchar(55)', isNullable: false },
                    { name: 'type', type: 'varchar(20)', isNullable: false },
                    { name: 'list_id', type: 'integer', isNullable: false },
                    {name: 'contents', type: 'json', isNullable: true},
                    {name: 'user_id', type: 'integer', isNullable: false},
                    { name: 'created_at', type: 'timestamp', default: 'now()' },
                    { name: 'updated_at', type: 'timestamp', default: 'now()' },
                ],
            }),
        )

        await queryRunner.createForeignKey(
            'playlists',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('playlists', 'FK_user_id');
        await queryRunner.dropTable('playlists');
    }
}
