
const config = require('./knexfile');
let Knex = null;


function initialize() {
  return require('knex')(config);
}


module.exports.knex = function() {
  if (!Knex) {
    Knex = initialize();
  }

  return Knex;
}



