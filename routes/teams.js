var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account');
var Team = require('../models/team');
var userLogic = require('../logic/userLogic');

router.get('/myteams', function(req, res) {
    Account.findOne({_id: req.user._id}, function(err, user) {
        if (err) {
            res.render('error');
        } else {
            Team.find({members: user._id}).lean().execute(function(err, teams) {
                if(err)
                    res.render('error', {message:"Sorry!", error: err});
                res.render('team', {user:user, teams: teams});
            })
        }
    })
});

router.get('/newTeam', userLogic.ensureAuthenticated, function(req, res) {
    res.render('addTeam', {user: {inno_id: req.user.inno_id}});
});

router.post('/newTeam', function(req, res) {
    //console.log(req.body.category);
    var count=req.body.category;
    count--;
    var inno = [];
    if(count){
    var id2 = req.body.mem2;
        count--;
        inno.push(id2);
    }
    if(count){
    var id3 = req.body.mem3;
        count--;
        inno.push(id3);
    }
    if(count){
    var id4 = req.body.mem4;
        count--;
        inno.push(id4);
    }
    if(count){
    var id5 = req.body.mem5;
        count--;
        inno.push(id5);
    }
    console.log(inno);
    var id1 = req.user.inno_id;
    var tname = req.body.name;

    var captain = null;

    var mem = [];
    var err = [];
    
    Account.findOne({_id: req.user._id}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if(!user) {
                res.render('error', {message: "Please login",
                    err: {status: error.statusCode, stack: error.stack}});
            }

            captain = req.user._id;
            
        }
    });

    Account.find({inno_id:{ $in: inno }},function(err, users) {
        console.log("in");
       if (err) {
            console.log(err);
        } 
        else
        {
            if(users)
            {
                console.log(users);
                for(var i=0;i<users.length;i++)
                {
                    console.log(users[i]._id);
                    mem.push(users[i]._id);
                    console.log("mem is");
                    console.log(mem);
                }
                team = new Team({
                name: tname,
                members: mem,
                captain: captain
            });

            team.save(function (err, Team) {
                if(err) {
                    console.log(err);
                }
                //render here
                //  var red = '' + Team.name;
               // res.render('addTeam');
            });
            }
        }
});
         });
    
module.exports = router;
