/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
  return knex.schema.createTable('movies', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.boolean('watched').defaultTo(false);
      table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('movies');
};