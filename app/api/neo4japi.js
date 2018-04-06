const config = require("../config/config")

const neo4j = require('neo4j-driver').v1;
var _ = require("lodash");
const Uv = require("../models/uv");

const driver = neo4j.driver("bolt://neo4j:" + config.neo4j.port, neo4j.auth.basic( config.neo4j.user, config.neo4j.password));

function getUvs() {
  var session = driver.session();
  return session
    .run(
      "MATCH (uv: UV) RETURN uv")
    .then(result => {
      session.close();

      return res = result.records.map(record => {
        return new Uv(record.get('uv').properties);
      })

    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function getGraphBranches(filter) {

  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r]->(uv) WHERE uv.type IN {types} AND left(r.GX,2) IN {branches} RETURN count(r), r.GX,uv",
      filter)
    .then(result => {
      session.close();
      var nodes = [];
      var edges = [];

      var genie = {};
      var uv = {};

      var length = 0;
      result.records.map(record => {
        if ( genie[record.get('r.GX')] === undefined ){
          genie[record.get('r.GX')] = length;
          nodes.push( {id: length, "label": record.get('r.GX'), "group": 1} )
          length = nodes.length;
        }
      })
      result.records.map(record => {
        if ( uv[record.get('uv').properties.code] === undefined){
          nodes.push( {id: length, "label": record.get('uv').properties.code, "group": 2} )
          edges.push( {"from": length, "to": genie[record.get('r.GX')] } )
          uv[record.get('uv').properties.code] = length;
        } else {
          edges.push( {"from": uv[record.get('uv').properties.code], "to": genie[record.get('r.GX')] } )
        }
        length = nodes.length;
      })
      return {nodes: nodes, edges: edges}
    })
    .catch(error => {
      session.close();
      throw error;
    });
}


exports.getUvs = getUvs;
exports.getGraphBranches = getGraphBranches;
