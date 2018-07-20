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

readlineSync.setDefaultOptions({prompt: 'Enter the post code: '})
readlineSync.promptLoop((input) => processors.printBusesNearPostcode(input));
// readlineSync.promptLoop((input) => processors.printBusesForStopCode(input));

