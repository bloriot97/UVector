const config = require("../config/config");

const neo4j = require('neo4j-driver').v1;
var _ = require("lodash");

const driver = neo4j.driver("bolt://neo4j:" + config.neo4j.port, neo4j.auth.basic( config.neo4j.user, config.neo4j.password));

const uvs = require('./uvs.txt.json')
const etus = require('./etu.txt.json')
const suit = require('./suit.txt.json')




function insererUV(){
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


function insererUv(uv){

  var session = driver.session();
  return session
    .run(
      "CREATE (:UV {code: {codeUV} , fullname: {nom} , type: {categorie}})", uv)
    .then(result => {
      session.close();

      return result;

    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function changeGXNames(from , to){
  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r:SUIT]->() WHERE r.GX =~ '" + from + ".*' SET r.GX = replace(r.GX, '" + from + "', '" + to + "') return null")
    .then(result => {
      session.close();

      return result;

    })
    .catch(error => {
      session.close();
      throw error;
    });

}

function calcGX(){
  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r]->(uv) WHERE uv.type <> 'TSH' AND left(r.GX, 2) IN ['TC','GI','IM','GU','GB','GP'] WITH LEFT(r.GX, 2) as branche, uv as uv WITH [count(branche), branche] as branche, uv as uv ORDER BY branche[0] DESC WITH collect(branche) as branches, uv as uv SET uv.branche = branches[0][1]")
    .then(result => {
      session.close();
      calcGX2()
      return result;
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function calcGX2(){
  var session = driver.session();
  return session
    .run(
      "MATCH ()-[r]->(uv) WHERE uv.type <> 'TSH' AND left(r.GX, 2) IN ['TC','GI','IM','GU','GB','GP'] AND uv.degree > 100 WITH LEFT(r.GX, 2) as branche, uv as uv WITH toFloat(count(branche))/toFloat(uv.degree) as prop, branche as branche, uv as uv WITH stDev(prop) as dev,collect([prop, branche]) as prop, count(prop) as cnt, uv as uv WHERE cnt > 2 and dev < 0.2 SET uv.branche = 'GX'")
    .then(result => {
      session.close();
      return result;
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function calcDeg(){
  var session = driver.session();
  return session
    .run(
      "MATCH (p:Person)-[r:SUIT]->(uv:UV) WITH count(r) as cnt, uv.code as code MATCH (uv:UV {code: code}) SET uv.degree = cnt ")
    .then(result => {
      session.close();
      return result;
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function insererSuit(suit){

  var session = driver.session();
  return session
    .run(
      "MATCH (a:Person {id: {id_etu} }),(b:UV {code: {uv} }) CREATE (a)-[r:SUIT {codeSemestre: {semestre} , GX: {gx} }]->(b)", suit)
    .then(result => {
      session.close();

      return result;

    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function insererRec(tab, i, query, callback, pas = 1 ){
  var session = driver.session();
  if ( i < tab.length ){
    var promises = [];
    tab[i].forEach( (element) => {
      promises.push( session.run(query, element) )
    })
    Promise.all(promises)
    .then( (results) => {
      session.close();
      console.log('"' + query + '"' + (i+1) + "/" + tab.length)
      insererRec(tab, i+pas, query, callback, pas);
    })
    .catch( (error) => {
      session.close();
    })
  } else if (i == tab.length) {
    console.log(query + " : Done !")
    console.log(callback)
    if ( callback !== undefined ){
      callback();
    }
  }
}

function dropDB(){
  var session = driver.session();
  return session
    .run(
      "match (n) detach delete n")
    .then(result => {
      session.close();

      return result;

    })
    .catch(error => {
      session.close();
      throw error;
    });

}


function inserMulti(tab, n, query, callback){
  for ( var i = 0; i < n; i ++){
    insererRec(tab, i, query, callback, n);
  }
}

function setupDB(){
  dropDB().then( () => {
    inserMulti(uvs, 5,"CREATE (:UV {code: {codeUV} , fullname: {nom} , type: {categorie}})");
    inserMulti(etus, 5, "CREATE (:Person {id: {id_etu} })", function() {
      inserMulti(suit, 20, "MATCH (a:Person {id: {id_etu} }),(b:UV {code: {uv} }) CREATE (a)-[r:SUIT {codeSemestre: {semestre} , GX: {gx} }]->(b)", function(){
        changeGXNames("GSU", "GU")
        changeGXNames("GSM", "IM")
        changeGXNames("GM", "IM")
        calcDeg()
      })
    })
    //insererListeSuit();

  });

}



exports.setupDB = setupDB;
exports.calcGX = calcGX;
