"use client";
import React, {  useRef, useEffect } from "react";
import {
    Box
} from "@mui/material";
function AddressAutocomplete({ value, onChange }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
  style.innerHTML = `
    .pac-container {
      display: block !important;
      width: auto !important;
      z-index: 9999 !important;
    }
  `;
  document.head.appendChild(style);
  
    if (window.google && window.google.maps && !autocompleteRef.current && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "us" },
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address, place);
        }
      });
    }
    return () => {
        document.head.removeChild(style);
      };
  }, []);

  return (<Box sx={{ 
    padding: "16px 0",
    display: "flex", flexDirection: "row", alignItems: "baseline", marginBottom: "16px",justifyContent: "center" }}>
    <div>
    Address: 
    </div>
    <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder="Start typing an address"
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          marginBottom: "16px",
        }}
    /></Box>

    // <TextField
    //   fullWidth
    //   inputRef={inputRef}
    //   value={value}
    //   label="Address"
    //   placeholder="Start typing an address"
    //   onChange={(e) => onChange(e.target.value)}
    //   margin="normal"


    //   sx={{
    //     position: "relative", // Ensure dropdown is anchored correctly
    //     zIndex: 1000          // Lift above any overlays
    //   }}
    // />
  );
}
export default AddressAutocomplete;