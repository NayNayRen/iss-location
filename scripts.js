let layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
let map = new L.map('map', {
  center: [0, 0],
  zoom: 2,
  scrollWheelZoom: false
});

function getLocation() {
  // let res = await fetch('http://api.open-notify.org/iss-now.json');
  fetch("http://api.open-notify.org/iss-now.json", {
    headers: { Origin: window.location.host }
  })
    .then(res => res.json())
    .then(res => {
      // console.log(res);
      let latitude = res.iss_position.latitude;
      let longitude = res.iss_position.longitude;
      let marker = L.marker([latitude, longitude]).bindPopup('ISS Location').openPopup();
      map.setView([latitude, longitude]);
      marker.addTo(map);
      layer.addTo(map);
      setInterval(getLocation, 5000);
    })
    .catch(err => {
      console.log(err);
    });
  // let data = await res.json();
  // return data;
}

// async function getISSLocation() {
//   let data = await getLocation();
//   let latitude = data.iss_position.latitude;
//   let longitude = data.iss_position.longitude;
//   let marker = L.marker([latitude, longitude]).bindPopup('ISS Location').openPopup();
//   map.setView([latitude, longitude]);
//   marker.addTo(map);
//   layer.addTo(map);
//   setInterval(getISSLocation, 35000);
// }

// window.onload = getISSLocation;
window.onload = getLocation;

