"use client";
import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import addBoundaryMapPlugin from "./addBoundaryMapPlugin";
import makeFireMap from "./makeFireMap";
import MarkerLayer from "./MarkerLayer";
import { Button, ButtonGroup, Box, Paper } from "@mui/material";
import "./style.css";
import AddIcon from '@mui/icons-material/Add';

const AddPostButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        borderRadius: '999px', // pill shape
        textTransform: 'none',
        paddingX: 2.5,
        paddingY: 1,
        fontWeight: 500,
        boxShadow: 3,
      }}
    >
      Add Post
    </Button>
  );
};


function SplitMapComparison(props) {
  const { setMapRef } = props;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const basemapLayer = useRef(null);
  const [mapMode, setMapMode] = useState("satellite");

  
  const basemaps = {
    map: {
      "Esri Topo": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" }),
      "OpenStreetMap Standard": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }),
      "OSM Humanitarian": L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors, Humanitarian OSM Team" }),
      "Esri Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" }),
      "Esri Street": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" }),
      "Esri Dark Gray": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" }),
      "OpenTopoMap": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { attribution: "© OpenTopoMap" }),
    },
    satellite: {
      "Esri Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" }),
    },
    active: {

      "Custom Fire Basemap": {
        complex: true,
        fn:makeFireMap
      }
     }
  };

  const overlays = {
    map: {
      // "Labels": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.pbf", { attribution: "© Esri", pane: "topOverlay" }),
      // "Roads": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { attribution: "© Esri", pane: "topOverlay" }),
      // "Hillshade": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}", { attribution: "© Esri", pane: "topOverlay", opacity: 0.3 }),
      // "Labels2": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}", {
      //   attribution: "© Esri Labels",
      //   pane: "topOverlay"
      // })
    },
    satellite: {
      "Roads": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { attribution: "© Esri", pane: "topOverlay" }),
      //       "Labels2": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}", {
      //   attribution: "© Esri Labels",
      //   // pane: "topOverlay"
      // })
    },
    active: {}
  };
  // Setup map once
  function renderMap(map,cleaners) {
    const base = Object.values(basemaps[mapMode])[0];
    if(base.complex){
      let cleaner=base.fn(map, () => {}, { borderOnly: true });
      cleaners.push(cleaner);
      return;
    }
    base.addTo(map);
    basemapLayer.current = base;
    Object.values(overlays[mapMode]).forEach(layer => layer.addTo(map));
  }
  useEffect(() => {
    let cleaners = [];
    (function patchTiles() {
      const originalInitTile = L.GridLayer.prototype._initTile;
      L.GridLayer.include({
        _initTile: function (tile) {
          originalInitTile.call(this, tile);
          const tileSize = this.getTileSize();
          tile.style.width = tileSize.x + 1 + "px";
          tile.style.height = tileSize.y + 1 + "px";
        }
      });
    })(); 
    import("leaflet-side-by-side").then(() => {
      addBoundaryMapPlugin();

      const map = L.map(mapContainerRef.current, {
        center: [34.051, -118.535],
        zoom: 14,
        maxZoom: 19,
        minZoom: 10,
        zoomControl: false,
        crs: L.CRS.EPSG3857
      });
      L.control.zoom({ position: "topright" }).addTo(map);
      if (setMapRef) setMapRef(map); 
      mapRef.current = map;
      map.createPane("topOverlay");
      map.getPane("topOverlay").style.zIndex = 700;

      renderMap(map,cleaners);
      // makeFireMap(map, () => {}, { borderOnly: true });
    });

    return () => {
      cleaners.forEach((cleaner) => cleaner());
      mapRef.current?.remove()
    };
  }, []);

  // Change base + overlay when mapMode changes
  useEffect(() => {
    let cleaners = [];
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer.options?.preserveOnBasemapSwitch) return; // ✅ keep this one
      map.removeLayer(layer);
    });
    renderMap(map,cleaners);
    return () => {
      cleaners.forEach((cleaner) => cleaner());
      // map.eachLayer((layer) => {
      //   if (layer.options?.preserveOnBasemapSwitch) return; // ✅ keep this one
      //   map.removeLayer(layer);
      // });
    };
  }, [mapMode]);

  const tabStyle = (mm) => (theme) => ({
    borderStyle: "solid",
    borderWidth: 2,
    borderColor:
      mapMode === mm
        ? (theme.palette.mode !== "dark" ? "#ffffff" : "#000000") + " !important"
        : "rgba(0,0,0,0.12) !important",

    backgroundColor: mapMode === mm ?  'background.default' : "background.primary.default",
    color: mapMode === mm ? "primary.light" 
    : "text.primary",
    // borderColor:( mapMode === mm ? 'white' 
    //   : "rgba(0,0,0,0.12)") + " !important",
    "&:hover": {
      borderWidth: 2,
      backgroundColor: mapMode === mm ? "primary" : "background.primary.default",
    },
  })
  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* new post (bottom right) all mui components available for use (ill update imports use whatever)*/}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 12,
          zIndex: 1000,
        }} 
        >
      {/* <AddPostButton/> */}
      </Box>
      {/* layers */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1000,
        }}
      >
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <ButtonGroup variant="contained">
            <Button
              onClick={() => setMapMode("satellite")}
              color={  "inherit"}
              sx={tabStyle("satellite")}
                        >
              Satellite
            </Button>
            <Button
              onClick={() => setMapMode("map")}
              color={  "inherit"}
              sx={tabStyle("map")}
              >
              Map
            </Button>
            <Button
              onClick={() => setMapMode("active")}
              color={  "inherit"}
              sx={tabStyle("active")}
            >
              Burn Area
            </Button>

          </ButtonGroup>
        </Paper>
      </Box>
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      {mapRef.current && <MarkerLayer {...props} map={mapRef.current} mapMode={mapMode} />}
    </div>
  );
}

export default SplitMapComparison;
