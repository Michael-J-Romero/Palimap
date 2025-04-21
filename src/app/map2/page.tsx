"use client";
import React, { useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-side-by-side";

// ✅ Extend Leaflet with canvas-based mask plugin using per-pixel alpha masking
function addPlugin(){
    if (typeof window !== "undefined" && window.L && !window.L.TileLayer.BoundaryCanvas) {
        L.TileLayer.BoundaryCanvas = L.TileLayer.extend({
          
          options: {
            async: true
          },
      
          initialize: function (url, options) {
            L.TileLayer.prototype.initialize.call(this, url, options);
            this._boundary = options.boundary;
          },
      
          createTile: function (coords, done) {
              const tileSize = this.getTileSize();
              const canvas = document.createElement("canvas");
              canvas.width = tileSize.x;
              canvas.height = tileSize.y;
              const ctx = canvas.getContext("2d");
        
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = this.getTileUrl(coords);
        
              img.onload = () => {
                ctx.drawImage(img, 0, 0, tileSize.x, tileSize.y);
        
                // Create an alpha mask
                const maskCanvas = document.createElement("canvas");
                maskCanvas.width = tileSize.x;
                maskCanvas.height = tileSize.y;
                const maskCtx = maskCanvas.getContext("2d");
        
                const nwPoint = coords.scaleBy(tileSize);
                const path = new Path2D();
        
                this._boundary.eachLayer((layer) => {
                  if (!layer.getLatLngs) return;
                  const latlngs = layer.getLatLngs();
                  const rings = Array.isArray(latlngs[0]) ? latlngs : [latlngs];
        
                  rings.forEach((ring) => {
                    const flat = Array.isArray(ring[0]) ? ring.flat() : ring;
                    if (flat.length === 0) return;
        
                    const first = this._map.project(flat[0], coords.z).subtract(nwPoint);
                    path.moveTo(first.x, first.y);
        
                    flat.forEach((latlng) => {
                      const point = this._map.project(latlng, coords.z).subtract(nwPoint);
                      path.lineTo(point.x, point.y);
                    });
        
                    path.closePath();
                  });
                });
        
                maskCtx.fillStyle = "black";
                maskCtx.fillRect(0, 0, tileSize.x, tileSize.y);
                maskCtx.fillStyle = "white";
                maskCtx.fill(path);
        
                const imgData = ctx.getImageData(0, 0, tileSize.x, tileSize.y);
                const maskData = maskCtx.getImageData(0, 0, tileSize.x, tileSize.y);
        
                for (let i = 0; i < imgData.data.length; i += 4) {
                  imgData.data[i + 3] = maskData.data[i]; // red channel as alpha
                }
        
                ctx.clearRect(0, 0, tileSize.x, tileSize.y);
                ctx.putImageData(imgData, 0, 0);
        
                done(null, canvas);
              };
        
              img.onerror = () => {
                done(new Error("Tile load error"), canvas);
              };
        
              return canvas;
            }
        });
      
        L.tileLayer.boundaryCanvas = function (url, options) {
          return new L.TileLayer.BoundaryCanvas(url, options);
        };
      }
}

function SplitMapComparison() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    addPlugin();
    const map = L.map(mapContainerRef.current, {
      center: [34.055, -118.55],
      zoom: 14,
      maxZoom: 22,
      zoomControl: true,
      crs: L.CRS.EPSG3857
    });

    mapRef.current = map;

    // ✅ Custom panes
    map.createPane("maskedPane");
    map.getPane("maskedPane").style.zIndex = 650;

    map.createPane("topOverlay");
    map.getPane("topOverlay").style.zIndex = 700;

    // ✅ Basemap layers
    const esriImagery = L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" }
    ).addTo(map);

    const osmVector = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap contributors" }
    );

    // ✅ Road & label overlays in top pane
    // const roads = L.tileLayer(
    //   "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
    //   {
    //     attribution: "© Esri Roads",
    //     pane: "topOverlay"
    //   }
    // ).addTo(map);

    const labelsOverlay = L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© Esri Labels",
        pane: "topOverlay"
      }
    ).addTo(map);

    // ✅ Layer control toggle
    const baseMaps = {
      "Satellite (Imagery)": esriImagery,
      "Vector (Streets)": osmVector
    };

    const overlayMaps = {
    //   "Roads": roads,
      "Labels": labelsOverlay
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);

    fetch("/map2.geojson")
      .then((res) => res.json())
      .then((data) => {
        const shadow = L.geoJSON(data, {
            style: {
              color: "red",
              weight: 10,
              opacity: 0.4,
              fillOpacity: 0,
              lineCap: "round",
              lineJoin: "round"
            }
          }).addTo(map);
          
          // Main crisp border on top
          const boundary = L.geoJSON(data, {
            style: {
              color: "orange",
              weight: 2,
              fillOpacity: 0,
              opacity: 1,
                lineCap: "round",
                lineJoin: "round",
                
            }
          }).addTo(map);

        // map.fitBounds(boundary.getBounds());

        const maskedMaxar = L.tileLayer.boundaryCanvas(
        //   "/tiles2/tiles2/{z}/{x}/{y}.png",
          "https://map-tiles1.s3.us-west-2.amazonaws.com/unzippedTiles/{z}/{x}/{y}.png",
          {
            boundary,
            tms: true,
            noWrap: true,
            continuousWorld: false,
            opacity: 1,
            pane: "maskedPane",
            attribution: "Maxar Imagery (masked)"
          }
        ).addTo(map);

        const esriRight = L.tileLayer(
          "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "Tiles © Esri"
          }
        ).addTo(map);

        L.control.sideBySide(maskedMaxar, esriImagery).addTo(map);
      });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />;
}

export default SplitMapComparison;
