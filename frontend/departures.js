let refreshId;

function updateBuses(postcode) {
    clearTimeout(refreshId)

    if (!postcode) {
        return;
    }

    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', './departureBoards?postcode=' + postcode, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function () {
        var results = document.getElementById("results");

        if (xhttp.status !== 200) {
            results.innerHTML = '<h2>Results</h2><h3>' + xhttp.responseText + '</h3>';
            return;
        }

        var stops = JSON.parse(xhttp.responseText);
        results.innerHTML = '<h2>Results</h2>' + stops.map(stop => 
            '<h3>' + stop.stopName + '</h3> <ul>' + stop.nextBuses.map(bus => 
                '<li>' + bus.timeToStation + ' minutes: ' + bus.lineName + ' to ' + bus.destination + '</li>'
            ).join('') + '</ul>'
        ).join('');
        
        refreshId = setTimeout(updateBuses, 30000, postcode);
    }

    xhttp.send();
}