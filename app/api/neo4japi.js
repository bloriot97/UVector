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

function getUserUvs(userid) {
  var session = driver.session();
  console.log(userid)
  return session
    .run("MATCH (p:Person {id:'" + userid +"'})-[r:SUIT]->(uv:UV) RETURN r.GX,r.codeSemestre,uv.code")
    .then(result => {
      session.close();
      return res = result.records.map(record => {
        return {uv :record.get('uv.code'), gx: record.get('r.GX'), semestre: record.get('r.codeSemestre')} ;
      })
    })
    .catch(error => {
      session.close();
      console.log(error)
      throw error;
    });
}

function getGraphBranches(filter) {

  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r]->(uv) WHERE uv.degree > 5 AND uv.type IN {types} AND left(r.GX,2) IN {branches} RETURN count(r), r.GX,uv",
      filter)
    .then(result => {
      session.close();
      var nodes = [];
      var edges = [];

      var genie = {};
      var uv = {};

      var groupe = {'TC': 1, 'IM': 2, 'GU': 3, 'GB': 4, 'GI': 5, 'GP': 6, 'GX': 0}

      var length = 0;
      result.records.map(record => {
        var gx = record.get('r.GX');
        if ( gx.substring(0,3) == 'GSU' ){
          gx = "GU" + gx.substring(3,5)
        }
        if ( gx.substring(0,3) == 'GSM' ){
          gx = "IM" + gx.substring(3,5)
        }
        if ( gx.substring(0,2) == 'GM' ){
          gx = "IM" + gx.substring(2,4)
        }

        if ( genie[gx] === undefined ){
          genie[gx] = length;

          var n = _.indexOf(config.branches, gx.substring(0,2) )
          var k = parseInt(gx.substring(gx.length-1,gx.length))

          var x_coord = 0
          var y_coord = 0
          if (  gx.substring(0,2) == "TC" ){
            x_coord = 0
            y_coord = k * 300

          } else {
            size = k * 300 + 300
            x_coord = -Math.cos((n-1)/(4) * 3.14) * size
            y_coord = -Math.sin((n-1)/(4) * 3.14) * size

          }
          nodes.push( {id: length, "label": gx, "group": groupe[gx.substring(0,2)], x:x_coord, y:y_coord, fixed: true, size: 50 } )


          length = nodes.length;
        }
      })
      result.records.map(record => {
        var gx = record.get('r.GX');
        if ( gx.substring(0,3) == 'GSU' ){
          gx = "GU" + gx.substring(3,5)
        }
        if ( gx.substring(0,3) == 'GSM' ){
          gx = "IM" + gx.substring(3,5)
        }
        if ( gx.substring(0,2) == 'GM' ){
          gx = "IM" + gx.substring(2,4)
        }

        if ( uv[record.get('uv').properties.code] === undefined){
          nodes.push( {id: length, "label": record.get('uv').properties.code, "group": groupe[record.get('uv').properties.branche]} )
          edges.push( {"from": length, "to": genie[gx], value: record.get("count(r)").low} )
          uv[record.get('uv').properties.code] = length;
        } else {
          edges.push( {"from": uv[record.get('uv').properties.code], "to": genie[gx], value: record.get("count(r)").low} )
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
exports.getUserUvs = getUserUvs;
