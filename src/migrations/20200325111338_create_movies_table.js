
exports.up = function(knex) {
  return knex.schema.createTable('movies', function (table) {
    table.increments('id');
    table.integer('moviedb_id').unique();
    table.string('title').defaultTo(null);
    table.text('overview').defaultTo(null);
    table.string('poster').defaultTo(null);
    table.string('video_path');
    table.string('poster_backdrop').defaultTo(null);
    table.integer('year').defaultTo(null);
    table.string('trailer').defaultTo(null);
    table.float('rating').defaultTo(null);
    table.integer('duration').defaultTo(null);
    table.enu('favourite', ['y', 'n']).defaultTo('n');
    table.enu('watchlist', ['y', 'n']).defaultTo('n');
    table.enu('watched', ['y', 'n']).defaultTo('n');
    table.json('cast').defaultTo(null);
    table.json('genres').defaultTo(null);
    table.json('moviedb').defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('movies')
};
