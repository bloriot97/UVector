var express = require('express'),
    router = express.Router();

var Uv = require('../models/uv');

var config = require("../config/config");

var neo4japi = require("../api/neo4japi");

router.get("/", function(req, res) {
  res.status(200).send("API");
});

/*
paggination middleware
*/
var getOffsetLimit = function (req, res, next){
  var limit = +(req.query.limit || config.query.limit);
  var offset = (req.query.page || 0) * limit;
  if ( !isNaN(limit) && !isNaN(offset) ){
    if ( limit < 1 ){
      limit = config.query.limit;
    } else if (limit > config.query.max_limit ) {
      limit = config.query.max_limit;
    }
    if ( offset < 0 ){
      offset = 0;;
    }
  } else {
    return res.status(400).send("bad request");
  }
  req.query.limit = limit;
  req.query.offset = offset;

  next();
}

router.get("/uvs", getOffsetLimit, function(req, res) {
  neo4japi.getUvs().then( uvs => {
      if (!uvs) return;
      return res.json( uvs );
    }
  )

});


module.exports = router;
