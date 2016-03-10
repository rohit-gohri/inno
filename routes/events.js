var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account');
var Team = require('../models/team');
var multer = require('multer');
var userLogic = require('../logic/userLogic');
var eventLogic = require('../logic/eventLogic');
var json2xls = require('json2xls');

var upload = multer({
    dest: 'public/uploads/',
    limits: {fileSize: 10000000, files:1}
});

router.get('/', function (req, res) {
    Event.find({}).lean().exec(function (err, events) {
        res.render('eventList', {events: events});
    });
});

router.get('/category/:category', function (req, res) {
    Event.find({category: req.params.category}).lean().exec(function (err, events) {
        res.render('eventList', {events: events, category: req.params.category});
    });
});

router.get('/addEvent', userLogic.isEM, function (req, res) {
    res.render('addEvent', {event:{}, edit: false})
});

router.post('/addEvent', userLogic.isEM, upload.single('eventPhoto'), function(req, res) {
    var linkName = req.body.name;
    linkName = linkName.replace(/\s+/g, '-').toLowerCase();

    var fbLink = req.body.fbLink;
    if (fbLink.indexOf('http') == -1)
        fbLink = 'http://' + fbLink;

    var trimmedDetails = req.body.details.substr(0, 100);
    trimmedDetails = trimmedDetails.substr(0, Math.min(trimmedDetails.length, trimmedDetails.lastIndexOf(" ")));
    trimmedDetails = trimmedDetails + '...';

    event = new Event({
        name: req.body.name,
        linkName: linkName,
        shortDetails: trimmedDetails,
        details: req.body.details,
        fbLink: fbLink,
        minParticipants: req.body.minParticipants,
        managers: [req.user._id],
        category: req.body.category,
        photo: '/uploads/' + req.file.filename,
        isTeamEvent: req.body.isTeamEvent == 1,
        contact: req.body.contact,
        venue: req.body.venue,
        timings: req.body.timings
    });
    event.save(function (err, event) {
        if(err) {
            console.log(err);
        }
        res.redirect(event.linkName);
    });
});

router.get('/:eventLink', userLogic.getTeams, eventLogic.isRegistered, function (req, res) {
    Event.findOne({linkName: req.params.eventLink},
        function (err, event) {
            if(!event || err ) {
                res.render('error', {message: "Event not found!" + req.params.eventLink, error: {status: '', stack: ''}});
            }
            else {
                console.log('inside event link'+res.locals.teams);
                //TODO: Next and previous events
                //Event(event).next(function (nxtEvent) {
                //    event.nxtEvent = nxtEvent.linkName;
                //    console.log(nxtEvent);
                //}).previous(function (prevEvent) {
                //    event.prevEvent = prevEvent.linkName;
                //    console.log(prevEvent);
                //});
                res.render('event', {event: event});
            }
        });
});

router.post('/:eventLink/register/', userLogic.ensureAuthenticated, function (req, res){

    var elink=req.params.eventLink;
    var id = req.user._id;

    Event.findOne({linkName: elink}, function(err, event) {

        if (!event || err){
            res.render('error', {message: "Event not found", error: {status: '', stack: ''}});
        }

        // team event
        else if (event.isTeamEvent) {
            var teamName = req.body.teamName;
            Team.findOne({name: teamName}, function(err, team){
                if(!team || err)
                    res.render('error', {message: "Error", error: {status: '', stack: ''}});
                else {
                    console.log(team);
                    event.participants.push(team._id);
                    event.save(function (err, event) {
                        if (err)
                            console.log(err);
                        res.redirect('/events/' + event.linkName);
                    });
                }
            });
        }

        //non team event
        else {
            event.participants.push(id);
            event.save(function (err, event) {
                if(err)
                    console.log(err);
                res.redirect('/events/' + event.linkName);
            });
        }
    });
});

router.post('/:eventLink/register-i', function (req, res){
    var elink=req.params.eventLink;
    var array = req.body.inno_ids.split(',');
    for(var i = 0; i < array.length; i++) {
        Event.findOne({linkName: elink}, function (err, event) {
            if (!event || err) {
                res.render('error', {message: "Event not found", error: {status: '', stack: ''}});
            }
            //non team event
            else {
                Account.find({inno_id: {$in: array}}).lean().exec(function(err, users) {
                    var ids = [];
                    for (var i in users) {
                        ids.push(users[i]._id);
                    }
                    event.participants.push.apply(event.participants, ids);
                    event.save(function (err, event) {
                        if (err) {
                            console.log(err);
                            res.redirect('/events/' + event.linkName + '/participants/error');
                        }
                        res.redirect('/events/' + event.linkName + '/participants/success');
                    });

                });
            }
        });
    }
});

