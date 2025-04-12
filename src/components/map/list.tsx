"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Chip,
  useTheme,
} from "@mui/material";

import SimpleBar from "simplebar-react";

function List({
  openLocation,
  allData,
  selectedLocation,
  setSelectedLocation,
  setSelectedMarker,
  selectedMarker,
  filterBy,
  setFilterBy,
}) {
  const theme = useTheme();
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (selectedMarker !== null) {
      const element = document.getElementById(`list-item-${selectedMarker}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedMarker]);
console.log("theme",theme)
  return (
    <Box
    boxShadow={4}
      sx={{
        zIndex: window.settings.zIndex.mapList,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        width: "100%",
        height: "100%",
        // overflowY: "auto",
        display: "flex",
        flexDirection: "column",

        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        // boxShadow={5}
        sx={{
          boxShadow: "1px 2px 4px rgba(0,0,0,0.28)",
          px: 1,
          py: 1,
          // pt: 1,
          display: "flex",
          gap: 2,
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: window.settings.zIndex.mapListMenu,
          bgcolor: theme.palette.background.subtle,
          borderTop: `1px solid rgb(0 0 0 / 8%)`,
          // borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Select 
         variant="outlined" 
          value={filterBy}
          onChange={(event) => {
            alert("not functional yet");
            setFilterBy(event.target.value);
          }}
          size="small"
          sx={{
            bgcolor: theme.palette.background.standout,
            minWidth: 140,
          }}
        >
          {[
            "View All",
            "Reconstruction",
            "Help Wanted",
            "Community Event",
            "Business opening",
            "Construction Update",
            "Fire Recovery",
            "Safety Alert",
          ].map((label) => (
            <MenuItem
              key={label}
              value={label === "View All" ? "all" : label}
            >
              {label}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          size="small"
          sx={{ 
          bgcolor: theme.palette.background.standout,
            minWidth: 120 }}
        >
          <MenuItem value="date">By Date</MenuItem>
          <MenuItem value="title">By Title</MenuItem>
          <MenuItem value="type">By Type</MenuItem>
        </Select>
      </Box>
<SimpleBar style={{ maxHeight: "100vh" }}>

        <Box
        sx={{
          overflowY: "auto",
          
          // maxHeight: "calc(100vh - 64px)",
        }}
        >
      {/* List Items */}
      {allData
        .sort((a, b) => {
          if (sortBy === "date") return new Date(b.date) - new Date(a.date);
          if (sortBy === "title") return a.title.localeCompare(b.title);
          return a.type.localeCompare(b.type);
        })
        .map((location) => {
          const isSelected = selectedMarker === 1 + location.id;

          return (
            <Box
              key={location.id}
              id={`list-item-${1 + location.id}`}
              onClick={() => openLocation( location.id)}
              // onClick={() => setSelectedLocation(1 + location.id)}
              onMouseOver={() => setSelectedMarker(1 + location.id)}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,

                display: "flex",
                px: 2,
                py: 1,
                transition: "background-color 0.2s ease",
                cursor: "pointer",
                bgcolor: isSelected
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Box
                sx={{
                  width: 180,
                  // height: "100%",
                  borderRadius: 1,
                  flexShrink: 0,
                  backgroundImage: `url(${location.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  py: 1,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.5,
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    lineHeight={1.3}
                    noWrap
                  >
                    {location.title}
                  </Typography>

                  <Chip
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {location.icon} {location.type}
                      </Box>
                    }
                    size="small"
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[800]
                          : theme.palette.grey[200],
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {location.date}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                  }}
                >
                  {location.body}
                </Typography>
              </Box>
            </Box>
          );
        })}
        </Box>
  </SimpleBar>
    </Box>
  );
}

export default List;
