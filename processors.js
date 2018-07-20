const request = require('request');

const appID = 'fa99cefe';
const appKey = 'b6282f249791ac9e502921e556779b8b';

function printBusesNearPostcode(postcode) {
    const postcodeURL = `http://api.postcodes.io/postcodes/${postcode}`;
    return request(postcodeURL, (error, response, body) => {
        const postcodeInfo = JSON.parse(body);
        const longitude = postcodeInfo.result.longitude;
        const latitude = postcodeInfo.result.latitude;
        const busesURL = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}&app_id=${appID}&app_key=${appKey}`;
        return request(busesURL, (error, response, body) => {
            const stopPoints = JSON.parse(body);
            for(let i = 0; i < 2; i++) {
                let stopPoint = stopPoints.stopPoints[i];
                printBusesForStopCode(stopPoint.naptanId);
            }
        });
    })
} 

function printBusesForStopCode(stopCode) {
    const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=${appID}&app_key=${appKey}`;
    return request(arrivalsUrl, (error, response, body) => {
        const busData = JSON.parse(body);
        console.log(busData[0].stationName);
        for (i = 0; i < 5; i++) {
            const bus = busData[i];
            console.log(`  Line number ${bus.lineName} to ${bus.destinationName} coming in ${Math.round(bus.timeToStation / 60)}m`);
        }
    });
}

module.exports = {
    printBusesForStopCode,
    printBusesNearPostcode,
};