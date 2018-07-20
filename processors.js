function printBuses(busInfo) {
    const busData = JSON.parse(busInfo);
    for (i = 0; i < 5; i++) {
        const bus = busData[i];
        console.log(`Line number ${bus.lineName} to ${bus.destinationName} coming in ${Math.round(bus.timeToStation / 60)}m`)
    }
}

module.exports = {printBuses};