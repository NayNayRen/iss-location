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
  iconUrl: "img/iss.png",
  iconSize: [40, 32],
  // [x, y] axis movements
  iconAnchor: [20, 20],
  popupAnchor: [0, -10]
});
let popup = L.popup({
  autoClose: false,
  minWidth: 100,
  maxWidth: 150,
  keepInView: true
});

function kilometersToMiles(kilometers) {
  let miles = kilometers / 1.6093440006147;
  return miles;
}

async function getLocation() {
  let res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
  let data = await res.json();
  return data;
}

async function showLocation() {
  let data = await getLocation();
  let latitude = data.latitude;
  let longitude = data.longitude;
  popup.setContent(
    `<div class="popup">
      <h3>ISS</h3>
      <p>
        <span>Lat:</span> ${Math.round(latitude * 10000) / 10000}<br />
        <span>Lng:</span> ${Math.round(longitude * 10000) / 10000}<br />
        <span>Mph:</span> ${Math.round(kilometersToMiles(data.velocity) * 10) / 10}
      </p>
    </div>`
  );
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
