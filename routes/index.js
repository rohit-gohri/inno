var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var Hashids = require("hashids");

var hashids = new Hashids("LetsINNOvade", 5, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");

router.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

router.get('/wait', function (req, res) {
    res.render('wait');
});

router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({email: req.body.email}), req.body.password, function (err, account) {
        if (err) {
            return res.render('error', {message: err.message, error: err});
        }
        passport.authenticate('local')(req, res, function () {
            account.inno_id = hashids.encode(account.accNo);;
            account.save(function (err) {
                if(err)
                    console.log(err);
                else
                    res.redirect('/users/details');
            });
        });
    });
});

router.get('/login/fb', passport.authenticate('facebook', {authType: 'rerequest', scope: ['email', 'user_birthday']}));

router.get('/login/fb/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), function(req, res) {
        if (req.user.is_new) {
            res.redirect('/users/details');
        } else {
            res.redirect('/');
        }
    }, function(err, req, res) {
        if(err) {
            req.logout();
            res.redirect('/login');
        }
    }
);

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;