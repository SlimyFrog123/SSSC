let stations = [
    {
        'station_name': 'A',
        'station_description': 'Station A',
        'station_id': 1
    },
    {
        'station_name': 'B',
        'station_description': 'Station B',
        'station_id': 2
    },
    {
        'station_name': 'C',
        'station_description': 'Station C',
        'station_id': 3
    },
    {
        'station_name': 'D',
        'station_description': 'Station D',
        'station_id': 4
    },
    {
        'station_name': 'E',
        'station_description': 'Station E',
        'station_id': 5
    }
];

let stationsContainer;


class SprinklerController {
    constructor(stations, server, password, appStationsContainer) {
        this.stations = stations;
        this.server = server;
        this.password = password
        this.stationsContainer = appStationsContainer;
    }

    init() {
        // Initializes the SprinklerController
        let body = $('body'); // Grab the document body

        // Loop through the stations and add them into the stations container
        this.stations.forEach(station => {
            this.stationsContainer.append(`<div id="station_${station.station_id}" data-station-id="${station.station_id}" class="station" onclick="stationClicked(${station.station_id});">${station.station_name}</div>`);
            body.append(`<div class="background-blur" id="bg-blur-${station.station_id}"></div>`);
            body.append(`
<div class="station-popup" id="station-popup-${station.station_id}">
    <h1 class="station-title text-center">Sprinkler ${station.station_name}</h1>
    
    <br>
    
    <p class="station-description">${station.station_description}</p>
    <p class="station-status">Status: <span class="status-text running">Running</span></p>

    <button class="close-btn" onclick="toggleStationPopup(${station.station_id});">
        <i class="fa-solid fa-xmark"></i>
    </button>
</div>`);
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

    runStation(stationID, timeAmount, callback = function(data, status) { console.log(data); console.log(status); }) {
        // Run a station for a specified amount of time
        $.post(this.server + encodeURI("cr?pw=" + String(this.password) + "&t=[" + String(stationID) + "," + String(timeAmount) +"]"), {}, function(data, status) {
            callback(data, status);
        });
    }
}

$(document).ready(function() {
    stationsContainer = $('#stations-container'); // Get the stations container
    
    let SSSC = new SprinklerController(stations, "http://127.0.0.1/sip/", stationsContainer);
    SSSC.init(); // Initialize
});

function stationClicked(stationID) {
    toggleStationPopup(stationID);
}

function toggleStationPopup(stationID) {
    let stationPopup = $('#station-popup-' + String(stationID));
    let stationPopupBlur = $('#bg-blur-' + String(stationID));
    
    stationPopup.toggleClass('show-popup');
    stationPopupBlur.toggleClass('visible');
}