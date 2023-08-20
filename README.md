<p align="center">
    <img src="img/nasa-logo.png" alt="NASA Logo" width="100" height="82" />
</p>

## About ISS Location

An app created to pin the current location of the International Space Station (ISS) every 2 seconds. Data is current and real time. Coordinates are stored 2 at a time and the oldest latitude and longitude set is replaced in that 2 second refresh with a new set. Doing so plots a line from one point to the next for the pathing and shows a little movement. In the collection of data you can toggle from miles to kilometers for the height and speed.

Everything is responsive down to mobile.

- Visit : **[ISS Current Location](https://naynayren.github.io/iss-location/)**

## Leaflet.js

It's using <a href="https://leafletjs.com/reference.html">Leaflet.js Maps</a> for the mapping, similar to Google Maps. Leaflet uses a cdn for css and javascript delivery. Plenty of options, mobile friendly, and not too terrible to get a little hold of.

## Where the ISS at?

The data used is pulled from a site called <a href="https://wheretheiss.at/w/developer">Where the ISS at?</a> I found it through a Google search. I used async/await to fetch it, then formatted and manipulated the data that gets reloaded in that 2 second refresh.

## YouTube

I embeded the 2 live feeds from YouTube. They are officially provided by NASA. Enjoy the view(s).

## A Little Bug

If you let the app run long enough for the ISS to make a full "rotation" from 0 to 180 degrees, the path will draw a straight line to what is essentially the othe side of the world. It starts at -180 as it should and the map reloads, everything continues to work, just draws the line to connect the 2 points.

<p align="center">
    <img src="img/logo.png" alt="My Logo" width="77" height="50" />
</p>
