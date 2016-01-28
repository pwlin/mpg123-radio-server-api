/*jshint node:true*/
var utils = require('./utils'),
    config = require('../config.json'),
    path = require('path'),
    debug = require('debug')('MPG123-Radio-Server-API::mpg123.js'),
    fs = require('fs'),
    whoami = null,
    lastStationUrl = '',
    currentSongCachedLogFileStat = null,
    currentSongCachedObject = null;

function whoIAm() {
    'use strict';
    if (whoami === null) {
        whoami = utils.shellExecSync('whoami').trim();
    }
    return whoami;
}

function logFile() {
    'use strict';
    return path.join(config.LOGS.MAIN_PATH, 'mpg123-radio-server-api-' + whoIAm() + '.log');
}

function lastStationUrlFile() {
    'use strict';
    return path.join(config.LOGS.MAIN_PATH, 'mpg123-radio-server-api-' + whoIAm() + '-last-station-url.txt');
}

function play(stationUrl) {
    'use strict';
    if (!stationUrl) {
        return;
    }
    debug('Playing: ' + stationUrl);
    fs.writeFileSync(lastStationUrlFile(), stationUrl);
    lastStationUrl = stationUrl;
    try {
        utils.shellExecSync('killall mpg123');
    } catch (e) {}
    try {
        utils.shellExecSync('mpg123 --loop -1 -@ "' + stationUrl + '" > ' + logFile() + ' 2>&1 &');
    } catch (e) {}
}

function stop() {
    'use strict';
    debug('Stop');
    lastStationUrl = '';
    try {
        utils.shellExecSync('killall mpg123');
    } catch (e) {}
    try {
        fs.unlinkSync(logFile());
    } catch (e) {}
    try {
        fs.unlinkSync(lastStationUrlFile());
    } catch (e) {}
}

function currentSong() {
    'use strict';
    var data = {},
        contents = '',
        tmpCurrentSongLogFileStat = [],
        stationName = [],
        trackName = [],
        audioProperties = '';
    try {
        tmpCurrentSongLogFileStat = fs.statSync(logFile());
        if (currentSongCachedObject !== null &&
            currentSongCachedLogFileStat !== null &&
            currentSongCachedLogFileStat.mtime &&
            tmpCurrentSongLogFileStat.mtime &&
            tmpCurrentSongLogFileStat.mtime.getTime() === currentSongCachedLogFileStat.mtime.getTime()) {
            data = currentSongCachedObject;
            //debug('Sending current song info from cache');
        } else {
            //debug('Sending NEW current song info');
            contents = fs.readFileSync(logFile()).toString();
            //debug(contents);

            data.stationUrl = lastStationUrl;
            if (contents.match(/HTTP request failed/)) {
                data.stationName = 'HTTP request failed. Invalid Station Or Try Again';
                data.audioProperties = {
                    format: '',
                    bitrate: '',
                    sampleRate: ''
                };
                data.trackName = '';
                data.artistName = '';
            } else {
                stationName = contents.match(/ICY-NAME\:(.*)/);
                if (stationName instanceof Array && stationName.length > 0) {
                    data.stationName = stationName[1].trim();
                } else {
                    data.stationName = '';
                }

                audioProperties = contents.match(/MPEG (.*) layer(.*)/g);
                if (audioProperties instanceof Array && audioProperties.length > 0) {
                    audioProperties = audioProperties[0].split(',');
                    data.audioProperties = {
                        format: audioProperties[0].trim(),
                        bitrate: audioProperties[1].trim(),
                        sampleRate: audioProperties[2].trim()
                    };
                } else {
                    data.audioProperties = {
                        format: '',
                        bitrate: '',
                        sampleRate: ''
                    };
                }

                trackName = contents.match(/ICY-META\: StreamTitle='(.*)';/g);
                if (trackName instanceof Array && trackName.length > 0) {
                    trackName = trackName[trackName.length - 1];
                    trackName = trackName.replace(/^ICY-META\: StreamTitle='|';$|';StreamUrl='(.*)/g, '').trim();
                    data.trackName = trackName;
                    trackName = trackName.split(' - ');
                    if (trackName.length > 0) {
                        data.artistName = trackName[0].trim();
                        trackName.shift();
                        data.trackName = trackName.join(' - ');
                    } else {
                        data.artistName = '';
                    }
                } else {
                    data.trackName = '';
                    data.artistName = '';
                }
            }

            currentSongCachedObject = data;
            currentSongCachedLogFileStat = {
                mtime: tmpCurrentSongLogFileStat.mtime
            };
        }
    } catch (e) {
        //debug('ERROR CurrentSong:');
        //debug(e);
        data.stationUrl = '';
        data.stationName = '';
        data.trackName = '';
        data.artistName = '';
        data.audioProperties = {
            format: '',
            bitrate: '',
            sampleRate: ''
        };
    }
    return data;
}

//======= exports 
exports.play = play;
exports.stop = stop;
exports.currentSong = currentSong;
exports.lastStationUrlFile = lastStationUrlFile;