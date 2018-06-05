var schemas = require("../schemas/schemas.js");
var _ = require("lodash");


var Uv = function (data) {
  this.data = this.sanitize(data);
}

Uv.prototype.sanitize = function (data) {
  data = data || {};
  schema = schemas.uv;
  let saison = {};
  data.saison.forEach( (prop) => {
    let tab = prop.split(":");
    saison[tab[0]] = parseFloat(tab[1]);
  })
  data.saison = _.pick(_.defaults(saison, {A:0, P:0}), ["A", "P"]);
  return _.pick(_.defaults(data, schema), _.keys(schema));
}

Uv.prototype.data = {}

module.exports = Uv;
