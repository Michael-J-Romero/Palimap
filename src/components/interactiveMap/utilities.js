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
function loadParcel({ apn, latlng }) {
    return new Promise((resolve, reject) => {
        const query = esri.query({ url: PARCEL_URL })
            .returnGeometry(true)
            .limit(10)
            .precision(5);
        if (apn) {
            query.where(`APN = '${apn}'`);
        } else if (latlng) {
            const bounds = L.latLng(latlng).toBounds(1);
            query.intersects(bounds);
        } else {
            reject("Must provide apn or latlng");
            return;
        }
        query.run((err, featureCollection) => {
            if (err || !featureCollection.features.length) {
                console.warn("Parcel query error:", err);
                resolve(null);
            } else {
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
export { loadParcel, getFireDamageFromArcgis, timeoutWithRetry };