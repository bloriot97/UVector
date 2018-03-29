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

Uv.getUvs = function(offset, limit, callback){
  /*
    TODO implémenter User.getUsers
  */
  callback(null, new Uv({}));
}

Uv.prototype.data = {}

module.exports = Uv;
