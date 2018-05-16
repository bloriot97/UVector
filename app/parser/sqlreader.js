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
      "MATCH ()-[r:SUIT]->() WHERE r.GX =~ '" + from + ".*' SET r.GX = replace(r.GX, '"+ from "', '" + to + "') return null")
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
      inserMulti(suit, 20, "MATCH (a:Person {id: {id_etu} }),(b:UV {code: {uv} }) CREATE (a)-[r:SUIT {codeSemestre: {semestre} , GX: {gx} }]->(b)")
    })
    //insererListeSuit();

  });

}

function traitement(){
  changeGXNames("GSU", "GU")
  changeGXNames("GSM", "IM")
  changeGXNames("GM", "IM")


}


exports.setupDB = setupDB;
