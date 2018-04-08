var express = require('express');
var exphbs  = require('express-handlebars');
var session = require('express-session');

var api = require('./routes/api.js');

var app = express();

app.use(session({ secret: 'UVectorGivesYouDirection', cookie: { maxAge: 60000 }}))

var hbs = exphbs.create({
    helpers: {
        ifnot: function(cond, opt) { return !cond ? opt.fn(this) : opt.inverse(this) }
    }
})

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/static/', [
    express.static(__dirname + '/node_modules/materialize-css/dist/'),
    express.static(__dirname + '/node_modules/jquery/dist/'),
    express.static(__dirname + '/static/'),
]);

app.use('/api/v1', api)

app.get('/', (req, res) => {
    res.render('index', {login: req.session.user, logged: req.session.user? true: false})
})

app.get('/login/', (req, res) => {
    if (req.session.user == undefined && req.param('ticket') === undefined) {
        res.redirect('https://cas.utc.fr/cas/login?service=' + req.protocol + '://' + req.get('host') + '/login')
    } else {
        var CAS = require('./config/cas');
        var cas = new CAS({base_url: 'https://cas.utc.fr/cas/', service: 'http://' + req.get('host') +'/login'});
        var ticket = req.param('ticket');
        if (ticket) {
            cas.validate(ticket, function(err, status, username) {
                if (err) {
                    res.send({error: err});
                } else {
                    console.log(username + " logged in")
                    req.session.user = username;
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    }
})

app.get('/logout/', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

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
