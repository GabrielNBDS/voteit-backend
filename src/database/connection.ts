import knex from 'knex';
// import path from 'path';

/* const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
  },
  useNullAsDefault: true,
}); */

const connection = knex({
  client: 'pg',
  connection:
    'postgres://postgres:d41d8cd98f00b204e9800998ecf8427e@localhost:35432/voteit',
});

export default connection;
