/*jslint node:true*/
var express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    res.status(200).jsonp(data);
});

module.exports = router;