var express = require('express');
var Event = require('../models/event');
var router = express.Router();

router.get('/list', function (req, res) {
    var events = Event.findAll();
    res.render('eventList', {events: events});
});

router.post('/addEvent', function (req, res) {
    var user = req.user;
    if (user.is_em) {
        res.render()
    } else {
        res.render('error', {message: "You don't have permission to do this"});
    }
});

module.exports = router;
