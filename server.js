var express = require('express'),
    io = require('socket.io'),
    util = require('util'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    routes = require('./routes');

var app = module.exports = express.createServer();

//auth
passport.use(new TwitterStrategy({
    consumerKey: 'JV8UQpIOpimeTigcuelVdA',
    consumerSecret: 'i0CzowJrdioAKVQTdZ2RTteU79p4WdgGEUH3UiNm9c',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function(token, tokenSecret, profile, done) {
    done(null, profile);
}));
passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(obj, done){
    done(null, obj);
});
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(express.static(__dirname + '/public'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
var events = {};

app.get('/', function(req,res){
    res.render('index', {});
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }
    )
);

app.listen(3000);
