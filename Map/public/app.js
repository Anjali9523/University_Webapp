

//to dispay the map
const myMap = L.map('map').setView([18.55237, 73.827], 16);

const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


//to add different visual layers on the map
var osmMap = L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(myMap);
var stadiaMap = L.tileLayer.provider('Stadia.AlidadeSmoothDark');

var baseMaps = {
    OSM: osmMap,
    'StadiaMap' : stadiaMap,
    
}

var mapLayers = L.control.layers(baseMaps).addTo(myMap);



//function to make a popup with relevant content
function onEachFeature(feature, layer){
    layer.bindPopup(makePopupContent(feature), {closeButton: false, offset: L.point(0, -4)});
}



//function to get current location 
if(!navigator.geolocation){
    console.log("Your browser doesn't support geolocation feature!")
} else{
    
        navigator.geolocation.getCurrentPosition(getPosition);
    
}

var marker, circle;

function getPosition(position){
    console.log(position)
    var lat = position.coords.latitude
    var long = position.coords.longitude
    var accuracy = position.coords.accuracy

    if(marker){
        myMap.removeLayer(marker)
    }

    if(circle){
        myMap.removeLayer(circle)
    }

    var marker = L.marker([lat, long], {icon: curIcon}).addTo(myMap).bindPopup('<a href="pseudo.html">dept</a>', {offset: L.point(0,-15)}).openPopup();
    var circle =  L.circle([lat, long], {radius: accuracy}).addTo(myMap)

    var featureGroup = L.featureGroup([marker, circle]).addTo(myMap)

    myMap.fitBounds(featureGroup.getBounds())

    console.log("coordinates: long: "+long + " lat: " +lat+ " acc: "+ accuracy)

}



var deptIcon = L.icon({
    iconUrl: 'markers/graduate.png',
    iconSize: [20,20]
});

var hostelIcon = L.icon({
    iconUrl: 'markers/hostel.png',
    iconSize: [20,20]
});

var libraryIcon = L.icon({
    iconUrl: 'markers/reading.png',
    iconSize: [20,20]
});

var canteenIcon = L.icon({
    iconUrl: 'markers/canteen.png',
    iconSize: [20, 20]
});

var hospIcon = L.icon({
    iconUrl: 'markers/hospital.png',
    iconSize: [20, 20]
});

var parkIcon = L.icon({
    iconUrl: 'markers/park-location.png',
    iconSize: [20, 20]
});

var curIcon = L.icon({
    iconUrl: 'markers/pin.png',
    iconSize: [30, 30]
});

var searchMark = L.icon({
    iconUrl: 'markers/marker1.png',
    iconSize: [30, 30]
})



//function to search location
function search( data ){

    const loc = document.querySelector('form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const but = document.getElementById('searchButton');
        const searchQuery = searchField.value.trim();

        const filteredData = data.filter(item => item.name.includes(searchQuery));

        filteredData.forEach(item => {
            // Check if item has 'lat' and 'long' properties
            if (typeof item.lat === 'number' && typeof item.long === 'number') {
                flyTolocation(item, curIcon);
            } else {
                console.error('Invalid latitude or longitude values in filteredData item:', item);
            }
        })
    })
}


const searchField = document.getElementById('searchField');
const autocompleteResults = document.getElementById('autocompleteResults');
const start = document.getElementById('start');
const dest = document.getElementById('dest');
const autocompleteResults1 = document.getElementById('autocompleteResults1');
const autocompleteResults2 = document.getElementById('autocompleteResults2');


searchField.addEventListener('input', function () {
    const inputValue = this.value.trim();
    closeAllLists();
    if (!inputValue) {
      return false;
    }

     // Fetch locations from the backend
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        displayAutocompleteResults(data, inputValue, searchField, autocompleteResults);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
});



start.addEventListener('input', function () {
    const inputValue = this.value.trim();
    closeAllLists();
    if (!inputValue) {
      return false;
    }

    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        displayAutocompleteResults(data, inputValue, start, autocompleteResults1);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
});





dest.addEventListener('input', function () {
    const inputValue = this.value.trim();
    closeAllLists();
    if (!inputValue) {
        return false;
    }

    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        displayAutocompleteResults(data, inputValue, dest, autocompleteResults2);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
});


//autocomplete function
function displayAutocompleteResults(locations, inputValue, fieldIn, fieldauto ) {
    fieldauto.innerHTML = '';
    locations.forEach(location => {
      if (location.name.toUpperCase().includes(inputValue.toUpperCase())) {
        const suggestion = document.createElement('div');
        suggestion.innerHTML = "<strong>" + location.name.substr(0, inputValue.length) + "</strong>" + location.name.substr(inputValue.length);
        suggestion.addEventListener('click', function () {
          fieldIn.value = location.name;
          closeAllLists();
        });
        fieldauto.appendChild(suggestion);
      }
    });
    fieldauto.style.display = 'block';
}



document.addEventListener('click', function (event) {
    closeAllLists(event.target);
});



function closeAllLists(element) {
    autocompleteResults.style.display = 'none';
    autocompleteResults1.style.display = 'none';
    autocompleteResults2.style.display = 'none';
}



function flyTolocation(txt, url){
    const lat = txt.lat;
    console.log("laaaat: ",lat);

    const lng = txt.long;
    console.log("looooong: ", lng);
    myMap.flyTo([lat, 
        lng], 18, {
        duration: 2
    });
    const marker = L.marker([lat, lng], {icon: url}).addTo(myMap);
    setTimeout(() => {
        L.popup({closeButton: false, offset: L.point(0, -8)}).setLatLng([lat, lng])
        .setContent(makePopupContent(lat, lng))
        .openOn(myMap);
    }, 2000);
}




