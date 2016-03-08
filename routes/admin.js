var express = require('express');
var Account = require('../models/account');
var Team = require('../models/team');
var Event = require('../models/event');
var router = express.Router();
var userLogic = require('../logic/userLogic.js');
var config = require('config');
var async = require("async");

var auth = config.get('mailgun');

router.get('/emailBlast',userLogic.isAdmin,function(req,res){
    Event.find({}, 'name linkName').lean().exec(function (err, events) {
        res.render('emailBlast', {events: events});
    });
});

router.post('/emailBlast', function(req,res,next) {
    req.template = "emails/" + req.body.type;

    if (req.body.emailList == 'all') {
        Account.find({}, 'email firstName').lean().exec(function (err, users) {
            req.listofusers = users;
            next();
        });
    } else if (req.body.emailList == 'specify') {
        var array = req.body.inno_ids.split(',');
        Account.find({inno_id: {$in: array}}, 'email firstName').lean().exec(function (err, users) {
            req.listofusers = users;
            next();
        });
    } else {
        Event.findOne({linkName: req.body.emailList}, function(err, event) {
            if(!event || err ) {
                res.render('error', {message: "Event not found!", error: {status: 404, stack: ''}});
            } else {
                if (!event.isTeamEvent) {
                    Account.find({_id: {$in: event.participants}}, 'email firstName').lean().exec(function (err, users) {
                        req.listofusers = users;
                        next();
                    })
                } else {
                    Team.find({_id: {$in: event.participants}}).populate('members').lean().exec(function(err, teams, call) {
                        req.listofusers = [];
                        for (var i in teams) {
                            req.listofusers.push.apply(req.listofusers, teams[i].members);
                        }
                        next();
                    })
                }
            }
        })
    }
}, function (req, res) {
    var failure = [];
    var set = function(val, inno_id) {
        if (val) {
            failure.push(inno_id);
        }
    };
    async.each(req.listofusers,function(user,callback) {
        async.waterfall([
            function(callback) {
                res.app.render(req.template, {user: user, msg: req.body.message}, function(err, html) {
                    userLogic.sendMail(user.email, req.body.subject,
                        "Hi " + user.firstName + ", / " + req.body.message + " / Regards, / Innovision Team", html, user.inno_id, set);
                    callback();
                })
            }
        ], function() {
            callback();
        })
    }, function() {
        Event.find({}, 'name linkName').lean().exec(function (err, events) {
            res.render('emailBlast', {events: events, failure: failure});
        });
    });
});

module.exports = router;