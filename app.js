var express = require("express");
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://root:password123@kahana.mongohq.com:10071/donatepool');

var passport = require('passport');
//var PayPalStrategy = require(__dirname + '/node_modules_custom/passport-paypal-oauth').Strategy;
var PayPalStrategy = require('passport-paypal-oauth').Strategy;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var UserSchema = new Schema({
    id : String,
    givenName : String,
    familyName : String,
    email : String
});
var PoolSchema = new Schema({
    name : String,
    hostEmail : String,
    members : [String],
    fixed : Number
});
var PredictionSchema = new Schema({
    poolId : String,
    userEmail: String,
    data: Object
});

var User = mongoose.model('User', UserSchema);
var Pool = mongoose.model('Pool', PoolSchema);
var Prediction = mongoose.model('Prediction', PredictionSchema);

passport.use(new PayPalStrategy({
        clientID: 'AbkcyBARHBHMHjRyvgMtxS9uQUMPcHLRvt47_-coNd93V6mUDOqtBPHSDDE9',
        clientSecret: 'EJPtWBCrDJY-K_oDHZSDy4eHFQUdzoFs-UlG1GmpgFxP5EDTM31pJRPXVOPk',
        callbackURL: "http://donatepool.herokuapp.com/login/callback"
    },
    function(accessToken, refreshToken, user, done) {
        User.findOne({ email: user._json.email }, 'id givenName familyName email', function (err, getUser) {
            //console.log('ERROR: ' + err);

            var instance;
            if (getUser == null) {
                instance = new User();
                instance.id = user.id;
                instance.givenName = user.name.givenName;
                instance.familyName = user.name.familyName;
                instance.email = user._json.email;

                instance.save(function (err) {
                    console.log('SAVED!');
                });
            }

            return done(err, (getUser || instance).email);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({ secret: '123456789' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser());

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

app.get('/', function(req, res) {
    if (!isAuthenticated(req)) {
        res.redirect('/start');
    }


    res.sendfile(__dirname + '/views/index.html');
});

app.get('/start', function(req, res) {
    if (isAuthenticated(req)) {
        res.redirect('/');
    }


    res.sendfile(__dirname + '/views/start.html');
});

app.get('/login', passport.authenticate('paypal', { scope: 'openid profile email' }), function(req, res) {
    // request will be redirected to paypal
    console.log('\n\n\n\n\n');
    console.log(req);
    console.log(res);
    console.log('\n\n\n\n\n');
});

app.get('/logout', function(req, res) {
    req.session.passport.user = null;

    res.redirect('/');
});

app.get('/login/callback', 
    passport.authenticate('paypal', { failureRedirect: '/error' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log('\n\n\n\nPath: "/callback"\n\n\n\n');
        console.log(getUser(req));

        res.redirect('/');
    }
);

function getUser(req) {
    return req.session.passport.user;
}

function isAuthenticated(req) {
    var currentUser = getUser(req);

    if (currentUser == null) {
        return false;
    } else {
        return true;
    }
}


/********** REST API **********/

app.get('/api/v1/getloggedinuser', function(req, res) {
    var currentUser = getUser(req) || null;

    res.json({ email: currentUser });
});

app.get('/api/v1/getusers', function(req, res) {

    User.find({}, 'givenName familyName email', function (err, getUsers) {
        
        res.json({ data: getUsers });

    });
});

app.get('/api/v1/getpools', function(req, res) {

    Pool.find({}, '_id name hostEmail members fixed', function (err, getPools) {
        
        res.json({ data: getPools });

    });
});

app.get('/api/v1/getmypools', function(req, res) {

    var currentUser = getUser(req) || null;

    Pool.find({}, '_id name hostEmail members fixed', function (err, getPools) {

        var myPools = [];

        getPools.forEach(function (pool) {

            if (pool.hostEmail == currentUser || pool.members.indexOf(currentUser) != -1) {
                myPools.push(pool);
            }
        });

        res.json({ data: myPools });

    });

});

app.post('/api/v1/hostpool', function(req, res, next) {
    console.log(req);

    var poolName = req.body.poolName.trim();
    var members = req.body.members;
    var donations = req.body.donations;
    var fixedAmount = req.body.fixedAmount;

    var instance = new Pool();
    instance.name = poolName;
    instance.hostEmail = getUser(req);
    instance.members = members;
    instance.fixed = fixedAmount;

    instance.save(function (err) {
        console.log('SAVED!');
    });

    res.json({ success: "Pool has been created!" });
});

app.post('/api/v1/addpredictions', function(req, res, next) {
    
    var instance = new Prediction();
    instance.userEmail = getUser(req);
    instance.poolId = req.body.poolId;
    instance.data = req.body.data;

    instance.save(function (err) {
        console.log('SAVED!!');
    });

    res.json({ success: "Predictions have been saved!" });
});