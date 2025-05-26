const listing = window.listing;
const coordinates = listing.geometry?.coordinates;
const defaultCoordinates = [77.5946, 12.9716]; // Bangalore fallback

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=YOUR_REAL_API_KEY', // Replace with your key
  center: coordinates && coordinates.length === 2 ? coordinates : defaultCoordinates,
  zoom: 10,
  attributionControl: false
});

if (listing.geometry && listing.geometry.coordinates.length === 2) {
  const popup = new maplibregl.Popup({
    offset: 25,
    className: 'custom-popup'
  }).setHTML(`
    <h4>${listing.title}</h4>
    <p>📍 Exact location provided after the booking</p>
  `);

  const marker = new maplibregl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  popup.on('open', () => {
    const popupContent = document.querySelector('.maplibregl-popup-content');
    if (popupContent) {
      popupContent.classList.add('custom-popup');
    }
  });
}
