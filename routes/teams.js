var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account');
var Team = require('../models/team');
var userLogic = require('../logic/userLogic');

router.get('/myTeams', userLogic.ensureAuthenticated, function(req, res) {

    Team.find({members: req.user._id}).lean().exec(function(err, teams) {
        if(err)
            res.render('error', {message:"Sorry! No teams found.", error: err});
        else
            res.render('team', {teams: teams});
    })


});

router.get('/newTeam', userLogic.ensureAuthenticated, function(req, res) {
    res.render('addTeam', {inno_id: req.user.inno_id});
});

router.post('/newTeam', userLogic.ensureAuthenticated, function(req, res) {

    var count=req.body.category;
    count--;
    var inno = [];
    if(count){
    var id2 = req.body.mem2.trim().toUpperCase();
        count--;
        inno.push(id2);
    }
    if(count){
    var id3 = req.body.mem3.trim().toUpperCase();
        count--;
        inno.push(id3);
    }
    if(count){
    var id4 = req.body.mem4.trim().toUpperCase();
        count--;
        inno.push(id4);
    }
    if(count){
    var id5 = req.body.mem5.trim().toUpperCase();
        count--;
        inno.push(id5);
    }
    if(count){
        var id6 = req.body.mem6.trim().toUpperCase();
        inno.push(id6);
    }
    var id1 = req.user.inno_id;
    console.log(inno);
    var tname = req.body.name;

    var captain = req.user._id;

    var mem = [];

    Account.find({inno_id:{ $in: inno }},function(err, users) {
        console.log("in");
        if (err) {
            console.log(err);
            res.render('addTeam', {error: 'Some of the users were not found, please check the INNO IDs',
                inno_id: req.user.inno_id});
        } else if (users.length == inno.length) {
            mem.push(captain);
            for (var i=0; i < users.length; i++) {
                console.log(users[i]._id);
                mem.push(users[i]._id);
            }

            team = new Team({
                name: tname,
                members: mem,
                captain: captain
            });

            team.save(function (err, Team) {
                if(err) {
                    console.log(err);
                    res.render('addTeam',
                        {error: 'Team name already exists', inno_id: req.user.inno_id});
                } else {
                    res.render('addTeam',
                        {message: 'Team ' + tname + ' added successfully. Please return to the event to complete the registration.',
                            inno_id: req.user.inno_id});
                }
            });
        } else {
            res.render('addTeam',
                {error: 'Some of the Inno IDs were incorrect, please try again.', inno_id: req.user.inno_id});
        }
    });
});
    
module.exports = router;
