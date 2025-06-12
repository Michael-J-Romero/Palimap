"use client";
import _ from "lodash";
import {
  point, distance, booleanPointInPolygon, centroid
} from '@turf/turf';
import L from "leaflet"; 
const DAMAGE_LEVELS = {
  "Destroyed (>50%)": 4,
  "Major (26-50%)": 3,
  "Minor (10-25%)": 2,
  "Affected (1-9%)": 1,
  "No Damage": 0,
};

const DAMAGE_COLORS = {
  4: '#ff0000',
  3: '#ff7300',
  2: '#ffcc00',
  1: '#c5ff55',
  0: '#00cc00',
};

function makeFireMap(map, fn, options) {
  const { onMapClick } = options;
  let cleaner = () => {};

  setupContext(map);

  import('esri-leaflet').then((esri) => {
    const state = initializeState();
    const fetch = (e) => fetchVisibleParcels(e,map, esri, state);
    const dinsLayer = createDinsLayer(map, esri, state);
    const hoveredLayer = createHoveredLayer(map);

    // map.whenReady(fetch);

    const mouseMoveFn = createMouseMoveHandler(map, hoveredLayer, state);
    const clickFn = createClickHandler(map, hoveredLayer, state, onMapClick);

    bindEvents(map, dinsLayer, mouseMoveFn, clickFn, fetch,(clean) => {
      cleaner = () => {
        clean();
        map.removeLayer(hoveredLayer);
      };
    });
  });

  return () => cleaner();
}

export default makeFireMap;

function getTileHash(lat, lng, ) {
  let zoom = 17; // default zoom level, can be adjusted based on your needs
  const tileX = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
  const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 
    1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    return `${zoom}_${tileX}_${tileY}`;
}
 




function createDinsLayer(map, esri, state, onReady) {
  let total = 0;
  let done = 0;

 
// Initialize the feature layer
const layer2 = esri.featureLayer({
  url: 'https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/DINS_2025_Palisades_Public_View/FeatureServer/0'
});

// Query all features and attributes
// let bb=layer2.query()
//   .where('1=1')
//   .returnGeometry(true)
//   .fields(['*']) // Specify the fields you want to retrieve
//   // .outFields(['*']) // Get all available attributes
//   console.log(bb,'bbbb');
//   bb.run((error, featureCollection, response) => {
//     if (error) {
//       console.error("Query error:", error);
//       return;
//     }

//     const features = featureCollection.features;

//     features.forEach((feature) => {
//       console.log("All attributes:", feature);
//     });
//   });



  const layer = esri.featureLayer({
    url: 'https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/DINS_2025_Palisades_Public_View/FeatureServer/0',
    outFields: ['*'],
    fields: ['*'],

    pointToLayer: (_, latlng) =>
      L.circleMarker(latlng, { opacity: 0, fillOpacity: 0, interactive: false }),
    onEachFeature: (feature, layer) => {
      total++;
      const status = feature.properties.DAMAGE || 'No Damage';
      const latlng = layer.getLatLng();
      const zoom = map.getZoom();
      let cellHash = getTileHash(latlng.lat, latlng.lng, zoom);
      if (!state.dinsPoints[cellHash]) {
        state.dinsPoints[cellHash] = [];
      }
      state.dinsPoints[cellHash].push({ latlng, status });
      // state.dinsCircles.push(layer);
      // layer.bindPopup(`<b>Structure Status:</b> ${status}`);
      done++;

      // if (done === total && typeof onReady === 'function') {
        // onReady();
      // }
    },
  });

  layer.once('load', () => {
    // fallback in case no features matched
    // if (total === 0 && typeof onReady === 'function') {
      // onReady();
    // }
  });

  return layer.addTo(map);
}


 


