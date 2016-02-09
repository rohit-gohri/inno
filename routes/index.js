var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

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
        console.log(account);
        if(!req.isAuthenticated()) {
            passport.authenticate('local')(req, res, function () {
                console.log(req);
                res.redirect('/users/details');
            });
        } else {
            console.log(req);
            res.redirect('/users/details');
        }
    });
});

router.get('/login/fb', passport.authenticate('facebook', {authType: 'rerequest', scope: 'email'}));

router.get('/login/fb/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), function(req, res) {
        console.log(req);
        Account.findOne({'providerData.id': req.user.providerData.id},
        function(err, user) {
            if (user.is_new) {
                res.redirect('/users/details');
            } else {
                res.redirect('/');
            }
        });
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