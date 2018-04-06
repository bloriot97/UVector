var express = require('express'),
    router = express.Router();

var _ = require('lodash');

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

router.get("/graphs/branches", function(req, res) {

  if (req.filter === undefined) {
    req.filter = {} ;
  }

  if ( req.query.types !== undefined ){
    req.filter.types = _.intersection(_.split(req.query.types, ','), config.types);
  } else {
    req.filter.types = config.types;
  }
  if ( req.query.branches !== undefined ){
    req.filter.branches = _.intersection( _.split(req.query.branches, ','), config.branches);
  } else {
    req.filter.branches = config.branches;
  }

  neo4japi.getGraphBranches(req.filter).then( graph => {
      if (!graph) return;
      return res.json( graph );
    }
  )
});


module.exports = router;
