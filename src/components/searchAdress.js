"use client";
import React, { useRef, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function AddressAutocomplete({ value, onChange }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const didInitialize = useRef(false);

  useEffect(() => {
    console.log("Initializing autocomplete");
    if (didInitialize.current 
      || !window.google?.maps?.places?.Autocomplete
      || !inputRef.current) return;
    didInitialize.current = true;

    const style = document.createElement("style");
style.innerHTML = `
  .pac-container {
    background-color: #1e1e1e !important;
    color: #fff !important;
    border: 1px solid #444 !important;
    z-index: 93999 !important;
    font-family: Roboto, sans-serif !important;
  }

  .pac-item {
    background-color: #1e1e1e !important;
    color: #fff !important;
    border-top: 1px solid #333 !important;
  }

  .pac-item:hover {
    background-color: #333 !important;
  }

  .pac-item-query {
    color: #fff !important;
  }

  .pac-matched {
    font-weight: bold;
    color: #90caf9 !important; /* Optional: light blue highlight */
  }
`;

    document.head.appendChild(style);

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
    

    return () => {
      if (autocompleteRef.current) {
        autocompleteRef.current.unbindAll();
       
      } 

      document.head.removeChild(style);
    };
  }, [value, onChange]);

  return (
    <TextField
      inputRef={inputRef}
      variant="outlined"
      placeholder="Search"
      value={null}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{
        opacity: 0.8,
        width: 'max-content',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
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

export default AddressAutocomplete;
