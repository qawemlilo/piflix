
"use strict";

const fs = require('fs');
const knex = require('../db.connection').knex();
const {STORAGE_ROOT, DB_PATH} = require('../config');

module.exports.appFolderExists = function () {
  return fs.existsSync(STORAGE_ROOT);
}

module.exports.createAppFolder = function () {
  fs.mkdirSync(STORAGE_ROOT);
}

module.exports.dbExists = async function () {
  return fs.existsSync(DB_PATH) && await knex.schema.hasTable('movies');
}



module.exports.migrate = async function () {
  return await knex.migrate.latest();
}



