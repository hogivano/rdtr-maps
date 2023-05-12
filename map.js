let map;
let geo_json = {};

async function initMap() {
  console.log("initMap");
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: -7.798267912999961, lng: 110.34777465500008 },
    zoom: 15,
  });
}

async function setupGeoJson(data) {
  for (let i = 0; i < data.length; i++) {
    const json_data = data[i];
    const features = json_data.source.data;
    await map.data.addGeoJson(features);
  }
  map.data.setStyle(function(feature) {
    var color = feature.getProperty('fill');
    return {
      fillColor: color,
      fillOpacity: 0.6,
      label: feature.getProperty('name'),
      strokeWeight: 1
    };
  });
}

function showCategoryData(category) {
  map.data.forEach(function(feature) {
    const isHide = feature.getProperty('isHide');
    if (isHide) {
      map.data.overrideStyle(feature, { fillOpacity: 0.6, strokeWeight: 1 });
    }

    if (feature.getProperty('name') == category) {
      map.data.overrideStyle(feature, { fillOpacity: 0.6, strokeWeight: 1 });
    } else {
      feature.setProperty('isHide', false);
      map.data.overrideStyle(feature, { fillOpacity: 0.1, strokeWeight: 0.1 });
    }
  });
}

function resetStyles() {
  if (!map) {
    return;
  }
  map.data.forEach(function(feature) {
    feature.setProperty('isHide', false);
    map.data.overrideStyle(feature, { fillOpacity: 0.6, strokeWeight: 1 });
  });
}

function showCategory(data) {
  let list_categories = "";
  for (let i = 0; i < data.length; i++) {
    const json_data = data[i];
    list_categories += `<li class="list-group-item" onclick="showCategoryData('${json_data.name}')"><div class="color" style="background:${json_data.color}"></div>${json_data.name}</li>`;
  }
  document.getElementsByClassName("categories")[0].innerHTML = `<ul>${list_categories}</ul>`;
  document.getElementById("info").style.display = "block";
}

function fetchData() {
  fetch("https://gist.githubusercontent.com/hogivano/52d74e16db4340d52ed7da569ea636fb/raw/644a9e017042b171ceb0c6abde2a9d15d5b21c04/rdkr-jogja-gmaps.json")
    .then(async function (response) {
      let data = await response.json();
      geo_json = data;
      showCategory(data);
      await setupGeoJson(data);
    })
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", async function() {
  await initMap();
  await fetchData();
  document.removeEventListener("DOMContentLoaded", arguments.callee, false);
});
