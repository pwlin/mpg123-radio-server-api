/*jslint node:true*/
var config,
    error;
try {
    config = require('./config.json');
} catch (e) {
    error = "========== MPG123-RADIO-SERVER-API-INIT ERROR ==========\n";
    if (e.code === 'MODULE_NOT_FOUND') {
        error += "The configuration file (config.json) does not exists.\n";
        error += "Rename config.json.sample to config.json and run the app again.\n";
    } else {
        error += "The configuration file (config.json) contains error(s):\n\n";
        error += e + "\n\n";
        error += "Please correct the error(s) and run the app again.\n";
    }
    error += "Exiting...\n";
    error += "===========================";
    console.error(error);
    process.exit();
}

process.env.NODE_ENV = config.NODE_ENV;
process.env.DEBUG = config.DEBUG;

var serve = require('./libs/serve');

serve();