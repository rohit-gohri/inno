var express = require('express');
var Event = require('../models/event');
var router = express.Router();

router.get('/list', function (req, res) {
    var events = Event.findAll();
    res.render('eventList', {events: events});
});

router.get('/addEvent', function (req, res) {
    var user = req.user;
    if (!user) {
        res.render('error', {message: "Please login to view this"});
    }
    if (user.is_em) {
        res.render('addEvent')
    } else {
        res.render('error', {message: "You don't have permission to view this."});
    }
});

router.post('addEvent', function(req, res) {

});

module.exports = router;
