var express = require('express');
var Event = require('../models/event');
var Account = require('../models/account');
var Team = require('../models/team');

var events = {

    isRegistered: function (req, res, next) {
        console.log('inside is registered');
        if(req.isAuthenticated()) {
            Event.findOne({linkName: req.params.eventLink}, function (err, event) {
                if(err || !event) {
                    console.log(err);
                    //res.redirect('/');
                }
                else {
                    res.locals.is_registered = false;
                    //console.log('isregistere: '+event.name);
                    if(event.isTeamEvent) {
                        for( var i=0; i<res.locals.teams.length; i++) {
                            if(event.participants.indexOf(res.locals.teams[i]._id)!=-1) {
                                res.locals.is_registered = true;
                                console.log("true team");
                                break;
                            }
                        }
                    }
                    else {
                        if(event.participants.indexOf(req.user._id)!=-1) {
                            res.locals.is_registered = true;
                            console.log("true single");
                        }
                    }
                    console.log('is registered: '+res.locals.is_registered);
                    next();
                }
            });
        }
        else {
            next();
        }
    }

};

module.exports = events;