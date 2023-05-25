mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/linus0520/clhz6gk8i00tc01po5wz562o7', // stylesheet location
    center: food.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(food.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<div>
                <h6 class="mt-1">${food.title}</h6><p class="mb-0">${food.location}</p>
                </div>`
            )
    )
    .addTo(map)

