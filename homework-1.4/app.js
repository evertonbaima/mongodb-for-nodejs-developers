var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require("body-parser");

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var url = 'mongodb://localhost:27017/video';

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log('Successfully connected to server');

    app.get('/', function (req, res) {
        db.collection('movies').find({}).toArray(function (err, docs) {
            res.render('movies', { movies: docs });
        });
    });

    app.post('/add_movie', function (req, res) {
        const title = req.body.title;
        const year = parseInt(req.body.year);
        const imdb = req.body.imdb;

        db.collection('movies').insertOne({ title, year, imdb, }, function (err, result) {
            res.redirect('/');
        });
    });

    app.use(function (req, res) {
        res.sendStatus(404);
    });

    var server = app.listen(3000, function () {
        var port = server.address().port;
        console.log('Express server listening on port %s', port);
    });
});
