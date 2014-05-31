var express = require("express");
var app = express();
var pg = require('pg');
var Bookshelf  = require('bookshelf');

Bookshelf.PG = Bookshelf.initialize({
    client: 'pg',
      connection: {
        host     : 'ec2-54-243-49-82.compute-1.amazonaws.com',
        user     : 'sltswpnjskrfaz',
        password : 'XzcOx6_JmgnFUgLuBZsOfxtd0r',
        database : 'd3as6a49gvh5g3',
        charset  : 'UTF8_GENERAL_CI'
    }
});

// elsewhere, to use the client:
var Bookshelf = require('bookshelf').PG;

var User = Bookshelf.Model.extend({
  tableName: 'users',
  email: ''
});

app.get('/', function(req, res) {
    console.log(process.env.DATABASE_URL);

    var user = new User({ email: 'my@email.com' }).save()
        .then(function () {
            console.log('SAVED11111!!!!!!!');
        })
        .catch(function (err) {
            console.log('ERROR: ' + err);
        });

    res.send('Hello Battlehack!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});