"use client";
import React, { useState, useRef,useEffect  } from "react";
import { APIProvider, Map,useMap } from "@vis.gl/react-google-maps";
import { useTheme } from "@mui/material/styles";
import CustomMarker from "./CustomMarker";


const MapTypeChangeListener = ({ onMapTypeIdChange }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const listener = map.addListener("maptypeid_changed", () => {
      const type = map.getMapTypeId();
      onMapTypeIdChange?.(type);
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [map, onMapTypeIdChange]);

  return null;
};


// Google default and dark styles
const lightStyle = []; // default is just empty
const darkStyle = [/* ...same style array as before... */];

const Map1 = ({ openLocation,setSelectedLocation, selectedMarker, setSelectedMarker, itemData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [mapType, setMapType] = useState("terrain");
  const mapRef = useRef(null);
  const center = { lat: 34.0621109620369, lng: -118.53594918784022 };
 
  return (
    <APIProvider apiKey="AIzaSyB1GMYLuVbGQw-hz_lMfZfEUUXh3aEFOek">
      <Map
        // key={isDarkMode ? "dark" : "light"} // 👈 this is the trick
        ref={mapRef}
        defaultCenter={center}
        defaultZoom={13}
        mapTypeId={mapType}
        fullscreenControl={false}
        streetViewControl={false}
        zoomControl={true}
        mapTypeControl={true}
        clickableIcons={false}
        style={{ width: "100%", height: "100%" }}
        onClick={(props) => {
          setSelectedMarker(null);
          setSelectedLocation(null);
        }} 
        
        
        colorScheme={isDarkMode ? "DARK" : "LIGHT"}
      >
        <MapTypeChangeListener onMapTypeIdChange={(type) => {
    setMapType(type);
    console.log("Map type changed to:", type);
  }} />
        {itemData.map((coord, index) => (
          <CustomMarker
          openLocation={openLocation}
            key={index}
            id={1 + coord.id}
            data={coord}
            map={mapRef}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            setSelectedLocation={setSelectedLocation}
          />
        ))}
      </Map>
    </APIProvider>
  );
};

export default Map1;