function fetchVisibleParcels(e,map, esri, state) {
  const { dinsPoints, parcelDamage, loadedParcels, loadedAPNs, loadedQuadrantHashes } = state;
  const zoom = map.getZoom();
  if (zoom < 15) return;

  // const bounds = getVisibleGridCells(e,map, 0.01, 1)
    
                    //map.getBounds();
                    // const quadrants = splitBoundsIntoQuadrants(bounds)//.flatMap(splitBoundsIntoQuadrants);

// Object.values(e.sourceTarget._cells).forEach(tile => {
  Object.keys(e.sourceTarget._cells).forEach(index => {
    const tile = e.sourceTarget._cells[index];
    const { x, y, z } = tile.coords;
    const bounds2 = tileXYToLatLngBounds(x, y, z);
  const hash = `${z}_${x}_${y}`; // Use z, x, y as hash
  // 
// });
if (loadedQuadrantHashes.has(hash)) return;
loadedQuadrantHashes.add(hash);

const quadrants = [(bounds2)].flatMap(splitBoundsIntoQuadrants);

  quadrants.forEach(bounds => {

  setTimeout(() => {
    function fetchParcels(bounds, offset = 0) {
  esri.query({
    maxAllowableOffset: 0.0001,
    url: 'https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/0',
  })
    .limit(1000)
    .offset(offset)
    .intersects(bounds)
    .where(`Shape__Area > ${zoom < 15 ? 50000 : 1}`)
    .returnGeometry(true)
    .precision(5)
    .simplify(map, 0.1)
    .run((err, fc) => {
      if (err) return;


      for (const feature of fc.features) {
        const apn = feature.properties.APN;
          let area = feature.properties["Shape.STArea()"]
          if (area > 8000000 ||!area || area < 1) continue; // Skip very small parcels
          
          const coords = feature.geometry.coordinates?.[0];
          if (!coords) continue;

        if (!loadedAPNs.has(apn)) {
          loadedAPNs.add(apn);
          const locationHash = getParcelLocationHash(feature.properties);
          if (state.locations.has(locationHash)) {
            continue;
          } else {
            state.locations.set(locationHash, [feature.properties]);
            // state.locations.get(locationHash).push(feature.properties);
            // Skip duplicates
          } 

          const featureBounds = L.latLngBounds(coords.map(([lng, lat]) => [lat, lng]));
          let maxDamage = 0;


          const latlng = featureBounds.getCenter();
          // Use the center of the feature bounds to get the tile hash
          const zoom = map.getZoom();
          const nearbyHashes = getSurroundingTileHashes(latlng.lat, latlng.lng, zoom);

for (const hash of nearbyHashes) {
  for (const pt of dinsPoints[hash] || []) {
    if (!pt || !pt.latlng) continue;
    const level = DAMAGE_LEVELS[pt.status] || 0;
    if (featureBounds.contains(pt.latlng) && level > maxDamage) {
      maxDamage = level;
    }
  }
}

  
          let cellHash = getTileHash(latlng.lat, latlng.lng, zoom);
          const color = DAMAGE_COLORS[maxDamage] || DAMAGE_COLORS[0];
          if (!loadedParcels[cellHash]) {
            loadedParcels[cellHash] = [];
          }
          loadedParcels[cellHash].push(feature);
          feature.properties.color = color;
          // parcelDamage.set(apn, color);
        }
      }

      // If we received the maximum results, there might be more data
      if (fc.features.length === 1000) {
        // Wait a little before the next request to avoid hammering the server
        setTimeout(() => fetchParcels(bounds, offset + 1000), 50);
      }
    });
}

// Start the recursive fetch
fetchParcels(bounds);

    }, index * 20  ); // stagger requests
  });
  });
}

function getVisibleHashes(e, map, zoom = 17) {
  const bounds = map.getBounds(); // visible area
  const nw = bounds.getNorthWest(); // top-left
  const se = bounds.getSouthEast(); // bottom-right

  const tileHashes = [];

  const minX = Math.floor((nw.lng + 180) / 360 * Math.pow(2, zoom));
  const maxX = Math.floor((se.lng + 180) / 360 * Math.pow(2, zoom));

  const minY = Math.floor(
    (1 - Math.log(Math.tan(nw.lat * Math.PI / 180) + 1 / Math.cos(nw.lat * Math.PI / 180)) / Math.PI) / 2
    * Math.pow(2, zoom)
  );
  const maxY = Math.floor(
    (1 - Math.log(Math.tan(se.lat * Math.PI / 180) + 1 / Math.cos(se.lat * Math.PI / 180)) / Math.PI) / 2
    * Math.pow(2, zoom)
  );

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      tileHashes.push(`${zoom}_${x}_${y}`);
    }
  }

  return tileHashes;
}