router.post('/:eventLink/register-t', function (req, res){
    Event.findOne({linkName: req.params.eventLink}, function(err, event) {
        if (!event || err) {
            res.json({success: false});
        } else {
            var count=req.body.category;
            count--;
            var inno = [];
            var captain = req.body.captain;
            inno.push(captain);
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
            var tname = req.body.name;
            var mem = [];

            Account.find({inno_id:{ $in: inno }},function(err, users) {
                console.log("in");
                if (err) {
                    console.log(err);
                    res.redirect('/events/' + event.linkName + '/participants/error');
                } else if (users.length == inno.length) {
                    for (var i=0; i < users.length; i++) {
                        console.log(users[i]._id);
                        mem.push(users[i]._id);
                    }

                    team = new Team({
                        name: tname,
                        members: mem,
                        captain: mem[0]
                    });

                    team.save(function (err, Team) {
                        if(err) {
                            console.log(err);
                            res.redirect('/events/' + event.linkName + '/participants/name-taken');
                        } else {
                            event.participants.push(Team._id);
                            event.save(function() {
                                res.redirect('/events/' + event.linkName + '/participants/success');
                            });
                        }
                    });
                } else {
                    res.redirect('/events/' + event.linkName + '/participants/invalid-inno-ids');
                }
            });
        }
    });
});

router.get('/:eventLink/edit', userLogic.isEM, function (req, res) {
    Event.findOne({linkName: req.params.eventLink}, function (err, event) {
        if(err)
            console.log(err);
        else {//if (event.managers.indexOf(req.user._id) > -1 || req.user.is_admin) {
            res.render('addEvent', {event: event, edit: true});
        //} else {
        //    res.render('error', {message:"You don't have permission to view this", error: {status:"", stack:""}});
        // TODO: Add condition so that only a set of em are able to edit an event
        }
    })
});

router.post('/:eventLink/edit', userLogic.isEM, upload.single('eventPhoto'),
    function(req, res) {
        Event.findOne({linkName: req.params.eventLink}, function (err, event) {
            if (err)
                console.log(err);
            else {//if (event.managers.indexOf(req.user._id) > -1 || req.user.is_admin) {
                var linkName = req.body.name;
                linkName = linkName.replace(/\s+/g, '-').toLowerCase();

                var fbLink = req.body.fbLink;
                if (fbLink.indexOf('http') == -1)
                    fbLink = 'http://' + fbLink;

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
                if (req.file)
                    event.photo = '/uploads/' + req.file.filename;
                event.save(function() {
                    res.redirect('/events/' + linkName);
                });
            //} else {
            //    res.render('error', {message: "You don't have permission to view this", error: {status: "", stack: ""}});
            }
        })
});

//TODO: Admin Panel
router.get('/:eventLink/participants', userLogic.isEM, function (req, res) {
    Event.findOne({linkName: req.params.eventLink},
        function (err, event) {
            if(!event || err ) {
                res.render('error', {message: "Event not found!", error: {status: 404, stack: ''}});
            } else {
                var list = event.participants;
                if (!event.isTeamEvent) {
                    Account.find({_id: {$in: list}}).lean().exec(function (err, users) {
                        res.render('viewUsers', {participants: users, event: event, err: ""});
                    })
                } else {
                    Team.find({_id: {$in: list}}).populate('members captain').lean().exec(function(err, teams) {
                        res.render('viewTeams', {teams: teams, event: event, err: ""});
                    })
                }
            }
        })
});

router.get('/:eventLink/participants/:err', userLogic.isEM, function (req, res) {
    Event.findOne({linkName: req.params.eventLink},
        function (err, event) {
            if(!event || err ) {
                res.render('error', {message: "Event not found!", error: {status: 404, stack: ''}});
            } else {
                var list = event.participants;
                if (!event.isTeamEvent) {
                    Account.find({_id: {$in: list}}).lean().exec(function (err, users) {
                        res.render('viewUsers', {participants: users, event: event, err: req.params.err});
                    })
                } else {
                    Team.find({_id: {$in: list}}).populate('members captain').lean().exec(function(err, teams) {
                        res.render('viewTeams', {teams: teams, event: event, err: req.params.err});
                    })
                }
            }
        })
});

router.get('/:eventLink/participants.xls', userLogic.isEM, json2xls.middleware, function (req, res) {
    Event.findOne({linkName: req.params.eventLink},
        function (err, event) {
            if(!event || err ) {
                res.render('error', {message: "Event not found!", error: {status: 404, stack: ''}});
            } else {
                var list = event.participants;
                if (!event.isTeamEvent) {
                    Account.find({_id: {$in: list}}).lean().exec(function (err, users) {
                        res.xls(event.linkName + '.xlsx', users, {fields: ['inno_id', 'firstName', 'lastName', 'email', 'phone_no', 'college', 'course']});
                    })
                } else {
                    Team.find({_id: {$in: list}}).populate('members captain').lean().exec(function(err, teams) {
                        var out = [];
                        for (var i in teams) {
                           out.push({
                               inno_id: "Team",
                               firstName: teams[i].name,
                               lastName: "",
                               email: "",
                               phone_no: "",
                               college: "",
                               course: ""
                           });
                            out.push.apply(out, teams[i].members);
                        }
                        res.xls(event.linkName + '.xlsx', out, {fields: ['inno_id', 'firstName', 'lastName', 'email', 'phone_no', 'college', 'course']});
                    })
                }
            }
        })
});

router.post('/:eventLink/addParticipants', userLogic.isEM, function (req, res) {

});

module.exports = router;