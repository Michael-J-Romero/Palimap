"use client";

import L from "leaflet";

function makeFireMap(map, fn,options) {
    let cleaner = () => {};
    const {borderOnly} = options;
    map.createPane("maskedPane");
    map.getPane("maskedPane").style.zIndex = 650;
    map.createPane("boundaryPane");
    map.getPane("boundaryPane").style.zIndex = 700;
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
            if (borderOnly) {
                // return 
            }
            const maskedMaxar = L.tileLayer.boundaryCanvas(
                "https://map-tiles1.s3.us-west-2.amazonaws.com/unzippedTiles/{z}/{x}/{y}.png",
                {
                    boundary,
                    tms: true,
                    noWrap: true,
                    continuousWorld: false,
                    opacity: 1,
                    keepBuffer: 0,
                    crossOrigin: true,
                    pane: "maskedPane",
                    attribution: "Maxar Imagery (masked)"
                }
            ).addTo(map);

            const esriRight = L.tileLayer(
                "https://services.arcgisonline.com/ArcGfIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                {
                    attribution: "Tiles © Esri"
                }
            ).addTo(map);

            let Satellite= L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" })
      //add to map
            Satellite.addTo(map)


            let e=L.control.sideBySide(maskedMaxar, esriRight).addTo(map)
            cleaner = () => {
                console.log("cleaner weee");
                map.removeLayer(maskedMaxar);
                map.removeLayer(esriRight);
                map.removeLayer(shadow);
                map.removeLayer(boundary);
                map.removeLayer(Satellite);
                map.removeControl(e);
            }
            // fn(maskedMaxar);
        });
    return ()=>cleaner();
}
export default makeFireMap;