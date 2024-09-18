import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('wallets').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('wallets', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id');
        table.string('name', 255).notNullable();
        table.decimal('balance', 10, 2).notNullable().defaultTo(0.0);
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('wallets');
}
