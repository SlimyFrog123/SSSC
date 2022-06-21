let stations = [
    {
        'station_name': 'A',
        'station_id': 1
    },
    {
        'station_name': 'B',
        'station_id': 2
    },
    {
        'station_name': 'C',
        'station_id': 3
    },
    {
        'station_name': 'D',
        'station_id': 4
    },
    {
        'station_name': 'E',
        'station_id': 5
    }
];

let stationsContainer;


class SprinklerController {
    constructor(stations, server, appStationsContainer) {
        this.stations = stations;
        this.server = server;
        this.stationsContainer = appStationsContainer;
    }

    init() {
        // Initializes the SprinklerController

        // Loop through the stations and add them into the stations container
        this.stations.forEach(station => {
            this.stationsContainer.append(`<div id="station_${station.station_id}" data-station-id="${station.station_id}" class="station" onclick="stationClicked(${station.station_id});">${station.station_name}</div>`);
        });
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
    let SSSC = new SprinklerController(stations, "http://127.0.0.1/sip/", stationsContainer);
    SSSC.init();
});

function stationClicked(stationID) { 
    // stationID = (stationID - 1);
    // console.log('Station Clicked:');
    // console.log(stations[stationID]);

    toggleStationPopup(stationID);
}

function toggleStationPopup(stationID) {
    let stationPopup = $('#station-popup-' + String(stationID));
    let stationPopupBlur = $('#bg-blur-' + String(stationID));
    
    stationPopup.toggleClass('show-popup');
    stationPopupBlur.toggleClass('visible');
}