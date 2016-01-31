var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account')

router.get('/', function (req, res) {
    var events = Event.find();
    res.render('eventList', {events: events});
});

router.get('/addEvent', function (req, res) {
    Account.findOne({_id: req.user._id});
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
