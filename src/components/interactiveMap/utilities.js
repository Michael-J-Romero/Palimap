import * as esri from 'esri-leaflet';
import L from 'leaflet';
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
const PARCEL_URL = 'https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/0';
const DINS_URL = 'https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/DINS_2025_Palisades_Public_View/FeatureServer/0';
let currentHighlightToken = 0; // global token for tracking calls


function normalizeParcelFeature(feature) {
  const properties = feature.attributes || feature.properties;
  const geometry = feature.geometry;

  // Convert ESRI geometry to GeoJSON if needed
  const geojsonGeometry = geometry.rings
    ? {
        type: 'Polygon',
        coordinates: geometry.rings,
      }
    : {
        type: 'Point',
        coordinates: [geometry.x, geometry.y],
      };

  return {
    type: 'Feature',
    properties,
    geometry: geojsonGeometry,
  };
}


function getMapExtent(map) {
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`; // xmin,ymin,xmax,ymax
}

let parcelCache = new Map(); // cache for parcels by lat lng
let cooldown = Date.now()
async function getParcelAtCoords(map,lat, lng) {
    const cacheKey = `${lat},${lng}`;
    if (parcelCache.has(cacheKey)) {
        console.log("Parcel found in cache44:", cacheKey);
        return parcelCache.get(cacheKey);
    }
    else {
        // Cooldown to prevent too many requests in a short time
        getRadius();

    }

    // If not in cache, fetch from the server

 
       const url = 'https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/identify';
  const params = new URLSearchParams({
    f: 'json',
    tolerance: 1, 
    returnGeometry: true,
    
    imageDisplay: '800,600,96', // this
    mapExtent: map?getMapExtent(map): '34.0,-118.5,34.5,-118.0', // default extent if map not provided
    geometryType: 'esriGeometryPoint',
    geometry: `${lng},${lat}`, // note: x,y = lon,lat
    sr: '4326',
    layers: 'all:0',
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  let p = data.results?.[0]
    if (!p) {
        console.warn("No parcel found at coordinates:", lat, lng);
        return null;
    }
//   p.properties = p.attributes || {};
  p= normalizeParcelFeature(p);

  return p; // first matching parcel


    function getRadius() {
        if (Date.now() - cooldown < 1000) {
            console.warn("Cooldown active, skipping parcel fetch");
            return null;
        }
        cooldown = Date.now();
        // query large radius around the point and cache all parcels
        const query = esri.query({ url: PARCEL_URL })
            .returnGeometry(true)
            .limit(1000) // increase limit to get more parcels
            .precision(5)
            .contains(L.latLng(lat, lng));
        query.run((err, featureCollection) => {
            if (!featureCollection.features?.length) {
                console.warn("No parcels found at coordinates:", lat, lng);
                return null;
            }
            const parcels = featureCollection.features; //.map(normalizeParcelFeature);
            for (const parcel of parcels) {
                const key = `${parcel.geometry.coordinates[0][0][1]},${parcel.geometry.coordinates[0][0][0]}`;
                console.log("parcel55", parcel,key)
                parcelCache.set(key, parcel);
            }
        });
    }
}



function loadParcel({ apn, latlng,map }) {
    if (latlng) {
        let lat = latlng.lat || latlng[0];
        let lng = latlng.lng || latlng[1];
        const p = getParcelAtCoords(map, lat, lng)
        return p;
    }
    return new Promise((resolve, reject) => {
        const query = esri.query({ url: PARCEL_URL })
            .returnGeometry(true)
            .limit(10)
            .precision(5);
        if (apn) {
            query.where(`APN = '${apn}'`);
        } 
        // else if (latlng) {
        //     // const bounds = L.latLng(latlng).toBounds(.0001);
        //     // query.intersects(bounds);
        //     query.contains(latlng);
        // } 
        else {
            reject("Must provide apn or latlng");
            return;
        }
  console.log("parcel2")
  
  query.run((err, featureCollection) => {
            console.log("parcel2")
            if (err || !featureCollection.features.length) {
                console.warn("Parcel query error:", err);
                resolve(null);
            } else {
                if(featureCollection.features.length > 1) {
                    console.warn("Multiple parcels found, using first one");
                    alert("Multiple parcels found, using first one"+featureCollection.features.length);
                }
                resolve(featureCollection.features[0]);
            }
        });
    });
}
async function getFireDamageFromArcgis(parcelFeature) {
    if (!parcelFeature || !parcelFeature.geometry) {
        return { level: 0, color: DAMAGE_COLORS[0] };
    }
    const fireEndpoint = `${DINS_URL}/query`;
    const esriGeometry = {
        rings: parcelFeature.geometry.coordinates,
        spatialReference: { wkid: 4326 },
    };
    const params = new URLSearchParams({
        geometry: JSON.stringify(esriGeometry),
        geometryType: "esriGeometryPolygon",
        spatialRel: "esriSpatialRelIntersects",
        outFields: "*",
        returnGeometry: "false",
        where: "1=1",
        f: "json",
    });
    try {
        const response = await fetch(`${fireEndpoint}?${params}`);
        const data = await response.json();
        let maxLevel = 0;
        for (const feature of data.features || []) {
            const level = DAMAGE_LEVELS[feature.attributes?.DAMAGE] || 0;
            if (level > maxLevel) maxLevel = level;
        }
        return {
            level: maxLevel,
            color: DAMAGE_COLORS[maxLevel]
        };
    } catch (err) {
        console.warn("Failed to fetch fire data from ArcGIS:", err);
        return { level: 0, color: 'white' };
    }
}
function timeoutWithRetry(fn, delay, retries = 3) {
    return new Promise((resolve, reject) => {
        const attempt = (n) => {
            setTimeout(() => {
                try {
                    fn();
                    resolve();
                } catch (err) {
                    if (n === 1) {
                        reject(err);
                    } else {
                        attempt(n - 1);
                    }
                }
            }, delay);
        };
        attempt(retries);
    });
}
export { loadParcel, getFireDamageFromArcgis, timeoutWithRetry , getParcelAtCoords };