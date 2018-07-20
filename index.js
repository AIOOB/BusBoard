const app = require('express')();
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

app.get('/departureBoards', (req, res) => processors.getBusesNearPostcode(req.query.postcode)
    .then((json) => res.send(json))
    .catch((error) => res.status(404).send('Invalid postcode')));
app.listen(80);