function getSurroundingTileHashes(lat, lng) {
  let zoom = 17; // default zoom level, can be adjusted based on your needs
  const baseX = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
  const baseY = Math.floor(
    (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2
    * Math.pow(2, zoom)
  );

  const hashes = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const x = baseX + dx;
      const y = baseY + dy;
      hashes.push(`${zoom}_${x}_${y}`);
    }
  }
  return hashes;
}


function bindEvents(map, dinsLayer, mouseMoveFn, clickFn,fetch, cleanupRef) {
  let loaded =false
  const onDragStart = () => {
    mouseMoveFn.setUserDragged(true);
  }
  const onDragEnd = () => {
    setTimeout(() => mouseMoveFn.setUserDragged(false), 0);
    // if (loaded) fetch()
  }
  const onLoad = (e,...r)=>{
    // if (loaded) return;
    loaded = true;
    fetch(e);
    // console.log("DINS2 layer loaded",e, e.sourceTarget._cells);
  }
  dinsLayer.on('load', onLoad);
  dinsLayer.once('update-end', onLoad);
  const onZoom=()=>{
    // if (loaded) fetch();
  }
  map.on('zoomend', onZoom)
  map.on('movestart', onDragStart);
  map.on('moveend', onDragEnd);
  map.on('mousemove', mouseMoveFn);
  map.on('click', clickFn);
  map.on('dblclick', clickFn.cancel);

  cleanupRef(() => {
    dinsLayer.off('load', onLoad);
    dinsLayer.off('update-end', onLoad); 
    map.off('zoomend', onZoom);
    map.off('movestart', onDragStart);
    map.off('moveend', onDragEnd);
    map.off('mousemove', mouseMoveFn);
    map.off('click', clickFn);
    map.off('dblclick', clickFn.cancel);
    map.removeLayer(dinsLayer);
  });
} 

function tileXYToLatLngBounds(x, y, z) {
  const tileSize = 512; // Default tile size in Leaflet
  const nwPoint = L.point(x * tileSize, y * tileSize);
  const sePoint = L.point((x + 1) * tileSize, (y + 1) * tileSize);
  const nw = L.CRS.EPSG3857.pointToLatLng(nwPoint, z);
  const se = L.CRS.EPSG3857.pointToLatLng(sePoint, z);
  return L.latLngBounds(nw, se);
}


function getVisibleGridCells(e,map, size = 0.01, bufferCells = 0) {

// Object.values(e.sourceTarget._cells).forEach(tile => {
//   const { x, y, z } = tile.coords;
//   const tileBounds = tileXYToLatLngBounds(x, y, z);
//   fetchVisibleParcelsForBounds(tileBounds, map, esri, state);
// });


  const bounds = e?.bounds
  // const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  const minLat = Math.floor((sw.lat - size * bufferCells) / size) * size;
  const maxLat = Math.floor((ne.lat + size * bufferCells) / size) * size;
  const minLng = Math.floor((sw.lng - size * bufferCells) / size) * size;
  const maxLng = Math.floor((ne.lng + size * bufferCells) / size) * size;

  const cells = [];

  for (let lat = minLat; lat <= maxLat; lat += size) {
    for (let lng = minLng; lng <= maxLng; lng += size) {
      const hash = `${lat.toFixed(5)}_${lng.toFixed(5)}`;
      const cellBounds = L.latLngBounds(
        [lat, lng],
        [lat + size, lng + size]
      );
      cells.push({ hash, bounds: cellBounds });
    }
  }

  return cells;
}

function getGridCellHash(lat, lng, size = 0.01) {
  const latIndex = Math.floor(lat / size);
  const lngIndex = Math.floor(lng / size);
  return `${latIndex}_${lngIndex}`;
}

function roundTo(value, step = 0.01) {
  return Math.round(value / step) * step;
}

function getBoundsHash(bounds) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return `${roundTo(sw.lat)}-${roundTo(sw.lng)}-${roundTo(ne.lat)}-${roundTo(ne.lng)}`;
}

function createHoveredLayer(map) {
  return L.geoJSON(null, {
    pane: "hoverPane",
    style: (feature) => ({
      color: feature.properties.customColor || 'orange',
      weight: 2,
      fillOpacity: 0.3,
      opacity: 0,
    }),
  }).addTo(map);
}

