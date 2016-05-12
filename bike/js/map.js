// daraobeirne.i6g1i4f5
var marker;
var map = L.mapbox.map('map', 'daraobeirne.i6g1i4f5', {
      closePopupOnClick:false
    }).setView([37.30879220342688, -121.9749730825424], 18);

  var maxCount = 3000; //the number of movements the marker is allow to make. Should be raised for production
  var count = 1
  var segment = [] //list of point that make up a trace segment

var highlightStyle = {
    color: '#2262CC', 
    weight: 3,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};

function updateSegments(latlon) {
    //reduce  opacity and width of trace
    //TODO remove segments from map that have an opacity <= 0.0 to keep number of map layers low
    _.each(map._layers, function(layer){
      if (layer.options.stroke === true) {
          layer.setStyle({opacity:layer.options.opacity -= 0.1, weight:layer.options.weight -= 0.5})
      }
    })
    var point = latlon
    if (segment.length == 0) {
      segment.push(point, point)
    }

    var newline = new L.Polyline(segment, {
    color: 'red',
    weight: 8,
    opacity: 1,
    smoothFactor: 1
      })

    newline.addTo(map)
    segment.shift()
    segment.push(point)   
}

function updateMarkerLocation(){
  //gets all features from the server and moves the marker to the last item in the list of features
  //TODO remove marker and rely on trace line for visualization?   http://www.daraobeirne.com/geo.json
  //var agent="6A83A360-5956-4746-B496-D1A788964A8A"
  // var url='https://map.santaclaraca.gov/maps/rest/services/LAYERS/AppTest/FeatureServer/0/query?where=%22agent%22=%27'+agent+'%27&returnGeometry=true&outFields=OBJECTID,agent&returnIdsOnly=false&outSR=4326&returnCountOnly=false'
  //var url='https://map.santaclaraca.gov/maps/rest/services/LAYERS/AppTest/FeatureServer/0/query?where=%22agent%22=%276A83A360-5956-4746-B496-D1A788964A8A%27&returnGeometry=true&outFields=OBJECTID,agent&returnIdsOnly=false&outSR=4326&returnCountOnly=false&f=json'
  //var url='http://services2.arcgis.com/evwJC31SSJVvbZfF/arcgis/rest/services/FireHydrantInspectionPublic/FeatureServer/0/query?where=1=1&outSR=4326&f=geojson'
  var url='http://services2.arcgis.com/evwJC31SSJVvbZfF/arcgis/rest/services/test2/FeatureServer/0/query?where=1=1&orderByFields=OBJECTID&outSR=4326&f=geojson'
  var lat=0
  var lon=0
  count += 1
  //var url = 'https://map.santaclaraca.gov/maps/rest/services/LAYERS/AppTest/FeatureServer/0/'
  if (count < maxCount) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json'
    })
    .done(function(data){
        lat = data.features[count].geometry.coordinates[1]
        lon = data.features[count].geometry.coordinates[0]
        var newLatLng = new L.LatLng(lat, lon);
        updateSegments(newLatLng)
        console.log(lat, lon)
        //marker.setLatLng(newLatLng); 
    map.panTo(new L.latLng(newLatLng));    
    })
    .fail(function(error){
      console.log(error)
    });  
    count += 1
  }
}

function init(){
  //marker = L.marker([37.353,-121.97790334510803]).addTo(map)
  setInterval(updateMarkerLocation, 700);
}

init()
