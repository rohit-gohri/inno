var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account');
var Team = require('../models/team');
var multer = require('multer');
var userLogic = require('../logic/userLogic');
var eventLogic = require('../logic/eventLogic');

var upload = multer({
    dest: 'public/uploads/',
    limits: {fileSize: 10000000, files:1},
}).single('eventPhoto');


router.get('/', function (req, res) {
    Event.find({}).lean().exec(function (err, events) {
        console.log(events);
        res.render('eventList', {events: events});
    });
});

router.post('/:eventLink/register/', userLogic.ensureAuthenticated, function (req, res){

    var elink=req.params.eventLink;
    var teamName = req.body.teamName;
    var id = req.user._id;

    //console.log('teamname:'+teamName);

    Event.findOne({linkName: elink}, function(err, event) {

        if (!event || err){
            res.render('error', {message: "Event not found", error: {status: '', stack: ''}});
        }


        // team event
        else if (event.isTeamEvent) {
            Team.findOne({name: teamName}, function(err, team){
                if(!team || err)
                    res.render('error', {message: "Error", error: {status: '', stack: ''}});
                console.log(team);
                event.participants.push(team._id);
                event.save(function (err, event) {
                    if(err)
                        console.log(err);
                    res.redirect('/events/' + event.linkName);
                });
            });
        }


        //non team event
        else {
            event.participants.push(id);
            event.save(function (err, event) {
                if(err)
                    console.log(err);
                res.render('event', {event: event, msg: "Successfully Registered"});
            });
        }
    });
});

router.get('/:eventLink/edit', userLogic.isEM, function (req, res) {
    Event.findOne({linkName: req.params.eventLink}, function (err, event) {
        if(err)
            console.log(err);
        else if (event.managers.indexOf(req.user._id) > -1 || req.user.is_admin) {
            res.render('addEvent', {event: event, edit: true});
        } else {
            res.render('error', {message:"You don't have permission to view this", error: {status:"", stack:""}});
        }
    })
});

router.post('/:eventLink/edit', userLogic.isEM,
    function(req, res) {
        Event.findOne({linkName: req.params.eventLink}, function (err, event) {
            if (err)
                console.log(err);
            else if (event.managers.indexOf(req.user._id) > -1 || req.user.is_admin) {
                var linkName = req.body.name;
                linkName = linkName.replace(/\s+/g, '-').toLowerCase();

                var trimmedDetails = req.body.details.substr(0, 50);
                trimmedDetails = trimmedDetails.substr(0, Math.min(trimmedDetails.length, trimmedDetails.lastIndexOf(" ")));
                trimmedDetails = trimmedDetails + '...';

                event.name = req.body.name;
                event.linkName = linkName;
                event.shortDetails = trimmedDetails;
                event.details = req.body.details;
                event.fbLink = req.body.fbLink;
                event.minParticipants = req.body.minParticipants;
                event.category = req.body.category;
                event.isTeamEvent = req.body.isTeamEvent == 1;

                event.save(function() {
                    res.redirect('/events/' + linkName);
                });
            } else {
                res.render('error', {message: "You don't have permission to view this", error: {status: "", stack: ""}});
            }
        })
});

router.get('/addEvent', userLogic.isEM, function (req, res) {
    res.render('addEvent', {event:{}})
});

router.post('/addEvent', userLogic.isEM,
    function (req, res, next) {
        upload(req, res, function (err) {
            if (err) {
                next();
            }
        })
    }, function(req, res) {
        var linkName = req.body.name;
        linkName = linkName.replace(/\s+/g, '-').toLowerCase();
        var trimmedDetails = req.body.details.substr(0, 50);
        trimmedDetails = trimmedDetails.substr(0, Math.min(trimmedDetails.length, trimmedDetails.lastIndexOf(" ")));
        trimmedDetails = trimmedDetails + '...';
        event = new Event({
            name: req.body.name,
            linkName: linkName,
            shortDetails: trimmedDetails,
            details: req.body.details,
            fbLink: req.body.fbLink,
            minParticipants: req.body.minParticipants,
            managers: [req.user._id],
            category: req.body.category,
            photo: '/uploads/' + req.file.filename,
            isTeamEvent: req.body.isTeamEvent == 1
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
                res.render('event', {event: event});
            }
    });
});

router.get('/:eventName/participants', function (req, res) {
    Event.findOne({name: req.params.eventName}),
        function (err, event) {
            if(!event || err ) {
                res.render('error', {message: "Event not found!!!", error: {status: '', stack: ''}});
            } else {
                //if(req.params.listType == 'participants') {
                    var list = event.participants;
                //} else if(req.params.listType == 'winners') {
                //    var list = event.winners;
                //} else if(req.params.listType == 'managers') {
                //    var list = event.managers;
                //}
                //Account.paginate({_id: list}, { page: req.query.page, limit: req.query.limit },
                //    function(err, users, pageCount, itemCount) {
                //        if (err) return next(err);
                //        res.render('participants', {
                //            participants: users,
                //            pageCount: pageCount,
                //            itemCount: itemCount,
                //            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                //        });
                //    });
            }
        }
});

module.exports = router;