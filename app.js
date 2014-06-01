var express = require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');
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

var User = mongoose.model('User', UserSchema);

passport.use(new PayPalStrategy({
        clientID: 'AbkcyBARHBHMHjRyvgMtxS9uQUMPcHLRvt47_-coNd93V6mUDOqtBPHSDDE9',
        clientSecret: 'EJPtWBCrDJY-K_oDHZSDy4eHFQUdzoFs-UlG1GmpgFxP5EDTM31pJRPXVOPk',
        callbackURL: "http://localhost:5000/login/callback"
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

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({ secret: '123456789' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    isAuthenticated(req, res);


    res.sendfile(__dirname + '/views/index.html');
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/login', passport.authenticate('paypal', { scope: 'openid profile email' }), function(req, res) {
    // request will be redirected to paypal
    console.log('\n\n\n\n\n');
    console.log(req);
    console.log(res);
    console.log('\n\n\n\n\n');
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

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

function getUser(req) {
    return req.session.passport.user;
}

function isAuthenticated(req, res) {
    var currentUser = getUser(req);

    if (currentUser == null) {
        res.redirect('/login');
    }
}