var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/details', function (req, res) {
    res.render('/details', {user: req.user});
});

router.post('/details', function (req, res) {
    var user = req.user;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.dob = req.body.dob;
    user.college = req.body.college;
    user.course = req.body.course;
    user.year = req.body.year;
    user.save(function (err) {
        if (err) console.log(err);
        res.redirect('details', {})
    });
});

module.exports = router;
