
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
    center: campground.geometry.coordinates, // Starting position [lng, lat]
    zoom: 9, // Starting zoom level
  });
  const marker = new mapboxgl.Marker() // initialize a new marker
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
      `<h5>${campground.title}<h5>`
    )
  ) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

  map.addControl(new mapboxgl.NavigationControl());