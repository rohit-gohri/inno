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

            first_edit = 0;

            if(user.is_new) {
                first_edit = 1;
            }
            if (user.email == null) {
                user.email = req.body.email;
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
                    if(first_edit) {
                        var set = function(val, inno_id) {
                            if (!val) {
                                console.log("Error: " + inno_id);
                            }
                        };
                        res.app.render('emails/welcome', {user: user}, function (err, html) {
                            userLogic.sendMail(user.email, "Welcome to Innovision'16!",
                                "Greetings " + user.firstName + " ,Now that you've registered for Innovision '16, we welcome you to this four dimensional journey through space-time.Your INNO ID is "+data.inno_id+"You will be able to register for events and participate in them (and probably win exciting prizes!) with this. Please carry your INNO ID and an identification proof on the days of the fest, i.e. 9th to 12th March. If you have any further queries please drop us a mail at pr.innovision.nsit@gmail.com. See you there, Team Innovision"
                                , html, user.inno_id, set);
                        });
                    }
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
                    else
                        res.render('makeEM', {msg: "Failure"});
                });
            }
        })
    }
});

module.exports = router;
