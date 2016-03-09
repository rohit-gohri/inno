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



router.get('/:teamLink/edit', userLogic.isEM, function (req, res) {
    Team.findOne({linkName: req.params.teamLink}, function (err, event) {
        if(err)
            console.log(err);
        else {//if (event.managers.indexOf(req.user._id) > -1 || req.user.is_admin) {
            res.render('addTeam', {event: event, edit: true});
            //} else {
            //    res.render('error', {message:"You don't have permission to view this", error: {status:"", stack:""}});
            // TODO: Add condition so that only a set of em are able to edit an event
        }
    })
});

router.post('/:teamLink/edit', userLogic.isEM,
    function(req, res) {
        Team.findOne({linkName: req.params.teamLink}, function (err, event) {
            if (err)
                console.log(err);
            else {//if (event.managers.indexOf(req.user._id) > -1 || req.user.is_admin) {
                var linkName = req.body.name;
                linkName = linkName.replace(/\s+/g, '-').toLowerCase();

                var fbLink = req.body.fbLink;
                if (fbLink.indexOf('http') == -1)
                    fbLink = 'http;//' + fbLink;

                var trimmedDetails = req.body.details.substr(0, 100);
                trimmedDetails = trimmedDetails.substr(0, Math.min(trimmedDetails.length, trimmedDetails.lastIndexOf(" ")));
                trimmedDetails = trimmedDetails + '...';

                event.name = req.body.name;
                event.linkName = linkName;
                event.shortDetails = trimmedDetails;
                event.details = req.body.details;
                event.fbLink = fbLink;
                event.minParticipants = req.body.minParticipants;
                event.category = req.body.category;
                event.isTeamEvent = req.body.isTeamEvent == 1;
                event.contact = req.body.contact;
                event.venue = req.body.venue;
                event.timings = req.body.timings;

                event.save(function() {
                    res.redirect('/events/' + linkName);
                });
                //} else {
                //    res.render('error', {message: "You don't have permission to view this", error: {status: "", stack: ""}});
            }
        })
    });




    
module.exports = router;
