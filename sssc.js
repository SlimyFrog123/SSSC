let stations = [
    {
        'station_name': 'A',
        'station_description': 'Station A',
        'station_id': 1,
        'running': false
    },
    {
        'station_name': 'B',
        'station_description': 'Station B',
        'station_id': 2,
        'running': false
    },
    {
        'station_name': 'C',
        'station_description': 'Station C',
        'station_id': 3,
        'running': true
    },
    {
        'station_name': 'D',
        'station_description': 'Station D',
        'station_id': 4,
        'running': false
    },
    {
        'station_name': 'E',
        'station_description': 'Station E',
        'station_id': 5,
        'running': false
    }
];

let SSSC;
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
            body.append(`<div class="station-popup" id="station-popup-${station.station_id}">
    <h1 class="station-title text-center">Sprinkler ${station.station_name}</h1>
    
    <br>
    
    <p class="station-description">${station.station_description}</p>
    <p class="station-status">Status: <span class="status-text">Not Running</span></p>

    <div class="app-btn-container">
        <button class="app-btn min-width-100" onclick="stopStation(${station.station_id})">Stop</button>
        <select class="app-btn min-width-100" id="station-time-${station.station_id}">
            <option value="1">1 Minute</option>
            <option value="5">5 Minutes</option>
            <option value="10">10 Minutes</option>
            <option value="30">30 Minutes</option>
            <!-- <option value="">Custom</option> -->
        </select>
        <button class="app-btn min-width-100" onclick="startStation(${station.station_id})">Start</button>
    </div>

    <button class="close-btn app-btn" onclick="toggleStationPopup(${station.station_id});">
        <i class="fa-solid fa-xmark"></i>
    </button>
</div>`);
        });
    }

    startStation(stationID, callback = function (data, status) { console.log(data); console.log(status); }) {
        // Start a specific station
        $.post(this.server + encodeURI('sn?sid=' + String(stationID) + '&set_to=1'), {}, function (data, status) {
            callback(data, status)
        });
    }

    stopStation(stationID, callback = function (data, status) { console.log(data); console.log(status); }) {
        // Stop a specific station
        $.post(this.server + encodeURI('sn?sid=' + String(stationID) + '&set_to=0'), {}, function (data, status) {
            callback(data, status)
        });
    }

    getStatus(stationID, callback = function (data, status) { console.log(data); console.log(status); }) {
        // Get the status of a specific station
        $.get(this.server + encodeURI("sn?pw=" + String(this.password) + "&sid=" + String(stationID)), function (data, status) {
            callback(data, status);
        });
    }

    runStation(stationID, timeAmount, callback = function (data, status) { console.log(data); console.log(status); }) {
        // Run a station for a specified amount of time
        $.post(this.server + encodeURI('cr?pw=' + String(this.password) + '&t=[' + String(stationID) + ',' + String(timeAmount) + ']'), {}, function (data, status) {
            callback(data, status);
        });
    }

    refreshStations() {
        this.stations.forEach(station => {
            this.getStatus(station.station_id, function (data, status) {
                console.log(data);
                console.log(status);
                // this.stations[(stationID - 1)].running = data === 0 ? false : true; // If the data response === 0 (not running), set the running property to false, if it is, set it to true
            });
        });
    }

    refreshStationPopups() {
        this.stations.forEach(station => {
            this.updateStationPopup(station.station_id)
        });
    }

    updateStationPopup(stationID) {
        let stationPopup = $(`#station-popup-${stationID}`).find('.station-status').find('.status-text');
        stationPopup.text(this.stations[(stationID - 1)].running ? "Running" : "Not Running");
    }
}

$(document).ready(function () {
    stationsContainer = $('#stations-container'); // Get the stations container

    SSSC = new SprinklerController(stations, "http://192.168.1.140/", "opendoor", stationsContainer);
    SSSC.init(); // Initialize

    setInterval(function () {
        SSSC.refreshStationPopups(); // Refresh the data in the station popups
    }, 10);

    setInterval(function () {
        SSSC.refreshStations(); // Refresh the stations (check if they are running or not)
    }, 500);
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

function startStation(stationID) {
    let timeAmount = Number($(`#station-time-${stationID}`).find(':selected').val());

    if (timeAmount === -1) {
        alert(`Station ${stationID} set to run until stopped.`);
        SSSC.startStation(stationID);
    } else {
        alert(`Station ${stationID} set to run for ${timeAmount} ${timeAmount === 1 ? "minute" : "minutes"}.`);
        let secondsAmount = (timeAmount * 60); // Get the amount of seconds to run for
        SSSC.runStation(stationID, secondsAmount); // Run the station for the specified amount of time
    }
}

function stopStation(stationID) {
    alert(`Station ${stationID} stopped.`);
    SSSC.stopStation(stationID);
}

function selectCustomTime(option) {
    console.log(option);
}