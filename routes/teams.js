var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account')
var Team = require('../models/team')

router.get('/myteam', function(req, res) {
    Account.findOne({inno_id: req.user.inno_id}, function(err, user) {
        if (err) {
            res.render('error');
        } else {
            if (user.team) {
                Team.findOne({_id: user.team}, function(err, team) {
                    res.render('team', {user:user, team: team});
                })
            } else {
                res.redirect('/newTeam');
            }
        }
    })
});

router.get('/newTeam', function(req, res) {
    res.render('newTeam');
});

router.post('/newTeam', function(req, res) {
    var name = req.body.name;
    var captain = null;
    var mem = [];
    var err = [];
    Account.findOne({inno_id: req.user.inno_id}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if(!user) {
                res.render('error', {message: "Please login",
                    err: {status: error.statusCode, stack: error.stack}});
            }
            captain = user._id;
        }
    });
    Account.findOne({inno_id: req.body.inno_id2}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                mem.push(user._id);
            } else {
                err.push('2');
            }
        }
    });
    team = new Team({
        name: name,
        members: mem,
        captain: captain
    })
});

module.exports = router;