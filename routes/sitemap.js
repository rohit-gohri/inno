var express = require('express');
var Events = require('../models/event');
var router = express.Router();
var config = require('config');

var URL = config.get('url');

var sitemap = require('sitemap'),
    sm = sitemap.createSitemap({
        hostname : URL,
        cacheTime : 1000 * 60 * 24,  //keep the sitemap cached for 24 hours
        urls : [
            {url: '/'},
            {url: '/events', priority: 1.0},
            {url: '/events/category/Mega', priority: 0.8},
            {url: '/events/category/Coding', priority: 0.7},
            {url: '/events/category/Hardware', priority: 0.7},
            {url: '/events/category/Robotica', priority: 0.7},
            {url: '/events/category/Quiz', priority: 0.7},
            {url: '/events/category/Bio', priority: 0.7},
            {url: '/events/category/Online', priority: 0.7},
            {url: '/events/category/Miscellaneous', priority: 0.7},
            {url: '/schedule', priority: 0.8},
            {url: '/sponsors', priority: 0.7},
            {url: '/campus', priority: 0.7},
            {url: '/contact', priority: 0.8},
            {url: '/about', priority: 0.7},
            {url: '/login', priority: 0.9},
            {url: '/register', priority: 0.7}
        ]
    });

function addEventsToSitemap(events){
    for (var event in events){
        sm.add({
            url : URL + '/events/' +  events[event].linkName
        });
        console.log(events[event]);
    }
}

router.get('/sitemap.xml', function(req, res){
    //only update the sitemap if the cache is expired
    if (sm.isCacheValid()){
        sm.toXML(function(err, xml){
            if (err) {
                return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send( xml );
        });
    }
    else{
        //reset sitemap to include defaults
        sm.urls = [
            {url: '/events/category/Mega'},
            {url: '/events/category/Coding'},
            {url: '/events/category/Hardware'},
            {url: '/events/category/Robotica'},
            {url: '/events/category/Quiz'},
            {url: '/events/category/Bio'},
            {url: '/events/category/Online'},
            {url: '/events/category/Miscellaneous'},
            {url: '/schedule'},
            {url: '/sponsors'},
            {url: '/campus'},
            {url: '/contact'},
            {url: '/about'},
            {url: '/login'},
            {url: '/register'}
        ];

        //get every post from the database
        Events.find({}).lean().exec(function(err, events){
            //if some error occurs, generate an empty sitemap instead of aborting
            if (err){
                console.log(err);
            }
            else{
                addEventsToSitemap(events);
            }
            sm.toXML(function(err, xml){
                if (err) {
                    return res.status(500).end();
                }
                res.header('Content-Type', 'application/xml');
                res.send( xml );
            });
        })
    }
});

module.exports = router;