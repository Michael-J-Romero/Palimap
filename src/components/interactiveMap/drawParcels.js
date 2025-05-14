"use client";
import _ from "lodash";
import {
    point,
    distance, booleanPointInPolygon,
    centroid
} from '@turf/turf';
import L from "leaflet";
let count = 0
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
    let cleaner = () => { };
    const { borderOnly, onMapClick } = options;
    map.createPane("hoverPane");
    map.getPane("hoverPane").style.zIndex = 650;
    map.createPane("boundaryPane");
    map.getPane("boundaryPane").style.zIndex = 700;
    import('esri-leaflet').then((esri) => {
        const MAX_DISTANCE_METERS = 50;
        const dinsPoints = [];
        const parcelDamage = new Map();
        const dinsCircles = [];
        const loadedParcels = [];
        const loadedAPNs = new Set();
        //make hoverPane
        const loadedQuadrantHashes = new Set();

        map.createPane("hoverPane");
        map.getPane("hoverPane").style.zIndex = 900;
        map.getPane("hoverPane").style.pointerEvents = "none";
        //make boundaryPane
        const dinsLayer = esri.featureLayer({
            url: 'https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/DINS_2025_Palisades_Public_View/FeatureServer/0',
            pointToLayer: (geojson, latlng) => {
                const p = geojson.properties;
                return L.circleMarker(latlng, {
                    weight: 0,
                    opacity:   0,
                    fillOpacity:  0,
                    interactive: false,
                })
            },
            onEachFeature: function (feature, layer) {
                dinsCircles.push(layer);
                const p = feature.properties;
                const status = p.DAMAGE || 'NoDamage';
                const latlng = layer.getLatLng();
                dinsPoints.push({ latlng, status });
                let popup = `<b>Structure Status:</b> ${status}`;
                if (p.StructureType) popup += `<br/><b>Type:</b> ${p.StructureType}`;
                layer.bindPopup(popup);
            },
        }).addTo(map); 
        const hoveredLayer = L.geoJSON(null, {
            pane: "hoverPane",

            style: (feature) => ({
                color: feature.properties.customColor || 'orange',
                weight: 2,
                fillOpacity: 0.3,
            })
        }).addTo(map);
        map.whenReady(fetchVisibleParcels);
        function fetchVisibleParcels() {
  const zoom = map.getZoom();
  if (zoom < 13) return;

  const bounds = map.getBounds();
  const quadrants = splitBoundsIntoQuadrants(bounds);

  import('esri-leaflet').then((esri) => {
    quadrants.forEach((quadBounds, index) => {
      const hash = getBoundsHash(quadBounds);

      if (loadedQuadrantHashes.has(hash)) {
        return; // ✅ Already fetched this quadrant
      }
      loadedQuadrantHashes.add(hash);

      setTimeout(() => {
        esri
          .query({
            url: 'https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/0',
          })
          .limit(2000)
          .intersects(quadBounds)
            .where('Shape__Area > ' + (zoom < 15 ? 50000
                // : zoom == 14 ? 10000
                    : 1)
            )
          .returnGeometry(true)
          .precision(5)
          .simplify(map, .5)
          .run((err, fc) => {
            if (err) {
              console.warn('Parcel query error:', err);
              return;
            }

            for (const feature of fc.features) {
              const apn = feature.properties.APN;
              if (!loadedAPNs.has(apn)) {
                loadedAPNs.add(apn);
                loadedParcels.push(feature);

                const coords = feature.geometry.coordinates?.[0];
                if (!coords) continue;

                const bounds = L.latLngBounds(coords.map(([lng, lat]) => [lat, lng]));

                let maxDamage = 0;
                for (const pt of dinsPoints) {
                  const level = DAMAGE_LEVELS[pt.status] || 0;
                  if (bounds.contains(pt.latlng) && level > maxDamage) {
                    maxDamage = level;
                  }
                }

                parcelDamage.set(apn, maxDamage);
                const color = DAMAGE_COLORS[maxDamage];
                parcelDamage.set(apn, color);
              }
            }
          });
      }, index * 300); // stagger requests
    });
  });
}

        const mouseMovefn = _.throttle((e) => {
            const mousePt = point([e.latlng.lng, e.latlng.lat]);
            hoveredLayer.clearLayers();
            for (const feature of loadedParcels) {
                const featureCenter = centroid(feature);
                const dist = distance(mousePt, featureCenter, { units: 'meters' });
                let touching = booleanPointInPolygon(mousePt, feature)
                if (dist > MAX_DISTANCE_METERS
                    && !(touching)
                ) continue;
                const apn = feature.properties.APN;
                feature.properties.customColor =
                    touching ? parcelDamage.get(apn) || 'orange'
                        : '#ffffff22';
                hoveredLayer.addData(feature);
            }
        }, 0)
        const mouseOutfn = () => {
            hoveredLayer.clearLayers();
        }
        let clickTimeout;
        function clickFn(e,...r) {
            console.log("clickk", e,r);
            // e.originalEvent.preventDefault();
            // e.originalEvent.stopPropagation();
            if (e.originalEvent.detail === 2) return;
            if(e.originalEvent.target.className=="leaflet-sbs-range"){
                return;
            }
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(() => {
                const pt = point([e.latlng.lng, e.latlng.lat]);
                const latlng = e.latlng;
                let match = null;
                for (const feature of loadedParcels) {
                    if (booleanPointInPolygon(pt, feature)) {
                        match = feature;
                        break;
                    }
                }
                if (!match) {
                    hoveredLayer.clearLayers();
                    return;
                }
                const apn = match.properties.APN;
                onMapClick({ apn });
                // alert(`APN: ${apn}`);
            }, 250);
        }
        const onDouble = function (e) {
            clearTimeout(clickTimeout);
        }
        dinsLayer.on('load',fetchVisibleParcels);
        map.on('zoomend', fetchVisibleParcels);
        map.on('moveend', fetchVisibleParcels);
        map.on('mousemove', mouseMovefn);
        map.on('mouseout', mouseOutfn);
        map.on('click', clickFn);
        map.on('dblclick', onDouble);
        cleaner = () => {
            map.off('zoomend', fetchVisibleParcels);
            clearTimeout(clickTimeout);
            map.off('moveend', fetchVisibleParcels);
            map.off('mousemove', mouseMovefn);
            map.off('mouseout', mouseOutfn);
            map.off('click', clickFn);
            map.off('dblclick', onDouble);
            map.removeLayer(dinsLayer);
            map.removeLayer(hoveredLayer);
            map.removeLayer(dinsCircles);
            // map.removeLayer(Satellite);
        }
    })
    return () => cleaner();
}
function parcelStyle(zoom, color, hover = false) {
    return {
        weight: zoom < 18 ? 1 : 2,
        fillColor: color,
        color: color,
        ...hover ?
            {
                weight: 2,
                fillOpacity: 0.2,
                opacity: .8,
            }
            :
            {
                color: '#000000',
                fillOpacity: 0,
                opacity: .1,
            }
    }
}
function getBoundsHash(bounds) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  // Round coordinates to ~3 decimal places to reduce precision-based duplication
  return `${sw.lat.toFixed(3)}-${sw.lng.toFixed(3)}-${ne.lat.toFixed(3)}-${ne.lng.toFixed(3)}`;
}
function splitBoundsIntoQuadrants(bounds) {
  const center = bounds.getCenter();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const nw = L.latLng(center.lat, sw.lng);
  const se = L.latLng(sw.lat, center.lng);
  const neCorner = L.latLng(ne.lat, ne.lng);
  const centerPoint = L.latLng(center.lat, center.lng);

  return [
    L.latLngBounds(sw, centerPoint),                          // bottom-left
    L.latLngBounds(se, L.latLng(center.lat, ne.lng)),         // bottom-right
    L.latLngBounds(nw, L.latLng(ne.lat, center.lng)),         // top-left
    L.latLngBounds(centerPoint, neCorner),                    // top-right
  ];
}

export default makeFireMap;