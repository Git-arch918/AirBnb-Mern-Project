const listing = window.listing;
const coordinates = listing.geometry?.coordinates;
const defaultCoordinates = [77.5946, 12.9716]; // Fallback: Bangalore

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
  center: coordinates && coordinates.length === 2 ? coordinates : defaultCoordinates,
  zoom: 10,
  attributionControl: false
});

if(listing.geometry && listing.geometry.coordinates.length === 2) {
  const marker = new maplibregl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .setPopup(
      new maplibregl.Popup({
  offset: 25,
  className: 'custom-popup'
}).setHTML(`
  <h4>${listing.title}</h4>
  <p>📍 Exact location provided after the booking</p>
`)
    )
    .addTo(map);
popup.on('open', () => {
  const popupContent = document.querySelector('.maplibregl-popup-content');
  if (popupContent) {
    popupContent.classList.add('custom-popup'); // ✅ Add custom class
  }
});

}
