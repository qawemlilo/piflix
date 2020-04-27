"use strict";

const crypto = require("crypto");

module.exports.create = function () {
  const uuid = crypto.randomBytes(3*4).toString('base64');

  return uuid;
}

