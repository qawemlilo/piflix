// Update with your config settings.
const path = require('path');
const config = require('./config');

module.exports = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.join(config.STORAGE_ROOT, 'movies.sqlite3')
  },
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
}
