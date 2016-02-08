var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account');
var multer = require('multer');

var upload = multer({
    dest: 'public/uploads/',
    limits: {fileSize: 10000000, files:1},
});

router.get('/', function (req, res) {

    Event.find({}).lean().exec(function (err, events) {
        console.log(events);
        res.render('eventList', {events: events});
    });

});

router.post('/:eventName/register', function (req, res){
     

    var ename=req.params.eventName;
    var id=req.user._id;
    console.log(id);
    console.log(ename);
    Event.findOne({name: ename},
        function(err,even) {
            if(!even || err){
                 res.render('error', {message: "Please login to view this", error: {status: '', stack: ''}});
            }
            else if(even.isTeamEvent)
            {

                Account.findOne({inno_id: id},
                function(err,user){
                    if(!even || err){
                        res.render('error', {message: "Please login to view this", error: {status: '', stack: ''}});
                    }
                    var teamid=user.team;
                    console.log(teamid);
                    console.log(even.teams);
                    even.teams.push(teamid);
                    console.log(even.teams);
                    even.save(function (err, event) {
                    if(err) {
                        console.log(err);
                    }
                    res.render('event', {event: event});
                    });
                }); 

            }
            else
            {
            var members=even.participants;
            console.log(members);
            even.participants.push(id);
            console.log(members);
            even.save(function (err, event) {
                    if(err) {
                        console.log(err);
                    }
                    res.render('event', {event: event});
                });
            }
        });

});

router.get('/edit', function (req, res) {
    Event.find({managers: req.user._id },
        function (err, event) {
            if(err) {
                console.log(err);
            }
            else {
                res.render('event', {event: event});
            }
    })

} );

router.get('/addEvent', function (req, res) {
    Account.findOne({email: req.user.email},
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

router.post('/addEvent', upload.single('eventPhoto'), function(req, res) {
    Account.findOne({_id: req.user._id},
        function(err, user) {
            if (!user || err) {
                res.render('error', {message: "Please login to edit this", error: {status: '', stack: ''}});
            }
            if (user.is_em || user.is_admin) {
                event = new Event({
                    name: req.body.name,
                    details: req.body.details,
                    fbLink: req.body.fbLink,
                    minParticipants: req.body.minParticipants,
                    managers: [req.user._id],
                    category: req.body.category,
                    photo: '/uploads/' + req.file.filename
                });
                event.save(function (err, event) {
                    if(err) {
                        console.log(err);
                    }
                    var red = '' + event.name;
                    res.redirect(red);
                });
            } else {
                res.render('error',
                    {message: "You don't have permission to edit this.", error: {status: '', stack: ''}});
            }

        });
});

router.get('/:eventName', function (req, res) {
    Event.findOne({name: req.params.eventName},
        function (err, event) {
            if(!event || err ) {
                res.render('error', {message: "Event not found!!!", error: {status: '', stack: ''}});
            }
            else {
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