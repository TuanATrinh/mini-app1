module.exports = {
  development: {
      client: 'pg',
      connection: {
          user: 'username',
          password: 'password',
          database: 'movie_database',
          host: 'localhost',
      },
      migrations: {
          tableName: 'knex_migrations',
      },
  },
};
