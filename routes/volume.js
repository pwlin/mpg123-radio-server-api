/*jslint node:true*/
var express = require('express'),
    router = express.Router(),
    amixer = require('../libs/amixer');

/* /volume */
router.get('/', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundLevel = amixer.volumeGet();
    data.soundState = amixer.volumeState();
    res.status(200).jsonp(data);
});

/* /volume/up */
router.get('/up', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundLevel = amixer.volumeUp();
    res.status(200).jsonp(data);
});

/* /volume/down */
router.get('/down', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundLevel = amixer.volumeDown();
    res.status(200).jsonp(data);
});

/* /volume/set/:level */
router.get('/set/:level', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundLevel = req.params.level ? amixer.volumeSet(req.params.level) : 0;
    res.status(200).jsonp(data);
});

/* /volume/state */
router.get('/state', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundState = amixer.volumeState();
    res.status(200).jsonp(data);
});

/* /volume/toggle */
router.get('/toggle', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundState = amixer.volumeToggle();
    res.status(200).jsonp(data);
});

/* /volume/on */
router.get('/on', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundState = amixer.volumeOn();
    res.status(200).jsonp(data);
});

/* /volume/off */
router.get('/off', function (req, res, next) {
    'use strict';
    var data = {};
    data.httpStatus = 200;
    data.soundState = amixer.volumeOff();
    res.status(200).jsonp(data);
});

module.exports = router;