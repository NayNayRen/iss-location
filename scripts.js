// set marker to null for easy removal
let marker = null;
let testMarker = L.marker([0, 0]);
let layer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png');
let map = new L.map('map', {
  center: [0, 0],
  zoom: 2,
  scrollWheelZoom: false
});
const issIcon = L.icon({
  iconUrl: "../img/iss.png",
  iconSize: [40, 32],
  // [x, y] axis movements
  iconAnchor: [20, 20],
  popupAnchor: [0, -10]
});
const popup = L.popup()
  .setContent(`<p>Satelite: ISS<br />This is a nice popup.</p>`);


async function getLocation() {
  let res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
  let data = await res.json();
  return data;
}

async function showLocation() {
  let data = await getLocation();
  // console.log(data);
  let latitude = data.latitude;
  let longitude = data.longitude;
  if (marker !== null) {
    map.removeLayer(marker);
  }
  marker = L.marker([latitude, longitude], {
    icon: issIcon
  }).bindPopup(popup).openPopup();
  map.setView([latitude, longitude]);
  marker.addTo(map);
  layer.addTo(map);
}
setInterval(showLocation, 5000);

window.onload = showLocation;
