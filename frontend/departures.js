postcode = undefined;

function updateBuses() {
    if (!postcode) {
        return;
    }

    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', './departureBoards?postcode=' + window.postcode, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function () {
        var results = document.getElementById("results");
        if (xhttp.status == 200) {
            var stops = JSON.parse(xhttp.responseText);
            results.innerHTML = '<h2>Results</h2>' + stops.map(stop => {
                return '<h3>' + stop.stopName + '</h3> <ul>' + stop.nextBuses.map(bus => {
                    return '<li>' + bus.timeToStation + ' minutes: ' + bus.lineName + ' to ' + bus.destination + '</li>'
                }).join('') + '</ul>';
            }).join('');
        } else {
            results.innerHTML = '<h2>Results</h2><h3>' + xhttp.responseText + '</h3>';
        }
    }

    xhttp.send();
}

setInterval(updateBuses, 30000);