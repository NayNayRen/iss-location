// set marker to null for easy removal
let marker = null;
let testMarker = L.marker([0, 0]);
let layer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png');
const latitudeData = document.querySelector('.latitude-data');
const longitudeData = document.querySelector('.longitude-data');
const altitudeData = document.querySelector('.altitude-data');
const velocityData = document.querySelector('.velocity-data');
const mapDataButton = document.querySelector('.map-data-button');
const latDirection = document.querySelector('.lat-direction');
const lngDirection = document.querySelector('.lng-direction');
const mapDataContainer = document.querySelector('.map-data-container');
const currentDate = document.querySelector('.current-date');
const currentTime = document.querySelector('.current-time');
const positionGroups = [];
const positions = [];
const upArrow = document.querySelector('.up-arrow');

let map = new L.map('map', {
  center: [0, 0],
  dragging: false,
  scrollWheelZoom: false,
  // trackResize: true,
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
  positions.push(new L.LatLng(latitude, longitude));
  positionGroups.push(positions);
  let issPath = new L.polyline(positionGroups, {
    color: '#FF0000',
    smoothFactor: 2,
    stroke: true,
    weight: 2
  });

  if (latitude > 0) {
    latDirection.innerText = 'N';
  } else {
    latDirection.innerText = 'S';
  }
  if (longitude > 0) {
    lngDirection.innerText = 'E';
  } else {
    lngDirection.innerText = 'W';
  }

  latitudeData.innerText = latitude;
  longitudeData.innerText = longitude;
  altitudeData.innerText = height;
  velocityData.innerText = speed.toLocaleString('en-US');
  currentDate.innerText = now.toLocaleDateString();
  currentTime.innerText = now.toLocaleTimeString();

  if (marker !== null) {
    map.removeLayer(marker);
  }

  marker = L.marker([latitude, longitude], {
    icon: issIcon,
    alt: 'ISS Icon',
    title: 'ISS Icon'
  });
  map.setView([latitude, longitude]);
  marker.addTo(map);
  layer.addTo(map);
  issPath.addTo(map);
}
setInterval(showStationData, 2000);

// show and hide up arrow
function activateUpArrow() {
  if (document.documentElement.scrollTop > 0) {
    upArrow.style.right = "-2px";
  } else {
    upArrow.style.right = "-60px";
  }
}

// window.onload = showStationData;
window.addEventListener('load', () => {
  showStationData();
  activateUpArrow();
  mapDataButton.addEventListener('click', () => {
    mapDataContainer.classList.toggle('map-data-container-toggle');
  });
});

window.addEventListener('resize', () => {
  activateUpArrow();
});

window.addEventListener('scroll', () => {
  activateUpArrow();
});
