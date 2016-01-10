/*jshint node:true*/
var debug = require('debug')('MPG123-Radio-Server-API'),
    utils = require('./utils'),
    config = require('../config.json'),
    mpg123 = require('./mpg123'),
    fs = require('fs'),
    routes = {},
    server;

routes.index = require('../routes/index');
routes.play = require('../routes/play');
routes.stop = require('../routes/stop');
routes.currentsong = require('../routes/currentsong');
routes.volume = require('../routes/volume');
routes.thumbs = require('../routes/thumbs');

function serve() {
    'use strict';
    var express = require('express'),
        app = express();

    app.disable('etag');
    app.disable('x-powered-by');
    app.use(function (req, res, next) {
        //res.removeHeader('X-Powered-By');
        //res.header('Content-Type', 'text/javascript; charset=utf-8');
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('Connection', 'close');
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        if (config.CORS.ENABLED === true) {
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Origin', config.CORS.ALLOW_ORIGIN || '*');
        }
        next();
    });

    app.use('/', routes.index);
    app.use(['/play', '/restart'], routes.play);
    app.use('/stop', routes.stop);
    app.use('/currentsong', routes.currentsong);
    app.use('/volume', routes.volume);
    app.use('/thumbs', routes.thumbs);


    /// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        res.status(404).jsonp({
            httpStatus: 404,
            message: 'Not Found'
        });
    });

    /// error handlers
    app.use(function (err, req, res, next) {
        if (app.get('env') === 'development') {
            debug('Internal Server Error:');
            debug(err);
        }
        res.status(500).jsonp({
            httpStatus: 500,
            message: err.message
        });
    });
    app.set('ip', config.SERVER.HOST || '127.0.0.1');
    app.set('port', config.SERVER.PORT || 3000);
    server = app.listen(app.get('port'), app.get('ip'), function () {
        debug('Server listening on ' + server.address().address + ':' + server.address().port);
        if (utils.isFile(mpg123.lastStationUrlFile())) {
            mpg123.play(fs.readFileSync(mpg123.lastStationUrlFile()).toString());
        }
    });
}

module.exports = serve;