/*jshint node:true*/
var util = require('util'),
    sh = require('child_process'),
    fs = require('fs');

function log(mix) {
    'use strict';
    console.log(util.inspect(mix, false, null));
}

function logd(mix) {
    'use strict';
    console.log(new Date().toLocaleString() + ' ', util.inspect(mix, false, null));
}

function isFile(filePath) {
    'use strict';
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

function shellExecSync(cmd) {
    'use strict';
    return sh.execSync(cmd, {
        encoding: 'utf8',
        // http://stackoverflow.com/a/31104898/374577
        stdio: [ /*0, 1, 2*/ ]
    });
}

function shellSpawnSync(cmd, args) {
    'use strict';
    args = args || [];
    var output = sh.spawnSync(cmd, args, {
        encoding: 'utf8',
        stdio: [0, 1, 2]
    });
    return output;
}

//======= exports 
exports.log = log;
exports.logd = logd;
exports.isFile = isFile;
exports.shellExecSync = shellExecSync;
exports.shellSpawnSync = shellSpawnSync;