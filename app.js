var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/events', events);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.use(new FacebookStrategy({
        clientID: '1682265012051455',
        clientSecret: '2e4238e0e2da29509fb8beb48126d2bf',
        callbackURL: "http://www.innovisionnsit.com/login/fb/callback",
        profileFields: ['id', 'displayName', 'photos', 'email', 'phoneNumbers']
    },
    function (accessToken, refreshToken, profile, done) {
        Account.findOne({'providerData.id': profile.id},
            function (err, user) {
                if (err) {
                    return done(err);
                }
                //No user found
                if (!user) {
                    user = new Account({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        gender: profile.gender,
                        email: profile.emails[0].value,
                        username: profile.username,
                        photo: profile.photos[0].value,
                        dob: profile.birthday,
                        phoneNo: profile.phoneNumbers[0].value,
                        provider: 'facebook',
                        providerData: profile._json,
                        accessToken: accessToken
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            })
    }
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/innovision');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
