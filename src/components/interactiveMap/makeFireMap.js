"use client";

import L from "leaflet";
let count = 0
const DAMAGE_LEVELS = {
//     Destroyed (>50%)
// Major (26-50%)
// Minor (10-25%)
// Affected (1-9%)
    "Destroyed (>50%)": 4,
    "Major (26-50%)": 3,
    "Minor (10-25%)": 2,
    "Affected (1-9%)": 1,

    "No Damage": 0,
  };

  const DAMAGE_COLORS = {
    4: '#ff0000', // red
    3: '#ff7300', // orange
    2: '#ffcc00', // light orange    
    1: '#c5ff55', // yellowish green
    0: '#00cc00', // green
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


function makeFireMap2(map, fn,options) {
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


            // const noaaLayer = L.tileLayer(
            //     {
            //       attribution: 'Imagery © NOAA NGS Emergency Response',
            //       maxZoom: 20,
            //       opacity: 1
            //     }
            //   ).addTo(map);


            const maskedMaxar = L.tileLayer.boundaryCanvas(
                "https://map-tiles1.s3.us-west-2.amazonaws.com/unzippedTiles/{z}/{x}/{y}.png",
                // 'https://storms.ngs.noaa.gov/storms/tiles/20250128a_RGB/{z}/{x}/{y}.png',
                {
                    maxZoom: 20,
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

function parcelStyle(zoom,color,hover=false){
    return {
        weight: zoom < 18 ? 1 : 2,
        fillColor: color,
        color: color,
        // transitionDuration: "0.2s",

        ...hover?
    {
        weight: 2,
        fillOpacity: 0.6,
        opacity: .8,
    }
    :
    {
       color: '#000000',
    // color: color,
        // color: '#000000',

               fillOpacity: 0.2,
               opacity: 1,
   }
}
}   
export default makeFireMap2;