let Tags = [
  {id:1,label: 'all'},
  {id:2,label: 'horror'},
  {id:3,label: 'thriller'},
  {id:4,label: 'comedy'},
  {id:5,label: 'Title'},
  {id:6,label: 'Favourites'}
];



module.exports.getTags = function () {
  return Tags;
}

module.exports.saveTag = function (tag) {
  Tags.push({
    id: Date.now(),
    label: tag
  });
}

module.exports.eTag = function (tag) {
  Tags.push({
    id: Date.now(),
    label: tag
  });
}
