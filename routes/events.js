var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account')

router.get('/', function (req, res, next) {
    if(req.event) {
        Event.findOne({name: 'req.event.name'},
            function (err, event) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('event', {event: event});
                }
            });
    }
    var events = Event.find();
    res.render('eventList', {events: events});
});

router.get('/addEvent', function (req, res) {
    Account.findOne({_id: req.user._id},
    function(err, user) {
        if (!user || err) {
            res.render('error', {message: "Please login to view this", error: {status: '', stack: ''}});
        }
        if (user.is_em || user.is_admin) {
            res.render('addEvent')
        } else {
            res.render('error',
                {message: "You don't have permission to view this.", error: {status: '', stack: ''}});
        }

    });
});

router.post('addEvent', function(req, res) {
    var name = req.body.name;
    var details = req.body.details;
    var fbLink = req.body.fbLink;
    var minParticipants = req.body.minParticipants
    Account.findOne({_id: req.user._id},
        function(err, user) {
            if (!user || err) {
                res.render('error', {message: "Please login to edit this", error: {status: '', stack: ''}});
            }
            if (user.is_em || user.is_admin) {
                event = new Event({
                    name: name,
                    details: details,
                    fbLink: fbLink,
                    minParticipants: minParticipants
                })
                res.render('addEvent')
            } else {
                res.render('error',
                    {message: "You don't have permission to edit this.", error: {status: '', stack: ''}});
            }

        });
});

module.exports = router;
