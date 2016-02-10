var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Event = require('../models/event');
var userLogic = require('../logic/userLogic');


router.get('/details', userLogic.ensureAuthenticated, function (req, res) {
    res.render('details', {user: req.user});
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
                } else {
                    res.render('details', {user: data, edit: 'success'})
                }
            });
        });
});

module.exports = router;
