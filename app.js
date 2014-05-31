var express = require("express");
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({
    id    : ObjectId
  , email     : String
});

mongoose.connect('mongodb://root:password123@kahana.mongohq.com:10071/donatepool');

app.get('/', function(req, res) {
    var MyModel = mongoose.model('User', User);
    var instance = new MyModel();
    instance.my.key = 'hello';
    instance.save(function (err) {
        console.log('SAVED!');
    });


    res.send('Hello Battlehack!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});