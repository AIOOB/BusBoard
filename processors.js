const request = require('request-promise-native');
const log4js = require('log4js');

const logger = log4js.getLogger('processors');

const appID = 'fa99cefe';
const appKey = 'b6282f249791ac9e502921e556779b8b';

function getBusesNearPostcode(postcode) {
    logger.trace(`Getting buses near ${postcode}`);
    const postcodeURL = `http://api.postcodes.io/postcodes/${postcode}`;
    return request(postcodeURL).catch(error => {
        if (error.name === 'StatusCodeError') {
            error.message = JSON.parse(error.error).error;
        }
        throw error;
    }).then(body => {
        let postcodeInfo;
        try {
            postcodeInfo = JSON.parse(body);
        } catch (error) {
            error.message = 'Location of postcode not available: '  + error.message;
            throw error;
        }
        const longitude = postcodeInfo.result.longitude;
        const latitude = postcodeInfo.result.latitude;
        logger.trace(`Got ${latitude}, ${longitude} for postcode ${postcode}`);
        const busesURL = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}&app_id=${appID}&app_key=${appKey}`;
        return request(busesURL);
    }).then((body) => {
        let tflResult;
        try {
            tflResult = JSON.parse(body);
        } catch (error) {
            error.message = 'TFL query of nearby stops failed: ' + error.message;
            throw error;
        }
        if (tflResult.stopPoints.length === 0) {
            throw new Error('No stops found near postcode');
        }
        return Promise.all(tflResult.stopPoints.slice(0, 2).map(stopPoint => {
            return getBusesForStopCode(stopPoint.naptanId).then((buses) => ({
                stopName: stopPoint.commonName,
                nextBuses: buses,
            }));``
        }));
    });
}

function getBusesForStopCode(stopCode) {
    logger.trace(`Getting buses for stopcode ${stopCode}`);
    const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=${appID}&app_key=${appKey}`;
    return request(arrivalsUrl).then((body) => {
        let busData;
        try {
            busData = JSON.parse(body);
        } catch (error) {
            logger.error(error);
            error.message = 'TFL query of arriving buses failed: ' + error.message;
            throw error;
        }
        logger.trace(`Got buses ${JSON.stringify(busData)}`);
        return busData.sort((a, b) => a.timeToStation - b.timeToStation).slice(0, 5).map((bus) => ({
            lineName: bus.lineName,
            destination: bus.destinationName,
            timeToStation: Math.round(bus.timeToStation / 60),
        }));
    });
}

module.exports = {
    getBusesForStopCode,
    getBusesNearPostcode,
};