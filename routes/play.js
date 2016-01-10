/*jslint node:true*/
var express = require('express'),
    router = express.Router(),
    mpg123 = require('../libs/mpg123');

/* /play/:stationUrl */
router.get('/:stationUrl', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    if (req.params.stationUrl) {
        mpg123.play(req.params.stationUrl);
    }
    res.status(200).jsonp(data);
});

module.exports = router;