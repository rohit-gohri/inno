var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account');
var Team = require('../models/team');
var userLogic = require('../logic/userLogic');

router.get('/myteams', function(req, res) {
    Account.findOne({_id: req.user._id}, function(err, user) {
        if (err) {
            res.render('error');
        } else {
            Team.find({members: user._id}).lean().execute(function(err, teams) {
                if(err)
                    res.render('error', {message:"Sorry!", error: err});
                res.render('team', {user:user, teams: teams});
            })
        }
    })
});

router.get('/newTeam', userLogic.ensureAuthenticated, function(req, res) {
    res.render('addTeam', {user: {inno_id: req.user.inno_id}});
});

router.post('/newTeam', function(req, res) {
    var id1 = req.user.inno_id;
    var id2 = req.body.mem2;
    var id3 = req.body.mem3;
    var id4 = req.body.mem4;
    var id5 = req.body.mem5;
    var tname = req.body.name;

    var captain = null;

    var mem = [];
    var err = [];
    Account.findOne({_id: req.user._id}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if(!user) {
                res.render('error', {message: "Please login",
                    err: {status: error.statusCode, stack: error.stack}});
            }

            captain = req.user._id;
        }
    });
    Account.findOne({inno_id: id2}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {

                console.log(mem);

            } else {
                err.push('1');
            }
        }
    });

    Account.findOne({inno_id: id3}, function(err, user) {
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

    Account.findOne({inno_id: id4}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {

                mem.push(user._id);
            } else {
                err.push('3');
            }
        }
    });

    Account.findOne({inno_id: id5}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {

                mem.push(user._id);
            } else {
                err.push('4');
            }


            team = new Team({
                name: tname,
                members: mem,
                captain: captain
            });

            team.save(function (err, Team) {
                if(err) {
                    console.log(err);
                }
                //render here
                //  var red = '' + Team.name;
                //res.redirect(red);
            });

        }
    });


});

module.exports = router;
