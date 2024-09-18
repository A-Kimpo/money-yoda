import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable().defaultTo('');
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamp('date_added').defaultTo(knex.fn.now());
    table.timestamp('date_modified').defaultTo(knex.fn.now());
    table.boolean('is_admin').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
