var express = require('express');
var exphbs  = require('express-handlebars');

var api = require('./routes/api.js');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/static/', [
    express.static(__dirname + '/node_modules/materialize-css/dist/'),
    express.static(__dirname + '/static/'),
]);

app.use('/api/v1', api)


app.get('/', (req, res) => {
    res.render('index', {test: req.protocol + '://' + req.get('host') +req.originalUrl})
})

// app.get('/login/', (req, res) => {
//     res.redirect('https://cas.utc.fr/cas/login?service=' + req.protocol + '://' + req.get('host') + '/test')
// })
//
// app.get('/test/', (req, res) => {
//     var CAS = require('cas');
//     var cas = new CAS({base_url: 'https://cas.utc.fr/cas/serviceValidate?service=', service: req.protocol + '://' + req.get('host') +req.originalUrl});
//
// })
//
// var neo4j = require('node-neo4j');
// var db = new neo4j('http://neo4j:test@neo4j:7474');
//
// app.use('/', express.static(__dirname + '/view'));
//
// app.get('/tools/load', function (req, res, next) {
//     db.insertNode({
//         name: 'Darth Vader #' + parseInt(Math.random() * 100),
//         sex: 'male'
//     }, ['Person'], function (err, node) {
//         if (err) return next(err);
//
//         res.json(node);
//     });
// });
//
// app.get('/tools/drop', function (req, res, next) {
//     db.cypherQuery("MATCH (n) DETACH DELETE n", function (err, result) {
//         if (err) return next(err);
//         res.json(result);
//     });
// });
//
// app.get('/persons', function (req, res, next) {
//     db.cypherQuery("MATCH (person:Person) RETURN person", function (err, result) {
//         if (err) return next(err);
//         res.json(result.data);
//     });
// });

app.listen(3000);
