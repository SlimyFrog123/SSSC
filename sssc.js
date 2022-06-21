let stations = {
    'A': {
        'station_name': 'A',
        'station_id': 1
    },
    'B': {
        'station_name': 'B',
        'station_id': 2
    },
    'C': {
        'station_name': 'e',
        'station_id': 3
    },
    'D': {
        'station_name': 'D',
        'station_id': 4
    },
    'E': {
        'station_name': 'E',
        'station_id': 5
    }
};

let stationsContainer;


class SprinklerController {
    constructor(stations, server) {
        this.stations = stations;
        this.server = server;
    }

    init() {
        // Initialize the SprinklerController
    }

    startStation(stationID, callback = function(data, status) { console.log(data); console.log(status); }) {
        // Start a specific station
        $.post(this.server + encodeURI("sn?sid=" + String(stationID) + "&set_to=1"), {}, function(data, status) {
            callback(data, status)
        });
    }

    stopStation(stationID, callback = function(data, status) { console.log(data); console.log(status); }) {
        // Stop a specific station
        $.post(this.server + encodeURI("sn?sid=" + String(stationID) + "&set_to=0"), {}, function(data, status) {
            callback(data, status)
        });
    }

    getStatus(stationID, callback = function(data, status) { console.log(data); console.log(status); }) {
        // Get the status of a specific station
        $.get(this.server + encodeURI("sn?sid=" + String(stationID)), function(data, status) {
            callback(data, status);
        });
    }
}

$(document).ready(function() {
    stationsContainer = $('#stations-container');

    let SC = new SprinklerController(stations, "http://127.0.0.1/sip/");
    SC.init();
    SC.startStation(1);
});