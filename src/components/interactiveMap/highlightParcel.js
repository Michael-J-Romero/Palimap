import L from 'leaflet';
import { loadParcel, getFireDamageFromArcgis } from './utilities';

let currentHighlightToken = 0;
 
export async function highlightParcelWithFireData(map, { apn, latlng, moveTo ,props}) {
  const thisToken = ++currentHighlightToken;
  let{itemData, setSelectedMarker, setSelectedLocation, selectedMarker, openLocation} = props;
  let geoJsonLayer = null;
  let dropPin = null;

  const cleanup = () => cleanupLayers(map, geoJsonLayer, dropPin);

  const parcel = await loadParcel({ apn, latlng });
  if (isOutdated(thisToken)) return cleanup;

  if (!parcel) {
    console.warn("No parcel found.");
    return cleanup;
  }

  normalizeParcelGeometry(parcel);

  const damageInfo = await getFireDamageFromArcgis(parcel);
  if (isOutdated(thisToken)) return cleanup;

  parcel.properties.fireDamageLevel = damageInfo.level;
  parcel.properties.fireDamageColor = damageInfo.color;

  ensureMapPane(map, "markerPane3", 940);
  map.invalidateSize();

  geoJsonLayer = createGeoJsonLayer(parcel, damageInfo).addTo(map);
  geoJsonLayer.preserveOnBasemapSwitch = true;
  map.invalidateSize();

  let itemHasApn = itemData.find((item) => item.apn === apn);
  if (moveTo && !itemHasApn) {
    try {
      await flyToParcel(map, parcel); 
      const center = [parcel.properties.CENTER_LAT, parcel.properties.CENTER_LON];
      dropPin = createDropPin(map, center, thisToken);
    } catch (err) {
      console.warn("Could not zoom to parcel:", err);
    }
  }

  return cleanup;
}

// ────────────────────────────────────────────────────────────────
// Helper functions (all kept in this same file)
// ────────────────────────────────────────────────────────────────

function isOutdated(token) {
  return token !== currentHighlightToken;
}

function normalizeParcelGeometry(parcel) {
  if (parcel.geometry.type === "MultiPolygon") {
    console.error("MultiPolygon", parcel.geometry.coordinates);
    parcel.geometry.type = "Polygon";
    parcel.geometry.coordinates = parcel.geometry.coordinates[0];
  }
}

function ensureMapPane(map, paneName, zIndex) {
  if (!map.getPane(paneName)) {
    map.createPane(paneName);
    map.getPane(paneName).style.zIndex = zIndex;
  } else {
    console.log(`${paneName} already exists`, map.getPane(paneName));
  }
}

function createGeoJsonLayer(parcel, damageInfo) {
  return L.geoJSON(parcel, {
    pane: "markerPane3",
    preserveOnBasemapSwitch: true,
    style: {
      zzindex: 100000,
      color: damageInfo.color === 'white' ? "black" : damageInfo.color,
      fillColor: damageInfo.color,
      weight: 2,
      fillOpacity: 0.3,
    }
  });
}

async function flyToParcel(map, parcel) {
  const coords = parcel.geometry.coordinates?.[0];
  const bounds = L.latLngBounds(coords.map(([lng, lat]) => [lat, lng]));
  map.invalidateSize();
  map.flyTo(bounds.getCenter(), map.getZoom(), {
    animate: true,
    duration: 1,
    easeLinearity: 0.25,
    maxZoom: 18,
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

function createDropPin(map, center, token) {
  ensureMapPane(map, "markerPane2", 930);

  const markerIcon = L.divIcon({
    className: 'drop-pin',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    html: `<div class="drop-pin-container"></div>`
  });

  const dropPin = L.marker(center, {
    pane: "markerPane2",
    preserveOnBasemapSwitch: true,
    icon: markerIcon
  }).addTo(map);

  setTimeout(() => {
    if (isOutdated(token)) return;
    const el = dropPin.getElement();
    if (el) el.classList.add('pin-enter');
  }, 50);

  return dropPin;
}

function cleanupLayers(map, geoJsonLayer, dropPin) {
  if (geoJsonLayer && map.hasLayer(geoJsonLayer)) {
    map.removeLayer(geoJsonLayer);
  }

  if (dropPin) {
    const el = dropPin.getElement();
    if (el) {
      el.classList.remove('pin-enter');
      el.classList.add('pin-exit');
      setTimeout(() => {
        if (map.hasLayer(dropPin)) map.removeLayer(dropPin);
      }, 500);
    } else {
      if (map.hasLayer(dropPin)) {
        map.removeLayer(dropPin);
      }
    }
  }
}


// --------------------------
// ✅ Helper Functions Below
// --------------------------

 