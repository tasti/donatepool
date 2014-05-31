var express = require("express");
var app = express();
var pg = require('pg');

pg.connect(process.env.DATABASE_URL || "ec2-107-22-163-140.compute-1.amazonaws.com", function(err, client) {
  if (err) throw err;

  var query = client.query('SELECT * FROM your_table');

  query.on('row', function(row) {
    console.log(JSON.stringify(row));
  });
});

app.get('/', function(req, res) {
  res.send('Hello Battlehack!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});