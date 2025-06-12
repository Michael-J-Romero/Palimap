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
        width: { xs: '150px', sm: '150px', md: "250px", lg: "max-content" },
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
