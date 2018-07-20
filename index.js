const request = require('request');
const readlineSync = require('readline-sync');
const log4js = require('log4js');

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
