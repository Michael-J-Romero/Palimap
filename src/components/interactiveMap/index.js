"use client";
import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import addBoundaryMapPlugin from "./addBoundaryMapPlugin";
import makeFireMap from "./makeFireMap";
import drawParcels from "./drawParcels";
import makeFireMap3 from "./makeFireMap3";
import MarkerLayer from "./MarkerLayer";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
   Tooltip,TextField, InputAdornment,Button, ButtonGroup, Box, Paper, Checkbox } from "@mui/material";
import "./style.css";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import AddressAutocomplete from "@/components/searchAdress";
import GridOnIcon from "@mui/icons-material/GridOn";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LabelIcon from "@mui/icons-material/Label";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {highlightParcelWithFireData} from "./highlightParcel";
function Search({ value, onChange }) {
  return (<AddressAutocomplete
    value={value}
    onChange={()=>{}}
    placeholder="Search"
    sx={{
      width: 'max-content',
      backgroundColor: 'background.paper',
      borderRadius: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
      },
    }}
  />)
  return (
    <TextField
    
      variant="outlined"
      placeholder="Search"
      value={value}
      // component={AddressAutocomplete}
      onChange={onChange}
      size="small"
      // fullWidth
      sx={{
        width: 'max-content',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
      // make input field use AddressAutocomplete
      
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

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
const InfoButton = ({showInfo, setShowInfo}) => {
  return (
    <Button
      onClick={() => setShowInfo(!showInfo)}
      variant="outlined"
      startIcon={<AddIcon />}
      sx={{
        pointerEvents: "all",
        borderRadius: '999px', // pill shape
        textTransform: 'none',
        paddingX: 2.5,
        paddingY: 1,
        fontWeight: 500,
        boxShadow: 3,
      }}
    >
      Info
    </Button>
  );

}

const InfoDialog = ({showInfo, setShowInfo}) => {
  return (
    <Dialog
    style={{zIndex: 10000,pointerEvents: "all"}}
      open={showInfo}
      onClose={() => setShowInfo(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Map Information"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This map displays information about the area, including fire damage and parcel lines.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowInfo(false)} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SplitMapComparison(props) {
  const { setMapRef,openLocation,highlightedApn,isMobile,opacity} = props;
  const mapPadding = isMobile ? '6px' : '12px';
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const basemapLayer = useRef(null);
  const [mapMode, setMapMode] = useState("map");
  const [activeLayers, setActiveLayers] = useState(["Parcels"]);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [showInfo, setShowInfo] = useState(false);
  const highlightRef = useRef(null);
  useEffect(() => {
    let t=setTimeout(() => {
      setShowFilters(false);
    }, 5000);
    return () => {
      clearTimeout(t);
    }
  }, []);

  function onMapClick({apn, statusLabel, bounds,layer, map}) {
    openLocation(apn,"apn")
    console.log(apn, statusLabel, bounds,layer, map)
  }
  const baseOptions = {
    crossOrigin: 'anonymous',
           maxZoom: 20,
        minZoom: 10,
          tileSize: 256,
  useCache: true, // if using leaflet.tilelayer.cache plugin
// if your server supports it
    keepBuffer: 3// number of tiles outside the viewport to preload
  }

  // Save original fetch
const originalFetch = window.fetch;

// Override it
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (!response.ok) {
    const reason = await extractReason(response);
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}\nReason: ${reason}`);
  }
  return response;
};

// Optional: helper to extract JSON/text reason
async function extractReason(response) {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await response.clone().json();
      return JSON.stringify(json);
    } else {
      return await response.clone().text();
    }
  } catch (e) {
    return "[No readable body]";
  }
}
let key = '9tzfMHxgQ1N5Vs27HZKb'
  const basemaps = (esri)=>({
    map: {

      // "Esri Topo": esri.basemapLayer("Topographic"),
            "Esri Topo": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" ,...baseOptions}),

      "Esri Topo2": L.tileLayer(`https://api.maptiler.com/maps/basic-v2/?key=9tzfMHxgQ1N5Vs27HZKb#15.1/34.00841/-118.47223`,
         { attribution: "Tiles © Esri" ,...baseOptions}),
      "Esri Street": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri",...baseOptions }),
      "OpenTopoMap": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { attribution: "© OpenTopoMap" }),
      "Esri Dark Gray": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" ,...baseOptions}),
      "OSM Humanitarian": L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors, Humanitarian OSM Team",...baseOptions }),
      "OpenStreetMap Standard": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors",...baseOptions }),
      "Esri Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri",...baseOptions }),
    },
    satellite: {
      "Esri Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri",...baseOptions}),
    },
    active: {

      "Custom Fire Basemap": {
        complex: true,
        fn:makeFireMap
      }
     },
         active3: {

      "Custom Fire3 Basemap": {
        complex: true,
        fn:makeFireMap3
      }
     },
  });
  function makeParcelMap(map, fn, options) {
    const {lowOpacity} = options;
    let layer = L.tileLayer(
      "https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/tile/{z}/{y}/{x}",
      {
        pane: "topOverlay",
        attribution: "Tiles © Esri",
        maxZoom: 20,
        minZoom: 10,
        opacity: 1,
        noWrap: true,
        continuousWorld: false,
      }
    ).addTo(map);
    // layer.setOpacity(.3);
    //On zoom
    const container =  layer.getContainer()
    if(lowOpacity) {
      layer.setOpacity(.8);
      L.DomUtil.addClass(container, 'greyscale-lightest');
    }
    else {
      layer.setOpacity(1);
      L.DomUtil.addClass(container, 'greyscale');
    }
    function handleZoom() {
    const container =  layer.getContainer()
    if(!container) return
      const zoom = map.getZoom();
      if(zoom < 18   || (lowOpacity&& zoom < 11)) {
        if(lowOpacity) {
          L.DomUtil.removeClass(container, 'greyscale-light');
          L.DomUtil.addClass(container, 'greyscale-lightest');
        }
        else {
          L.DomUtil.removeClass(container, 'greyscale');
          L.DomUtil.addClass(container, 'greyscale-light');
        }
      }
      else{
        if(lowOpacity) {
          L.DomUtil.removeClass(container, 'greyscale-lightest');
          L.DomUtil.addClass(container, 'greyscale-light');
        }
        else {
        L.DomUtil.removeClass(container, 'greyscale-light');
          L.DomUtil.addClass(container, 'greyscale');
        }
      }
    }
    map.on("zoomend", handleZoom);
    // let c=drawParcels(map, () => {}, { borderOnly: true,onMapClick});
    let cleaner = () => {
      map.off("zoomend", handleZoom);
      map.removeLayer(layer);
      // c()
      
      
    };
    return cleaner;
  }

  const overlays = {
    map: {
      "Parcels":  {
        complex: true,
        fn:makeParcelMap,
        options: {lowOpacity: true},
      },
      fireDamage:{
        complex: true,
        replacesBase:true,
        fn:makeFireMap3,
      },
      "Labels": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { attribution: "© Esri", pane: "topOverlay" }),
      // "Labels": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.pbf", { attribution: "© Esri", pane: "topOverlay" }),
      // "Roads": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { attribution: "© Esri", pane: "topOverlay" }),
      // "Hillshade": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}", { attribution: "© Esri", pane: "topOverlay", opacity: 0.3 }),
      // "Labels2": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}", {
      //   attribution: "© Esri Labels",
      //   pane: "topOverlay"
      // })
    },
    satellite: {
      "Parcels":  {
        complex: true,
        fn:makeParcelMap,
      },
      fireDamage:{
        complex: true,
        replacesBase:true,
        fn:makeFireMap,
      },
      "Labels": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { attribution: "© Esri", pane: "topOverlay" }),
      //       "Labels2": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}", {
      //   attribution: "© Esri Labels",
      //   // pane: "topOverlay"
      // })
    },
   
  };
  // Setup map once
  function renderMap(map,cleaners,onMapClick) {
import('esri-leaflet').then((esri) => {
    
    let replacesBase = false;
    Object.keys(overlays[mapMode]).forEach((name) => {
      const layer = overlays[mapMode][name];
      // if not active layer, skip
      console.log(activeLayers,"activeLayers",layer,name)
      if (!activeLayers.includes(name)) return;
      if (layer.replacesBase) {
        replacesBase = true;
      }
      if (layer.complex) {
        let cleaner=layer.fn(map, () => {}, { borderOnly: true,onMapClick ,...layer.options});
        cleaners.push(cleaner);
        return;
      }
      layer.addTo(map)
    });
    if (replacesBase) {
      return;
    }
    const base = Object.values(basemaps(esri)[mapMode])[0];
    if(base.complex){
      let cleaner=base.fn(map, () => {}, { borderOnly: true,onMapClick ,...base.options});
      cleaners.push(cleaner);
    }
    else{
      base.on('tileerror', function (event) {
    console.error( event);
    throw new Error("Tile error");
    // You can also alert, send logs to a server, or display a fallback tile
  });
    base.addTo(map);
    map.invalidateSize();
 
    // basemapLayer.current = base;
    }
  });    
  }
  useEffect(() => {
    if (mapRef.current) {

      let map = mapRef.current;
      if (highlightRef.current) {
        highlightRef.current();
        highlightRef.current = null;
      }
      highlightParcelWithFireData(map, {
        props,
        moveTo:true,
        apn:highlightedApn
    }).then((e)=>{
      highlightRef.current = e;
    })
  }
  return () => {
    if (highlightRef.current) {
      highlightRef.current();
      highlightRef.current = null;
    }
  }
  }, [highlightedApn]);
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
      addBoundaryMapPlugin().then(() => {

      const map = L.map(mapContainerRef.current, {
        center: [34.040, -118.520],
        zoom: 15,
        maxZoom: 20,
        minZoom: 10,
        zoomControl: false,
        crs: L.CRS.EPSG3857,
          preferCanvas: true, // use canvas instead of DOM rendering
  updateWhenIdle: true, // don't update tiles while panning
  // inertia: false, // reduce CPU load
  // zoomAnimation: false, // optional: smoother on slow devices
      });
      let clickTimeout;
      async function handleClick(e) { 

         if (e.originalEvent.detail === 2) return;
            if(e.originalEvent.target.className=="leaflet-sbs-range"){
                return;
            }
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(async() => {
                
              
              const { lat, lng } = e.latlng;
              const parcel = await getParcelAt(map,lat, lng);
              
              if (parcel) {
          console.log('Clicked parcel:', parcel.attributes);
          onMapClick({apn:parcel.attributes.APN,statusLabel:parcel.attributes.STATUS_LABEL,bounds:parcel.geometry.coordinates,layer:parcel,map})
          // L.popup()
          //   .setLatLng([lat, lng])
          //   .setContent(`<pre>${JSON.stringify(parcel.attributes, null, 2)}</pre>`)
          //   .openOn(map);
        } else {
          console.log('No parcel found at this location.');
        }
      }, 250);
      }
           
        
        const onDouble = function (e) {
            clearTimeout(clickTimeout);
        }

      map.on('click', handleClick);
      map.on('dblclick', onDouble);
      // map.on()
      cleaners.push(() => {
        map.off('click', handleClick);
        map.off('dblclick', onDouble);
      });



    highlightParcelWithFireData(map, {
      props,
        apn:highlightedApn,moveTo:true
    }).then((e)=>{
      highlightRef.current = e;
    })



// if(!isMobile){
      L.control.zoom({ position: isMobile?"bottomright":"bottomright" }).addTo(map);
// }   
if (setMapRef) setMapRef(map); 
      mapRef.current = map;
      map.createPane("topOverlay");
      map.getPane("topOverlay").style.zIndex = 900;

      renderMap(map,cleaners,onMapClick);
      // makeFireMap(map, () => {}, { borderOnly: true });
      });
    })

    return () => {
      cleaners.forEach((cleaner) => cleaner());
      // map.off("click", handleClick);
      // map.off("dblclick", onDouble);
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
      if (layer?.preserveOnBasemapSwitch) return; // ✅ keep this one
      if (layer?.options?.pane=='markerPane3') return; // ✅ keep this one
      console.log(layer,"layerer2")
      map.removeLayer(layer);
    }); 
    renderMap(map,cleaners,onMapClick);
    return () => {
      cleaners.forEach((cleaner) => cleaner());

      // map.eachLayer((layer) => {
      //   if (layer.options?.preserveOnBasemapSwitch) return; // ✅ keep this one
      //   map.removeLayer(layer);
      // });
    };
  }, [mapMode, activeLayers]);

  const tabStyle = (mm) => (theme) => ({
    borderStyle: "solid",
    pointerEvents: "all",
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
  console.log("map modeanimatedOpacity", opacity);
  return (
    <div id="map" 
     style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* new post (bottom right) all mui components available for use (ill update imports use whatever)*/}
      <Box
        sx={{
          position: "absolute",
          bottom: mapPadding,
          left: mapPadding,
          zIndex: 1000,
        }} 
        >
        <InfoDialog {...{showInfo, setShowInfo}}/>
      {/* <AddPostButton/>  */}
      </Box>

      <Box
        sx={{
          opacity: opacity===undefined? 1 : opacity,

          position: "absolute",
          top: mapPadding,
          right: mapPadding,
          zIndex: 1000,
        }} 
        >
          <Search/>
      </Box>


      {/* layers */}
      <Box
      
          
        sx={{
          opacity: opacity===undefined? 1 : opacity,
          pointerEvents: "none",
          position: "absolute",
          bottom: mapPadding,
          left: mapPadding,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
        >
        <Box 
        sx = {{
          display: "flex",
          flexDirection: "column-reverse",
          gap: 1,
          alignItems: "flex-start",

        }}>

          {/* <Paper elevation={3} sx={{ borderRadius: 2 }}> */}
            <ButtonGroup 

            variant="contained">
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


            </ButtonGroup>
          {/* </Paper> */}
          <Layers
          {...{showFilters, mapMode,setShowFilters, activeLayers, setActiveLayers}}
          />
        </Box>
        {/* <InfoButton {...{showInfo, setShowInfo}}/> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: 'max-content',
          }}
        >
        
        </Box>

      </Box>
      
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      {mapRef.current && <MarkerLayer {...props} map={mapRef.current} mapMode={mapMode} />}
    </div>
  );
}


const layerIcons = [
  {
    key: "Parcels",
    icon: <GridOnIcon />,
    label: "Plot Lines",
    color: "#66a5d7", // light blue
    description: "Displays Plot lines around properties on the map. (Note: not visible if zoomed out too far)",
  },
  {
    key: "fireDamage",
    icon: <LocalFireDepartmentIcon />,
    label: "Fire Damage",
    color: "#c7873d", // orange
    description: "Displays areas damaged by fire on the map.",
  },
  {
    key: "Labels",
    icon: <LabelIcon />,
    label: "Labels",
    color: "#dcdcdc", // light green
    description: "Displays labels on the map for streets and places.",
  },
];

const Layers = ({ 
  size = "small", // 'small' or 'medium'
  showFilters,
  setShowFilters,mapMode,
  activeLayers,setActiveLayers
  
}) => {
  const isSmall = size === "small";
  function toggleLayer(layer) {
    setActiveLayers((prev) => {
      if (prev.includes(layer)) {
        return prev.filter((l) => l !== layer);
      } else {
        return [...prev, layer];
      }
    });
  }
  let layerIcons2 = [...layerIcons];
  if (mapMode === "map") {
    // layerIcons2.pop();
  }
  return (

    <Box
      sx={{
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        gap: isSmall ? 0.9 : 1,
        backgroundColor: "background.paper", //make transparent
        // backgroundColor: showFilters ? "#00000088" : "#00000022",
        // boxShadow: 3,
        // borderRadius: 1,
        px:showFilters ?1: 0.5,
        py: 1,
        borderRadius: showFilters ? 1 : 2,
        transition: "all 0.2s",
        width: "auto",
        pointerEvents: "all",
      }}
    ><div>

          
      <Button
        onClick={() => setShowFilters(!showFilters)}
        sx={{
          minWidth:20,
          height: 20,
          borderRadius: 1,
          p: 0,
        }}
      >
        <LayersIcon 
          onClick={() => setShowFilters(!showFilters)}
          sx={{ 
            color: "text.primary",
            fontSize: isSmall ? 16 : 20 }}
            />
            {showFilters && <Box px={1} >Layers</Box>}
        <ExpandMoreIcon
          sx={{
            color: "text.primary",
            fontSize: 17,
            marginLeft: '-5px',
            transform: showFilters ? "rotate(90deg)" : "rotate(270deg)",
            transition: "transform 0.2s",
          }}
        />
      </Button>
          </div>
      {layerIcons2.map(({ key, icon, label, color, description }) => (
        <Tooltip title={`${label}: ${description}`} arrow key={key} 
          placement="right" 
            componentsProps={{
    tooltip: {
      sx: {
        fontSize: '.8rem', // or '12px', adjust as needed
      },
    },
  }} 
         >
        {/* <Tooltip title={showFilters ? description : label} key={key} placement="bottom"> */}
          <Button
            onClick={() => toggleLayer(key)}
            variant="contained"
            color= "grey"
            sx={{
              border: "1px solid white",
              minWidth: showFilters ? (isSmall ? '100%' : '100%') : (isSmall ? 24 : 30),
              // height: showFilters ? (isSmall ? 48 : 60) : (isSmall ? 30 : 36),
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: activeLayers.includes(key) ? (color+' ') 
               : "#666", 
              color: activeLayers.includes(key) ? '#000' :"#bbb" ,
              borderRadius: showFilters ? 0.5 : 2,
              p: showFilters ? .5:
              isSmall ? .5 : .75,
              transition: "all 0.2s",
            }}
          >
            {React.cloneElement(icon, {
              fontSize: isSmall ? "small" : "medium",
              sx: { fontSize: isSmall ? 18 : 24 },
            })}
            {showFilters && (
              <Box
                component="span"
                sx={{
                  fontSize: isSmall ? 10 : 12,
                  ml: 0.5,
                  textAlign: "left",
                  lineHeight: 1,
                  flexGrow: 1,
                }}
              >
                {label}
              </Box>
             
            )}
             {showFilters && (
              <input
                type="checkbox"
                checked={activeLayers.includes(key)}
                size='small' 
                color="default"
                variant="outlined"
                // checkedIcon={icon}
                // onChange={() => toggleLayer(key)}
                sx={{
                  // color: activeLayers.includes(key) ? color : "#bbb",
                  "&.Mui-checked": {
                    // color: color,
                  },
                }}
              />
             )}
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
};
async function getParcelAt(map,lat, lng) {
  const url = 'https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/identify';
  const params = new URLSearchParams({
    f: 'json',
    tolerance: 5,
    returnGeometry: true,
    imageDisplay: '800,600,96', // dummy values
    mapExtent: getMapExtent(map),
    geometryType: 'esriGeometryPoint',
    geometry: `${lng},${lat}`, // note: x,y = lon,lat
    sr: '4326',
    layers: 'all:0',
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();
  return data.results?.[0]; // first matching parcel
}

function getMapExtent(map) {
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`; // xmin,ymin,xmax,ymax
}




export default SplitMapComparison;
