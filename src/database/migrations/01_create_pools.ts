import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pools', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('pools');
}
