var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account')
var Team = require('../models/team')

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

router.get('/api/myteams', function(req, res) {
    Account.findOne({_id: req.user._id}, function(err, user) {
        if (err) {
            res.render('error');
        } else {
            Team.find({members: user._id}).lean().execute(function(err, teams) {
                if(err)
                    res.send({message:"Sorry!", error: err});
                res.send({teams: teams});
            })
        }
    })
});

router.get('/newTeam', function(req, res) {
    res.render('addTeam');
});

router.post('/newTeam', function(req, res) {
    var id1 = req.body.name1;
    var id2 = req.body.name2;
    var id3 = req.body.name3;
    var id4 = req.body.name4;
    var id5 = req.body.name5;
    var id5 = req.body.name5;
    var tname = req.body.teamname;
    console.log(id1);
    console.log(id2);
    console.log(id3);
    console.log(id4);
    console.log(id5);

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
    Account.findOne({inno_id: id1}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                mem.push(user._id);
                
            } else {
                err.push('1');
            }
        }
    });

    Account.findOne({inno_id: id2}, function(err, user) {
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

    Account.findOne({inno_id: id3}, function(err, user) {
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

    Account.findOne({inno_id: id4}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                mem.push(user._id);
            } else {
                err.push('4');
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
                err.push('5');
            }
        }
    });
    console.log(mem);

    team = new Team({
        name: tname,
        members: mem,
        captain: captain
    });
    console.log(team);
     team.save(function (err, Team) {
                    if(err) {
                        console.log(err);
                    }
                    var red = '' + Team.name;
                    res.redirect(red);
                });

});

module.exports = router;
