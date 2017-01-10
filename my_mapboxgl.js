// my_mapboxgl.js

mapboxgl.accessToken = 'pk.eyJ1IjoiaW5mb2RpcnNldmVuIiwiYSI6ImNpeG5jdTBjZDAwMGsycW84anZzNnkxNXQifQ.MYPpu-CDOYyotUqAKbelvg';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/streets-v9?optimize=true',
//     style: 'mapbox://styles/infodirseven/cixf3q7ss00ez2qp32k9jhvw2',
    center: [50.2652, 127.5182],
    zoom: 15,
    container: 'map',
    hash: true
});
// the 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': .6
        }
    });
});
    
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// map.on('mousemove', function (e) {
//     document.getElementById('info').innerHTML =
//     JSON.stringify(e.point) + '<br />' +
//     JSON.stringify(e.lngLat);
// });

$('.b1').click(function() {
    map.flyTo({
        curve: 0.3,
        speed: 0.2,
        bearing: 41,
        pitch: 45,
//         screenSpeed: 4,
//         minZoom: 13,
        center: [127.51806202653364, 50.25623509575192]
    });
});

$('.b2').click(function() {
    map.flyTo({
        curve: 0.5,
        speed: 0.3,
        bearing: 169.8,
        pitch: 60,
//         screenSpeed: 24,
//         minZoom: 19,
        center: [127.51938, 50.26541]
    });            
});
