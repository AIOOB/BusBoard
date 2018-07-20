function updateBuses() {
    var xhttp = new XMLHttpRequest();
    
    xhttp.open('GET', './departureBoards?postcode=' + document.getElementById('postcode').value, true);
    
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function() {
        var stops = JSON.parse(xhttp.responseText);
        document.getElementById("results").innerHTML = '<h2>Results</h2>' + stops.map(stop => {
            return '<h3>' + stop.stopName + '</h3> <ul>' + stop.nextBuses.map(bus => {
                return '<li>' + bus.timeToStation + ' minutes: ' + bus.lineName + ' to ' + bus.destination + '</li>' 
            }).join('') + '</ul>';
        }).join('')
        // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
    }
    
    xhttp.send();
}