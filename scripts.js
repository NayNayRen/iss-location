// set marker to null for easy removal
let marker = null;
let testMarker = L.marker([0, 0]);
let layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}');
const latitudeData = document.querySelector('.latitude-data');
const longitudeData = document.querySelector('.longitude-data');
const altitudeData = document.querySelector('.altitude-data');
const velocityData = document.querySelector('.velocity-data');
const mapDataButton = document.querySelector('.map-data-button');
const latDirection = document.querySelector('.lat-direction');
const lngDirection = document.querySelector('.lng-direction');
const mapDataContainer = document.querySelector('.map-data-container');
const mapDataCheckbox = document.querySelector('.map-data-checkbox');
const currentDate = document.querySelector('.current-date');
const currentTime = document.querySelector('.current-time');
const positionGroups = [];
const positions = [];
const upArrow = document.querySelector('.up-arrow');

let map = new L.map('map', {
  // center: [0, 0],
  dragging: false,
  scrollWheelZoom: false,
  trackResize: true,
  zoom: 3
});
const issIcon = L.icon({
  iconUrl: "img/iss.png",
  iconSize: [55, 47],
  // [x, y] axis movements
  iconAnchor: [25, 25],
  popupAnchor: [0, -10]
});

function kilometersToMiles(kilometers) {
  let miles = kilometers / 1.6093440006147;
  return miles;
}

async function changeToKilometers() {
  let data = await getStationData();
  let height = Math.round(kilometersToMiles(data.altitude) * 1) / 1;
  let speed = Math.round(kilometersToMiles(data.velocity) * 1) / 1;
  if (mapDataCheckbox.checked) {
    altitudeData.innerText = `${Math.round(data.altitude * 1) / 1} km`;
    velocityData.innerText = `${(Math.round(data.velocity) * 1 / 1).toLocaleString('en-US')} k/h`;
  } else {
    altitudeData.innerText = `${height} mi`;
    velocityData.innerText = `${speed.toLocaleString('en-US')} m/h`;
  }
}

// show and hide up arrow
function activateUpArrow() {
  if (document.documentElement.scrollTop > 0) {
    upArrow.style.right = "-2px";
  } else {
    upArrow.style.right = "-60px";
  }
}

async function getStationData() {
  let res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
  let data = await res.json();
  return data;
}

async function showStationData() {
  let now = new Date();
  let data = await getStationData();
  let latitude = Math.round(data.latitude * 100) / 100;
  let longitude = Math.round(data.longitude * 100) / 100;
  let height = Math.round(kilometersToMiles(data.altitude) * 1) / 1;
  let speed = Math.round(kilometersToMiles(data.velocity) * 1) / 1;
  let issPath = new L.polyline(positionGroups, {
    color: '#FF0000',
    smoothFactor: 5,
    stroke: true,
    weight: 2
  });
  // keeps two points in order to draw a line
  positions.push(new L.LatLng(latitude, longitude));
  if (positions.length > 2) {
    positions.shift();
  }
  // keeps one collection of coordinates to not lag
  positionGroups.push(positions);
  if (positionGroups.length > 1) {
    positionGroups.shift();
  }
  // negative is south positive is north
  if (latitude > 0) {
    latDirection.innerText = 'N';
  } else {
    latDirection.innerText = 'S';
  }
  // negative is west positive is east
  if (longitude > 0) {
    lngDirection.innerText = 'E';
  } else {
    lngDirection.innerText = 'W';
  }
  // switches between miles and kilometers
  if (mapDataCheckbox.checked) {
    altitudeData.innerText = `${Math.round(data.altitude * 1) / 1} km`;
    velocityData.innerText = `${(Math.round(data.velocity) * 1 / 1).toLocaleString('en-US')} k/h`;
  } else {
    altitudeData.innerText = `${height} mi`;
    velocityData.innerText = `${speed.toLocaleString('en-US')} m/h`;
  }
  // iss data gets displayed
  latitudeData.innerText = latitude;
  longitudeData.innerText = longitude;
  currentDate.innerText = now.toLocaleDateString();
  currentTime.innerText = now.toLocaleTimeString();
  // if marker exists, remove it, used to show only one marker
  if (marker !== null) {
    map.removeLayer(marker);
  }
  // marker location is set
  marker = L.marker([latitude, longitude], {
    icon: issIcon,
    alt: 'ISS Icon',
    title: 'ISS Icon'
  });
  // layers are added to the map
  map.panTo([latitude, longitude]);
  marker.addTo(map);
  layer.addTo(map);
  issPath.addTo(map);
}
// function is called every 2 seconds to mimic station movement
setInterval(showStationData, 2000);

window.addEventListener('load', () => {
  showStationData();
  activateUpArrow();
  mapDataCheckbox.checked = false;
  mapDataButton.addEventListener('click', () => {
    // mapDataContainer.classList.toggle('map-data-container-toggle');
    if (window.innerWidth > 700) {
      mapDataContainer.classList.toggle('map-data-container-toggle-fullscreen');
    }
    if (window.innerWidth <= 700) {
      mapDataContainer.classList.toggle('map-data-container-toggle-mobile');
    }
  });
  mapDataCheckbox.addEventListener('click', () => {
    changeToKilometers();
  });
});

window.addEventListener('resize', () => {
  activateUpArrow();
});

window.addEventListener('scroll', () => {
  activateUpArrow();
});
