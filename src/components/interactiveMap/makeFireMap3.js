"use client";
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
function getRadius(zoom) {
    if (zoom >= 20) return 15;
    if (zoom >= 19) return 11;
    if (zoom >= 18) return 8;
    if (zoom >= 17) return 6;
    if (zoom >= 16) return 4;
    if (zoom >= 15) return 3;
    if (zoom >= 14) return 2;
    return 1;
}
function makeFireMap(map, fn, options) {
    let cleaner = () => { };
    const { borderOnly, onMapClick } = options;
    map.createPane("maskedPane");
    map.getPane("maskedPane").style.zIndex = 650;
    map.createPane("boundaryPane");
    map.getPane("boundaryPane").style.zIndex = 700;
    let borderCleaner = () => { };
        fetch("/map2.geojson")
            .then((res) => res.json())
            .then((data) => {
                const shadow = L.geoJSON(data, {
                    pane: "boundaryPane",
                    style: {
                        color: "red",
                        weight: 8,
                        opacity: 0.4,
                        fillOpacity: 0,
                        lineCap: "round",
                        lineJoin: "round"
                    }
                }).addTo(map);
    
                const boundary = L.geoJSON(data, {
                    pane: "boundaryPane",
                    style: {
                        color: "orange",
                        weight: 2,
                        fillOpacity: 0,
                        opacity: 1,
                        lineCap: "round",
                        lineJoin: "round",
                    }
                }).addTo(map);
                borderCleaner = () => {
                    map.removeLayer(shadow);
                    map.removeLayer(boundary);
                }
            });
        




    import('esri-leaflet').then((esri) => {
        const dinsPoints = [];
        const parcelDamage = new Map();
        const dinsCircles = [];
        const uniqueParcels = [];
        const seen = {}
        const dinsLayer = esri.featureLayer({
            url: 'https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/DINS_2025_Palisades_Public_View/FeatureServer/0',
            pointToLayer: (geojson, latlng) => {
                const p = geojson.properties;
                const status = p.DAMAGE || 'NoDamage';
                const level = DAMAGE_LEVELS[status] || 0;
                const color = DAMAGE_COLORS[level];
                const zoom = map.getZoom();
                const radius = getRadius(zoom);
                return L.circleMarker(latlng, {
                    weight: 0,
                    color,
                    radius,
                    opacity: zoom < 16 ? .5 : 0,
                    fillOpacity: zoom < 16 ? .5 : 0,
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
        map.on('zoomend', () => {
            const zoom = map.getZoom();
            const newRadius = getRadius(zoom);
            for (const circle of dinsCircles) {
                circle.setRadius(newRadius);
            }
        });
        let Satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" })
        //   let Satellite= L.tileLayer("https:++server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" })
        Satellite.addTo(map)
        let parcelLayer
        dinsLayer.once('load', () => {
            parcelLayer = esri.featureLayer({
                minZoom: 16,
                maxZoom: 20,
                url: 'https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/0',
                where: '1=1',
                simplifyFactor: .1,
                precision: 5,
                style: function (feature) {
                    const apn = feature?.properties?.APN;
                    const { maxDamage, isDuplicate } = parcelDamage.get(apn) || {};
                    const level = maxDamage || 0;
                    const color = isDuplicate ? "#00000000"
                        : DAMAGE_COLORS[level]
                    const zoom = map.getZoom();
                    return {
                        ...parcelStyle(zoom, color)
                    };
                },
                onEachFeature: function (feature, layer) {
                    const hash = JSON.stringify(feature.geometry.coordinates.slice(0, 2));
                    const isDuplicate = seen[hash];
                    if (!isDuplicate) seen[hash] = feature;
                    const apn = feature.properties.APN;
                    const bounds = layer.getBounds();
                    let maxDamage = 0;
                    let found = false;
                    for (let i = 0; i < dinsPoints.length; i++) {
                        const pt = dinsPoints[i];
                        const level = DAMAGE_LEVELS[pt.status] || 0;
                        if (bounds.contains(pt.latlng) && level > maxDamage) {
                            maxDamage = level;
                            found = true;
                        }
                    }
                    parcelDamage.set(apn, { maxDamage, isDuplicate });
                    const color = isDuplicate ? "#00000000"
                        : DAMAGE_COLORS[maxDamage];
                    layer.setStyle({ color: color });
                    const statusLabel = Object.keys(DAMAGE_LEVELS).find(
                        (key) => DAMAGE_LEVELS[key] === maxDamage
                    );
                    let clickTimeout;
                    layer.on('click', function (e) {
                        clearTimeout(clickTimeout);
                        clickTimeout = setTimeout(() => {
                            onMapClick({ apn, statusLabel, bounds, layer, map });
                        }, 250);
                    });
                    layer.on('dblclick', function (e) {
                        clearTimeout(clickTimeout);
                    });
                    layer.on('mouseover', function () {
                        const zoom = map.getZoom();
                        layer.setStyle({
                            ...parcelStyle(zoom, color, true),
                        });
                        layer.bringToFront();
                    });
                    layer.on('mouseout', function () {
                        const zoom = map.getZoom();
                        layer.setStyle(parcelStyle(zoom, color));
                    });
                },
            }).addTo(map);
        });
        cleaner = () => {
            borderCleaner();
            map.removeLayer(dinsLayer);
            map.removeLayer(Satellite);
            map.removeLayer(parcelLayer);
        }
    })
    return () => cleaner();
}
function parcelStyle(zoom = 1, color, hover = false) {
    return {
        weight: zoom < 18 ? 1 : 2,
        fillColor: color,
        color: color,
        ...hover ?
            {
                weight: 2,
                fillOpacity: 0.6,
                opacity: .8,
            }
            :
            {
                color: '#000000',
                fillOpacity: 0.2,
                opacity: 0,
            }
    }
}
export default makeFireMap