import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('candidates', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.integer('votes');
    table.string('image').notNullable();
    table.string('short_description').notNullable();
    table.string('description').notNullable();
    table
      .uuid('pool_id')
      .notNullable()
      .references('id')
      .inTable('pools')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('candidates');
}
