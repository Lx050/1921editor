import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddArticleRolesAndUserStatus1734865000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update User table
        await queryRunner.addColumns("users", [
            new TableColumn({
                name: "lastLoginAt",
                type: "timestamp",
                isNullable: true,
            }),
            new TableColumn({
                name: "isActive",
                type: "boolean",
                default: true,
            }),
        ]);

        // Update Articles table
        await queryRunner.addColumns("articles", [
            new TableColumn({
                name: "planners",
                type: "jsonb",
                isNullable: true,
                default: "'[]'",
            }),
            new TableColumn({
                name: "copywriters",
                type: "jsonb",
                isNullable: true,
                default: "'[]'",
            }),
            new TableColumn({
                name: "editors",
                type: "jsonb",
                isNullable: true,
                default: "'[]'",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("articles", "planners");
        await queryRunner.dropColumn("articles", "copywriters");
        await queryRunner.dropColumn("articles", "editors");
        await queryRunner.dropColumn("users", "lastLoginAt");
        await queryRunner.dropColumn("users", "isActive");
    }
}
