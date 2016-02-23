var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Event = require('../models/event');
var userLogic = require('../logic/userLogic');


router.get('/details', userLogic.ensureAuthenticated, userLogic.getEvents, function (req, res) {
    res.render('details', {user: req.user, events: req.eventList});
});


router.post('/details', function (req, res) {
    Account.findOne({_id: req.user._id},
        function (err, user) {
            if(err) {
                res.render('error', {message: err.message, error: err});
            }
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.phone_no = req.body.phone_no;
            user.is_new = false;
            user.dob = req.body.dob;
            user.college = req.body.college;
            user.course = req.body.course;
            user.year = req.body.year;
            user.save(function (err, data) {
                if (err) {
                    console.log(err);
                    res.render('details', {user: req.user, edit: 'failure'})
                } else {
                    res.app.render('emails/welcome',{user:user},function(err,html) {
                        userLogic.sendMail(user[i].firstName, user[i].email,"You've registered ! ",html);
                    });
                    res.render('details', {user: data, edit: 'success'})
                }
            });
        });
});

router.get('/addEM', userLogic.isAdmin, function (req, res) {
    res.render('makeEM');
});

router.post('/addEM', userLogic.isAdmin, function(req, res) {
    var array = req.body.inno_ids.split(',');
    for(var i = 0; i < array.length; i++) {
        Account.findOne({inno_id: array[i]}, function(err, user) {
            if (err || !user)
                res.render('makeEM', {msg: "Failure"});
            else {
                user.is_em = true;
                user.save(function (err) {
                    if (!err)
                        res.render('makeEM', {msg: "Success"})
                });
            }
        })
    }
});

module.exports = router;
