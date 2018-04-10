var https = require("https");

var _ = require("lodash")

function getUserUvs(user, callback) {
  // https://webapplis.utc.fr/Edt_ent_rest/myedt/result?login={userid}
  https.get("https://webapplis.utc.fr/Edt_ent_rest/myedt/result?login=" + user, (res) => {
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var uvs = JSON.parse(body);
        callback(Object.keys(_.groupBy(uvs, 'uv')), null);
    });
  })
}


exports.getUserUvs = getUserUvs;
