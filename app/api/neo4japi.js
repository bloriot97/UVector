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
        return new Uv(record.get('uv').properties).data;
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

function getUv(code) {
  var session = driver.session();
  return session
    .run(
      "MATCH (uv: UV {code:\"" + code + "\" }) RETURN uv")
    .then(result => {
      session.close();
      return res = new Uv(result.records[0].get('uv').properties).data;


    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function getUvAttendance(code) {
  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r:SUIT]->(uv:UV {code : {code}}) WHERE left(r.GX,2) in ['TC','GI','IM','GU','GB','GP'] WITH r as r, LEFT(r.GX, 2) as GX, uv AS uv WITH [GX,toFloat(count(GX)) / uv.degree] as cnt return collect(cnt) as attendance",
    {code: code})
    .then(result => {
      session.close();
      res = {}
      result.records[0].get("attendance").map( attendance => {
        res[attendance[0]] = attendance[1];
      });

      return res;
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function getSemestresAttendance(semestre, uv_type, limit) {
  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r:SUIT {GX: {semestre} }]->(uv:UV) WHERE uv.type in {uv_type} WITH uv.code as code, count(r) as cnt ORDER BY cnt DESC LIMIT {limit} WITH collect([code, toFloat(cnt)]) as collection RETURN collection as attendance",
    {
      semestre: semestre,
      uv_type: uv_type,
      limit: limit
    })
    .then(result => {
      session.close();
      res = {}
      result.records[0].get("attendance").map( attendance => {
        res[attendance[0]] = attendance[1];
      });

      return res;
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
      "MATCH ()-[r]->(uv) WHERE uv.degree > 5 AND uv.type IN {types} AND left(r.GX,2) IN {branches} RETURN count(r), r.GX,uv",
      filter)
    .then(result => {
      session.close();
      var nodes = [];
      var edges = [];

      var genie = {};
      var uv = {};

      var groupe = {'TC': 1, 'IM': 2, 'GU': 3, 'GB': 4, 'GI': 5, 'GP': 6, 'GX': 0}

      config.branches.forEach( GX => {
        groupe[GX] = {};
        groupe[GX].color = {background: config.branches_color[GX]}
      })

      var length = 0;
      result.records.map(record => {
        var gx = record.get('r.GX');

        if ( genie[gx] === undefined ){
          genie[gx] = length;

          var n = _.indexOf(config.branches, gx.substring(0,2) )
          var k = parseInt(gx.substring(gx.length-2,gx.length))

          var x_coord = 0
          var y_coord = 0
          if (  gx.substring(0,2) == "TC" ){
            x_coord = 0
            y_coord = (7-k) * 300

          } else {
            size = k * 300 + 300
            x_coord = -Math.cos((n-1)/(4) * 3.14) * size
            y_coord = -Math.sin((n-1)/(4) * 3.14) * size
          }
          nodes.push( {id: length, "label": gx, "group": gx.substring(0,2), x:x_coord, y:y_coord, fixed: true, size: 50, "shape": "box", "font": {"size":50} } )


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
          nodes.push( {id: length, "label": record.get('uv').properties.code, size: 50, "value": record.get('uv').properties.degree.low , "group": record.get('uv').properties.branche} )
          edges.push( {"from": length, "to": genie[gx],"color": {"color": "#dddddd", "highlight": config.branches_color[gx.substring(0,2)]} , value: record.get("count(r)").low} )
          uv[record.get('uv').properties.code] = length;
        } else {
          edges.push( {"from": uv[record.get('uv').properties.code],"color": {"color": "#dddddd", "highlight": config.branches_color[gx.substring(0,2)]} , "to": genie[gx], value: record.get("count(r)").low} )
        }
        length = nodes.length;
      })
      return {nodes: nodes, edges: edges, genie: genie, groupes: groupe}
    })
    .catch(error => {
      session.close();
      throw error;
    });
}


function getGraphBranches2(filter) {
  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r]->(uv) WHERE uv.degree > 5 AND uv.type IN {types} AND left(r.GX,2) IN {branches} WITH count(r) as cnt, r.GX as GX, uv as uv RETURN collect([cnt, uv]) as attendances, GX as gx",
      filter)
    .then(result => {
      session.close();
      var nodes = [];
      var edges = [];

      var genie = {};
      var uv = {};

      var groupe = {'TC': 1, 'IM': 2, 'GU': 3, 'GB': 4, 'GI': 5, 'GP': 6, 'GX': 0}

      config.branches.forEach( GX => {
        groupe[GX] = {};
        groupe[GX].color = {background: config.branches_color[GX]}
      })

      var length = 0;
      // ajout des branches
      result.records.map(record => {
        var gx = record.get('gx');

        if ( genie[gx] === undefined ){
          genie[gx] = length; // node id for the gx node

          // Calcul de la position
          var n = _.indexOf(config.branches, gx.substring(0,2) )
          var k = parseInt(gx.substring(gx.length-2,gx.length))

          var x_coord = 0
          var y_coord = 0
          if (  gx.substring(0,2) == "TC" ){
            x_coord = 0
            y_coord = (7-k) * 300

          } else {
            size = k * 300 + 300
            x_coord = -Math.cos((n-1)/(4) * 3.14) * size
            y_coord = -Math.sin((n-1)/(4) * 3.14) * size
          }
          // ajout du noeud de branche
          nodes.push( {id: length, "label": gx, "group": gx.substring(0,2), x:x_coord, y:y_coord, fixed: true, size: 50, "shape": "box", "font": {"size":50} } )

          length = nodes.length;
        }
      })
      // ajout des uvs
      result.records.map(record => {
        var gx = record.get('gx');

        attendances = record.get('attendances');
        attendances.map( data => { // [cnt, uv]
          uv_node = data[1].properties;
          cnt = data[1].low;

          if ( uv[uv_node.code] === undefined){ // si le noeud n'a pas encore été ajouté
            nodes.push( {id: length, "label": uv_node.code, size: 50, "value": uv_node.degree.low , "group": uv_node.branche} )
            uv[uv_node.code] = length; // set node id
          }
          edges.push( {"from": uv[uv_node.code], "to": genie[gx],"color": {"color": "#dddddd", "highlight": config.branches_color[gx.substring(0,2)]} , value: cnt} )
          length = nodes.length;
        })

      })
      return {nodes: nodes, edges: edges, genie: genie, groupes: groupe}
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

exports.getUv = getUv;
exports.getUvAttendance = getUvAttendance;
exports.getSemestresAttendance = getSemestresAttendance;

exports.getUvs = getUvs;
exports.getGraphBranches = getGraphBranches2;
exports.getUserUvs = getUserUvs;
