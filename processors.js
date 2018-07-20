const request = require('request-promise-native');

const appID = 'fa99cefe';
const appKey = 'b6282f249791ac9e502921e556779b8b';

function getBusesNearPostcode(postcode) {
    const postcodeURL = `http://api.postcodes.io/postcodes/${postcode}`;
    return request(postcodeURL).then((body) => {
        const postcodeInfo = JSON.parse(body);
        const longitude = postcodeInfo.result.longitude;
        const latitude = postcodeInfo.result.latitude;
        const busesURL = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}&app_id=${appID}&app_key=${appKey}`;
        return request(busesURL);
    }).then((body) => {
        const stopPoints = JSON.parse(body);
        return Promise.all(stopPoints.stopPoints.slice(0,2).map(stopPoint => {
            return getBusesForStopCode(stopPoint.naptanId).then((buses) => ({
                stopName: stopPoint.commonName,
                nextBuses: buses,
            }));
        }));
    });
} 

function getBusesForStopCode(stopCode) {
    const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=${appID}&app_key=${appKey}`;
    return request(arrivalsUrl).then((body) => {
        const busData = JSON.parse(body);
        return busData.slice(0, 5).map((bus) => ({
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