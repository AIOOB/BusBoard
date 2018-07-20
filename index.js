const request = require('request');
const readlineSync = require('readline-sync');
const log4js = require('log4js');
const processors = require('./processors');

log4js.configure({
    appenders: {
        file: {
            type: 'fileSync',
            filename: 'logs/debug.log'
        }
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug'
        }
    }
});
const logger = log4js.getLogger('index.js');
logger.info('Logging Initialised');

const appID = 'fa99cefe';
const appKey = 'b6282f249791ac9e502921e556779b8b';
const arrivalsUrl = (stopCode) => `https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=${appID}&app_key=${appKey}`;

readlineSync.setDefaultOptions({prompt: 'Enter the stop code: '})
readlineSync.promptLoop((input) => request(arrivalsUrl(input), (error, response, body) => processors.printBuses(body)));



