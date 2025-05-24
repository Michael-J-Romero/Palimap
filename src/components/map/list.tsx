"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Chip,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SimpleBar from "simplebar-react";
import {settings as allSettings,types} from '@/data/builtIn'
import NewPostButton from "../NewPost";
const settings=allSettings




function List({
  openLocation,
  allData,
  selectedLocation,
  setSelectedLocation,
  setSelectedMarker,
  selectedMarker,
  filterBy,
  setFilterBy,
  isMobile,
}) {
  const [sortBy, setSortBy] = useState("date");
  let data=allData
  .sort((a, b) => {
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return a.type.localeCompare(b.type);
  })
  .filter((location) => {
    if (filterBy === "all") return true;
    if (filterBy === "View All") return true;
    if (location.type === filterBy) return true;
    return false;
  })
  const theme = useTheme();

  useEffect(() => {
    if (selectedMarker !== null) {
      const element = document.getElementById(`list-item-${selectedMarker}`);
      if (element) {
        // element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedMarker]);
console.log("theme",theme)
  return (
    <Box

    boxShadow={4}
      sx={{
        zIndex: settings.zIndex.mapList,
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
          pt: 1.3,
          display: "flex",
          gap: 2,
          alignItems: "space-between",  
          justifyContent: "space-evenly",
          position: "sticky",
          top: 0,
          zIndex: settings.zIndex.mapListMenu,
          bgcolor: theme.palette.background.subtle,
          borderTop: `1px solid rgb(0 0 0 / 8%)`,
          // borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* <img 
        src="/logo.png"
        alt="logo"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          scale: 1.5,
          marginRight: 8,
        }}
        /> */}
        <Select 
         variant="outlined" 
          value={filterBy}
          onChange={(event) => {
            setFilterBy(event.target.value);
          }}
          size="small"
          sx={{
            bgcolor: theme.palette.background.standout,
            minWidth: 140,
          }}
        >
          {
          
          // [
          //   "View All",
          //   "Reconstruction",
          //   "Help Wanted",
          //   "Community Event",
          //   "Business opening",
          //   "Construction Update",
          //   "Fire Recovery",
          //   "Safety Alert",
          // ]
          [ {
              icon:"",
              type: "View All",
            
          },...types,]
          .map((e) => (
            <MenuItem
              key={e.type}
              value={e.type === "View All" ? "all" : e.type}
            >
               {e.icon} {' '} {e.type}
            </MenuItem>
          ))}
        </Select>

{!isMobile &&
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
        }
        <NewPostButton />

      </Box>
<SimpleBar style={{ maxHeight: "100vh" }}>

        <Box
        sx={{
          overflowY: "auto",
          
          // maxHeight: "calc(100vh - 64px)",
        }}
        >
      {/* List Items */}
      {data
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
                    fontWeight={100}
                    lineHeight={1.2}
                    noWrap
                    sx={{
                      fontFamily: "system-ui",
                    }}
                  >
                    {location.title}
                  </Typography>

                  
                </Box>
                  {/* address */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {location.address || "1234 Main St, Los Angeles, CA 90001"}
                  </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ 
                    opacity: 0.8,
                    mt: 0.7
                  }}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: theme.palette.text.secondary,
          }}
          >
          <Typography variant="body2" color="text.secondary">
          {data.length === 0 ? (
            'No locations found.'
          )
        : (
            <span style={{ opacity: 0.7 }}>
              end of results
            </span>
          )
        }
          </Typography>

            
        </Box>
        </Box>
  </SimpleBar>
    </Box>
  );
}

export default List;
