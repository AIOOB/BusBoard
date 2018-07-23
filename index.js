const express = require('express');
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
            level: 'trace'
        }
    }
});
const logger = log4js.getLogger('index');
logger.info('Logging Initialised');
const app = express();

app.get('/departureBoards', (req, res) => processors.getBusesNearPostcode(req.query.postcode)
    .then((json) => res.send(json))
    .catch((error) => {
        logger.error(error);
        if (error.name === 'StatusCodeError') {
            res.status(error.statusCode).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }));
app.use(express.static('frontend'));
app.listen(80);

logger.info('Webserver initialised');
