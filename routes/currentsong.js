/*jslint node:true*/
var express = require('express'),
    router = express.Router(),
    mpg123 = require('../libs/mpg123');

/* /currentsong */
router.get('/', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.currentsong = mpg123.currentSong();
    res.status(200).jsonp(data);
});

module.exports = router;