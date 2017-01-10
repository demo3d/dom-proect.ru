var osmb = new OSMBuildings({
    position: { latitude:50.25655, longitude:127.51859 },
    zoom: 20,
    minZoom: 1,
    maxZoom: 128,
    state: true, // stores map position/rotation in url
    showBackfaces: true, // render front and backsides of polygons. false increases performance, true might be needed for bad geometries
    // fastMode: true,
    // effects: ['shadows', 'outlines']
    effects: ['shadows']
});

osmb.appendTo('map');
osmb.addMapTiles(
    'https://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png',
    {
        attribution: '© Data <a href="http://openstreetmap.org/copyright/">OpenStreetMap</a> · © Map <a href="http://mapbox.com">Mapbox</a>'
    }
);
osmb.addGeoJSONTiles('http://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');


var geojson2 = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          127.51816802096073,
          50.256327228318696
        ]
      },
      "properties": {
        "fixture_name": "rotanda_na_nab",
        "place_id": "675001",
        "name": "Ротанда - Беседка на набережной"
      }
    }
  ]
}

// var geojson = {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     properties: {
//       color: '#ff0000',
//       roofColor: '#cc0000',
//       height: 3,
//       minHeight: 0
//     },
//     geometry: {
//       type: 'Polygon',
//       coordinates: [
//         [
//           [127.518907, 50.256216],
//           [127.518917, 50.256216],
//           [127.518917, 50.256226],
//           [127.518907, 50.256226],
//           [127.518907, 50.256216]
//         ]
//       ]
//     }
//   }]
// };
// osmb.addGeoJSON(geojson);
osmb.addGeoJSON(geojson2);

// This function does an HTTP get request, given a URL, and passes the response to a callback
// Source: http://stackoverflow.com/a/4033310/1202488
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

osmb.on('pointerdown', function(e) {
  var id = osmb.getTarget(e.detail.x, e.detail.y, function(id) {
    if (id) {
      var url = "http://overpass-api.de/api/interpreter?data=[out:json];(relation(" + id.replace(/^[a-z]+/, '') + ");way(r);node(w);way(" + id.replace(/^[a-z]+/, '') + ");way(23853131);node(w));out;";
      httpGetAsync(url, function(response){
        console.log(response);
      });
    }
  });
});
// var obj = osmb.addGeoJSON(geojson);

osmb.addOBJ('obj/stat2.obj',
  {
    latitude:50.2575,
    longitude:127.5019
  }, {
    id: "stat2",
    color: 'grey',
    scale: 1
  }
);

osmb.addOBJ('obj/rotanda4.obj',
  {
    latitude:50.256235224847586,
    longitude:127.5180160403579
  },{
    id: "rotanda4.obj",
    scale: 20
  });


var colorByHeightAvailable = function(feature) {
    if (!feature.properties.levels && !feature.properties.height) {
      feature.properties.color = "lime";
    } else if (!feature.properties.height) {
      feature.properties.color = "grey";
    } else {
      feature.properties.color = "green";
    }
    feature.properties.roofColor = feature.properties.color;
  };
  var colorByHeight = function(feature) {
    var height = parseFloat(feature.properties.height) || (parseFloat(feature.properties.levels)* 3.5) || 0;
    if (height < 20)
      feature.properties.color = "#CCCCCC";
    else if (height < 30)
      feature.properties.color = "purple";
    else if (height < 60)
      feature.properties.color = "#CC4444";
    else
      feature.properties.color = "orange";
    feature.properties.roofColor = feature.properties.color;
  };
  
  var colorLandmarks = function(feature) {
    var landmarkIDs = {
      "r3074565": true,  // Rotes Rathaus
      "w313675136": true, // Rotes Rathaus
      "r2167988": true,  // Berliner Dom
      "w37449517": true, // Bundestag
      "r2326380": true,  // Kanzleramt
      "r4065110": true,  // Fernsehturm components
      "w304987177": true,
      "w19046101": true,
      "w96880470": true,
      "w326772329": true,
      "w230818931": true,
      "w304987174": true,
      "w304987172": true,
      "w304987176": true,
      "w96880477": true,
      "w304987173": true
    };
    feature.properties.color = (id in landmarkIDs) ? "#CC4444" : "#DDDDDD";
  };
 // osmb.on('loadfeature', function(e) {
 //   colorByHeightAvailable(e.detail);
 // });


var pointData = {
  a: function(){
    return {
      // ?lat=50.257674&lon=127.501761&zoom=19.0&tilt=45.0&rotation=-23.4
      latitude: 50.257674,
      longitude: 127.501761,
      rotation: -23.4,
      zoom: 19,
      tilt: 45
    };
  },
  b: function(){
    return {
      // ?lat=50.256421&lon=127.517959&zoom=19.4&tilt=45.0&rotation=52.5
      latitude: 50.256421,
      longitude: 127.517959,
      rotation: 52,
      zoom: 19,
      tilt: 45
    };
  }
};
  //[127.5180160403579, 50.256235224847586]

// button handling
var currentPoint = 'a';
var animationTime = 8500;
var buttons = document.querySelectorAll('img');
var tween = null;
var isAnimating = false;

[].forEach.call(buttons, function(button){
   button.addEventListener('click', handleButton, false);
});

function handleButton(){
  var pointTo = this.getAttribute('data-point');
  var pointFrom = pointTo === 'a' ? 'b' : 'a';

  if(currentPoint === pointTo || isAnimating){
    return false;
  }

  currentPoint = pointTo;
  startAnimation(pointData[pointFrom](), pointData[pointTo]());
}

function startAnimation(valuesFrom, valuesTo){
  if(tween){
    tween.stop();
  }

  isAnimating = true;
  tween = new TWEEN.Tween(valuesFrom)
  .to(valuesTo, animationTime)
  .onUpdate(function() {
    osmb.setPosition({ latitude: this.latitude, longitude: this.longitude });
    osmb.setRotation(this.rotation);
    osmb.setZoom(this.zoom);
    osmb.setTilt(this.tilt);
  })
  .onComplete(function(){
    isAnimating = false;
  })
  .start();

  requestAnimationFrame(animate);
}

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

// highlight
osmb.on('pointermove', function(e) {
  osmb.getTarget(e.detail.x, e.detail.y, function(id) {
    if (id) {
      document.body.style.cursor = 'pointer';
      osmb.highlight(id, '#f08000');
      //var z=osmb.getBounds(id);
      //console.log(z[0]);
    } else {
      document.body.style.cursor = 'default';
      osmb.highlight(null);
    }
  });
});