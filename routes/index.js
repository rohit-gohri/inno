var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var Hashids = require("hashids");
var nodemailer = require('nodemailer');
var mailgun = require('nodemailer-mailgun-transport');

var auth = {
    auth: {
        api_key: 'key-6e52fb517206b563dfbe87f3aee097ca',
        domain: 'mg.innovisionnsit.in'
    }
};
var hashids = new Hashids("LetsINNOvade", 4, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
var mgMailer = nodemailer.createTransport(mailgun(auth));

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
            account.inno_id = 'I' + hashids.encode(account.accNo);;
            account.save(function (err) {
                if(err)
                    console.log(err);
                else
                    res.redirect('/users/details');
            });
        });
    });
});

router.get('/login/fb', passport.authenticate('facebook', {authType: 'rerequest', scope: 'email'}));

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
    if (req.user.is_new)
        res.redirect('/users/details');
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/contact', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('contactUs', {user: req.user});
    } else {
        res.render('contactUs', {user: {}});
    }
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.post('/contact', function(req, res) {
    var mailOpts;

    mailOpts = {
        from: req.body.name + ' <' + req.body.email + '>', //grab form data from the request body object
        to: 'gohri.rohit@gmail.com',
        subject: 'Inno Website Contact Form: ' + req.body.subject,
        text: req.body.mail
    };

    mgMailer.sendMail(mailOpts, function(err, response) {
        var user = {};
        if (req.isAuthenticated()) {
            user = req.user;
        }
        if (err) {
            res.render('contactUs', { msg: 'Error occured, message not sent.', err: true, user: user});
        } else {
            res.render('contactUs', { msg: 'Message Sent! Thank You.', err: false, user: {}});
        }
    })
});

module.exports = router;