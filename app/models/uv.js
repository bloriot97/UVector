var schemas = require("../schemas/schemas.js");
var _ = require("lodash");


var Uv = function (data) {
  this.data = this.sanitize(data);
}

Uv.prototype.sanitize = function (data) {
  data = data || {};
  schema = schemas.uv;
  return _.pick(_.defaults(data, schema), _.keys(schema));
}

Uv.prototype.data = {}

module.exports = Uv;
