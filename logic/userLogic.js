var express = require('express');
var Event = require('../models/event');
var Account = require('../models/account');
var Team = require('../models/team');

var users = {
    setLoginStatus: function(req, res, next) {
        if(req.isAuthenticated()) {
            res.locals.login = true;
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
        Team.find({members: req.user._id}).lean().execute(function(err, teams) {
            if (!err) {
                res.locals.teams = teams;
                next();
            }
        });
    },
    getEvents: function(req, res, next) {
        Team.find({members: req.user._id}).lean().execute(function(err, teams) {
            if (!err) {
                var captains = [];
                teams.forEach(function(team, index, arr) {
                    captains.push(team.captain);
                });
                var eventsParticipating = [];
                Event.find({isTeamEvent: true, participants: {$in: captains}}).lean().exec(function(err, events) {
                    eventsParticipating = events;
                });
                Event.find({isTeamEvent: false, participants: req.user._id}).lean().exec(function(err, events) {
                    eventsParticipating.add(events);
                });
                req.eventList = eventsParticipating;
            }
        });
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
    }
};

module.exports = users;