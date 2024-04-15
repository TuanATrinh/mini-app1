/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('movies').del()
      .then(function () {
          // Inserts seed entries
          return knex('movies').insert([
              { title: 'Mean Girls' },
              { title: 'Hackers' },
              { title: 'The Grey' },
              { title: 'Sunshine' },
              { title: 'Ex Machina' },
          ]);
      });
};

