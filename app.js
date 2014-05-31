var express = require("express");
var app = express();
var pg = require('pg');
var Bookshelf  = require('bookshelf');

Bookshelf.PG = Bookshelf.initialize({
    client: 'pg',
      connection: {
        host     : 'ec2-107-22-163-140.compute-1.amazonaws.com',
        user     : 'zkyhliyptxwwry',
        password : 'weLWaLDvhh9gpxNBMSLiOE7PY_',
        database : 'dea6fsu3t8b7ri',
        charset  : 'UTF8_GENERAL_CI'
    }
});

// elsewhere, to use the client:
var Bookshelf = require('bookshelf').PG;

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

app.get('/', function(req, res) {
    console.log(process.env.DATABASE_URL);
    res.send('Hello Battlehack!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});