function createMouseMoveHandler(map, hoveredLayer, state) {
 const { loadedParcels, parcelDamage } = state;
  const MAX_DISTANCE_METERS = 150;
  let userDragged = false;

  const handler = _.throttle((e) => {
     let zoom = map.getZoom();
  if (zoom < 15) return 
    if (userDragged) return;

    const mousePt = point([e.latlng.lng, e.latlng.lat]);
    hoveredLayer.clearLayers();
    let count = 0;
    let all=[]
const surroundingHashes = getSurroundingTileHashes(e.latlng.lat, e.latlng.lng);
// const visibleHashes = getVisibleHashes(e, map);
for (const hash of surroundingHashes) {
  for (const feature of loadedParcels[hash] || []) {
    const dist = distance(mousePt, centroid(feature), { units: 'meters' });
    const touching = booleanPointInPolygon(mousePt, feature);
    
    if (dist > MAX_DISTANCE_METERS && !touching) continue;

    const apn = feature.properties.APN;
    feature.properties.customColor = touching
      ? feature.properties.color
      : '#ffffff22';

    // if (touching) {
    //   count++;
    //   all.push(feature);
    // }
    // else 
    hoveredLayer.addData(feature);
  }
}



    if (count > 0) {
      // let location = state.locations.get(getParcelLocationHash(all[0].properties)) || [];
      // console.log("hovered location2",location, all[0].properties);
      hoveredLayer.addData(all[0]);
    }
    // if (count > 1) {
    //   let locations=all.map((f) => 
    //     state.locations.get(getParcelLocationHash(f.properties))
    //    || []);
    //   console.warn(all,locations);
    //   hoveredLayer.setStyle({
    //     weight: 12,
    //     opacity: 0.8,
    //   });
    // }  
  }, 50);

  handler.setUserDragged = (val) => { userDragged = val; };
  return handler;
}
function createClickHandler(map, hoveredLayer, state, onMapClick) {
  const { loadedParcels } = state;
  let clickTimeout;

  const handler = (e) => {
    if (e.originalEvent.detail === 2 || e.originalEvent.target.className === "leaflet-sbs-range") return;

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      const pt = point([e.latlng.lng, e.latlng.lat]);
      let match = null;

const surroundingHashes = getSurroundingTileHashes(e.latlng.lat, e.latlng.lng);


for (const hash of surroundingHashes) {
  for (const feature of loadedParcels[hash] || []) {
    if (booleanPointInPolygon(pt, feature)) {
      match = feature;
      break;
    }
  }
  if (match) break; // stop checking if match is found
}

      if (!match) {
        hoveredLayer.clearLayers();
        return;
      }

      const apn = match.properties.APN;
      onMapClick({ apn });
    }, 250);
  };

  handler.cancel = () => clearTimeout(clickTimeout);
  return handler;
}
function splitBoundsIntoQuadrants(bounds) {
  const center = bounds.getCenter();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  return [
    // Southwest quadrant
    L.latLngBounds(sw, center),
    // Southeast quadrant
    L.latLngBounds(L.latLng(sw.lat, center.lng), L.latLng(center.lat, ne.lng)),
    // Northwest quadrant
    L.latLngBounds(L.latLng(center.lat, sw.lng), L.latLng(ne.lat, center.lng)),
    // Northeast quadrant
    L.latLngBounds(center, ne),
  ];
}

function setupContext(map) {
  map.createPane("hoverPane");
  map.getPane("hoverPane").style.zIndex = 900;
  map.getPane("hoverPane").style.pointerEvents = "none";
  return {}; // Add other shared context if needed
}
function initializeState() {
  return {
    dinsPoints: {},
    // dinsCircles: [],
    parcelDamage: new Map(),
    loadedParcels: {},
    locations: new Map(),
    loadedAPNs: new Set(),
    loadedQuadrantHashes: new Set(),
  };
}
function getParcelLocationHash(properties) {
  return [
    // properties.SitusHouseNo?.trim()?.toUpperCase(),
    // properties.SitusDirection?.trim()?.toUpperCase(),
    // properties.SitusStreet?.trim()?.toUpperCase(),
    properties.LAT_LON?.trim()
  ].filter(Boolean).join('|');
}
