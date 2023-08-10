// set marker to null for easy removal
let marker = null;
let testMarker = L.marker([0, 0]);
let layer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png');
const latitudeData = document.querySelector('.latitude-data');
const longitudeData = document.querySelector('.longitude-data');
const altitudeData = document.querySelector('.altitude-data');
const velocityData = document.querySelector('.velocity-data');
const mapDataButton = document.querySelector('.map-data-button');
const mapDataContainer = document.querySelector('.map-data-container');
let map = new L.map('map', {
  center: [0, 0],
  zoom: 2,
  scrollWheelZoom: false
});
const issIcon = L.icon({
  iconUrl: "img/iss.png",
  iconSize: [50, 42],
  // [x, y] axis movements
  iconAnchor: [20, 20],
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
  let data = await getStationData();
  let latitude = data.latitude;
  let longitude = data.longitude;
  let height = Math.round(kilometersToMiles(data.altitude) * 1) / 1;
  let speed = Math.round(kilometersToMiles(data.velocity) * 1) / 1;
  latitudeData.innerText = Math.round(latitude * 100) / 100;
  longitudeData.innerText = Math.round(longitude * 100) / 100;
  altitudeData.innerText = height;
  velocityData.innerText = speed.toLocaleString('en-US');
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
}
setInterval(showStationData, 5000);

// window.onload = showStationData;
window.addEventListener('load', () => {
  showStationData();
  mapDataButton.addEventListener('click', () => {
    mapDataContainer.classList.toggle('map-data-container-toggle');
  });
});