fetch('/api/data')
.then(response => response.json())
.then(data => {
    const names = data.map(item => item.name);
    console.log(names);
    makePopupContent(data);
    setMarkers( data );
    search( data );
    routing(data);
})
.catch(error => console.error('Error fetching data:', error));




function makePopupContent(site) {
    return `
        <div>
            <h3><a href="/home">${site.name}</a></h3>
            <img src="images/image.jpg" alt="${site.name}" style="max-width: 100%; height: auto;">
        </div>`;
}



//function to set markers according to the type of location 
 function setMarkers(data) {
    data.forEach(item => {
        const lat = item.lat;
        const long = item.long;
        const loc = item.loctype;

        if (lat !== undefined && long !== undefined) {
            if (loc=='department'){
            const marker = L.marker([lat, long], {icon: deptIcon}).addTo(myMap);
            }
            if (loc=='canteen'){
                const marker = L.marker([lat, long], {icon: canteenIcon}).addTo(myMap);
            } 
            if (loc=='hostel'){
                const marker = L.marker([lat, long], {icon: hostelIcon}).addTo(myMap);
            }
            if (loc=='park'){
                const marker = L.marker([lat, long], {icon: parkIcon}).addTo(myMap);
            }
            if (loc=='hospital'){
                const marker = L.marker([lat, long], {icon: hospIcon}).addTo(myMap);
            }
            if (loc=='library'){
                const marker = L.marker([lat, long], {icon: libraryIcon}).addTo(myMap);
            }

        } else {
            console.error('Invalid latitude or longitude values in data item:', item);
        }
    });
}


function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
 


  const routeLayer = L.layerGroup().addTo(myMap);
  let startMarker = null;
  let destMarker = null;
  let polyline = null;


// Function to display the route
function displayRoute(routeCoordinates) {

    // Remove the previous polyline if it exists
    if (polyline) {
        routeLayer.removeLayer(polyline);
    }


    // Remove previous markers if they exist
    if (startMarker) {
        routeLayer.removeLayer(startMarker);
    }
    if (destMarker) {
        routeLayer.removeLayer(destMarker);
    }


    // Check if routeCoordinates is valid
    if (routeCoordinates.some(coord => coord.some(isNaN))) {
        console.error('Error: Invalid coordinates in route data', routeCoordinates);
        return;
    }


    // Add the new route to the route layer
    polyline = L.polyline(routeCoordinates, { color: 'blue' }).addTo(routeLayer);


    // Add markers for start and destination points
    startMarker = L.marker(routeCoordinates[0], {icon: curIcon}).addTo(routeLayer);
    destMarker = L.marker(routeCoordinates[routeCoordinates.length - 1], {icon: searchMark}).addTo(routeLayer);


    // Fit the map to the bounds of the new route
    myMap.fitBounds(polyline.getBounds());
}



//function to show path between two locations
function routing(data){


    const loc = document.querySelector('.form-container').addEventListener('submit', async function(event) {
        event.preventDefault();
        const but = document.getElementById('route');
        const searchStart = start.value.trim();
        const searchDest = dest.value.trim();
        console.log("start: ",searchStart);
        console.log("dest: ", searchDest);

        const filteredData1 = data.filter(item => item.name.includes(searchStart));
        const filteredData2 = data.filter(item => item.name.includes(searchDest));


        let startInputlat ;
        let startInputlong ;
        let destInputlat ;
        let destInputlong ;

    

        filteredData1.forEach(item => {

            // Check if item has 'lat' and 'long' properties
            if (typeof item.lat === 'number' && typeof item.long === 'number') {
                startInputlat = item.lat;
                startInputlong = item.long;
            } else {
                console.error('Invalid latitude or longitude values in filteredData item:', item);
            }
        })


        filteredData2.forEach(item => {
            if (typeof item.lat === 'number' && typeof item.long === 'number') {
                destInputlat = item.lat;
                destInputlong= item.long;   
            } else {
                console.error('Invalid latitude or longitude values in filteredData item:', item);
            }
        })


        fetch(`/api/find_shortest_path?startLat=${startInputlat}&startLng=${startInputlong}&destLat=${destInputlat}&destLng=${destInputlong}`)
        .then(response => response.json())
        .then(data => {

            if (data.length === 0) {
                console.error('Error: Empty data returned from API');
                return;
            }

            const routeCoordinates = data.map(point => {
                if (!isNaN(point.path_lat) && !isNaN(point.path_lng)) {
                    console.log("point_lat: ", point.path_lat);
                    console.log("point_lng: ", point.path_lng);
                    return [point.path_lat, point.path_lng];
                } else {
                    console.error('Error: Invalid coordinate data', point);
                    return [NaN, NaN];
                }
            });
        

            if (routeCoordinates.some(coord => coord.some(isNaN))) {
            console.error('Error: Invalid coordinates in route data', routeCoordinates);
            return;
            }

            displayRoute(routeCoordinates);
        
        }).catch(error => console.error('Error fetching route:', error));

    })

    document.querySelector('.form-container').addEventListener('submit', function (event) {
        event.preventDefault();
        routing(data);
    });


    start.addEventListener('input', function () {
        const inputValue = this.value.trim();
        closeAllLists();
        console.log(inputValue);
            if (!inputValue) {
            return false;
            }
        })
        
        // Fetch locations from the backend
        
        dest.addEventListener('input', function () {
            const inputValue = this.value.trim();
            console.log(inputValue);
            closeAllLists();
            if (!inputValue) {
            return false;
            }
        })

};

