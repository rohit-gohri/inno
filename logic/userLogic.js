var express = require('express');
var Event = require('../models/event');
var Account = require('../models/account');
var Team = require('../models/team');
var emailer  = require('nodemailer');


var users = {
    setLoginStatus: function(req, res, next) {
        if(req.isAuthenticated()) {
            res.locals.login = true;
            res.locals.firstName = req.user.firstName;
            res.locals.is_admin = req.user.is_admin;
            res.locals.is_em = req.user.is_em;
        } else {
            res.locals.login = false;
            res.locals.is_admin = false;
            res.locals.is_em = false;
        }
        next();
    },
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    },
    getTeams: function(req, res, next) {
        if(req.isAuthenticated()) {
            Team.find({members: req.user._id}).lean().exec(function (err, teams) {
                if (!err) {
                    res.locals.teams = teams;
                    next();
                }
            });
        }
        else {
            res.locals.teams = [];
            next();
        }
    },
    getEvents: function(req, res, next) {
        //var captains = [];
        req.eventList = [];
        Event.find({isTeamEvent: false, participants: req.user._id})
            .lean().exec(function(err, events) {
                req.eventList = events;
                console.log(events);
                next();
        });

        //
        //Team.find({members: req.user._id}).lean().exec( function(err, teams, next) {
        //    if (err) {
        //        req.eventList = [];
        //    } else {
        //        teams.forEach(function(team, index, arr) {
        //            captains.push(team.captain);
        //        });
        //        next();
        //    }
        //});
        //Event.find({isTeamEvent: true, participants: {$in: captains}}).lean().exec(function(err, events) {
        //    eventsParticipating = events;
        //    console.log(events);
        //}).then(Event.find({isTeamEvent: false, participants: req.user._id}).lean().exec(function(err, events) {
        //    console.log(events);
        //    eventsParticipating.push.apply(eventsParticipating, events);
        //})).then(function() {
        //    console.log(eventsParticipating);
        //    req.eventList = eventsParticipating;
        //}).then(next());
    },
    isAdmin: function(req, res, next) {
        if(req.isAuthenticated()) {
            if(req.user.is_admin)
                return next();
            else
                res.render("error", {message: "You don't have permissions to view this"});
        } else {
            res.redirect('/login');
        }
    },
    isEM: function(req, res, next) {
        if(req.isAuthenticated()) {
            if(req.user.is_em || req.user.is_admin)
                return next();
            else
                res.render("error", {message: "You don't have permissions to view this"});
        } else {
            res.redirect('/login');
        }
    },
    sendMail: function(req, res, next) {

    }
};

module.exports = users;