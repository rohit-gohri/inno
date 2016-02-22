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
var Account = require('./models/account');
var paginate = require('express-paginate');
var Hashids = require("hashids");

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var config = require('config');

var hashids = new Hashids(config.get('hashids').secret, config.get('hashids').no_chars, config.get('hashids').chars);

var index = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');
var teams = require('./routes/teams');
var userLogic = require('./logic/userLogic');

var app = express();

// mongoose
mongoose.connect(config.get('dbhost'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: config.get('sessionSecret'),
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // = 1 day expiry
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(paginate.middleware(10, 50));

app.get('*', userLogic.setLoginStatus);
app.use('/', index);
app.use('/users', users);
app.use('/events', events);
app.use('/teams', teams);

// passport config
passport.use(Account.createStrategy());
passport.use(new FacebookStrategy({
        clientID: config.get('fb').clientID,
        clientSecret: config.get('fb').clientSecret,
        callbackURL: config.get('fb').callbackURL,
        profileFields: ['id', 'displayName', 'picture.type(large)', 'emails', 'name', 'gender']
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
                        photo: profile.photos[0].value,
                        provider: 'facebook',
                        providerData: profile._json,
                        accessToken: accessToken,
                        is_new: true
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        user.inno_id = 'I' + hashids.encode(user.accNo);
                        user.save(function(err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            })
    }
));
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    Account.findOne({_id: id}, function(err, user) {
        done(err, user);
    });
});

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
        //res.status(err.status || 500);
        console.log("BC!!! Development wala chal raha hai!!!!");
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    //res.status(err.status || 500);
    console.log("BC!!! Ye PRODUCTION me error kisne push kia????");
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
