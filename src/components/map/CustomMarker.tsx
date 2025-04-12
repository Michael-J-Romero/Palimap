"use client";
import React, { useState, useEffect } from "react";
import {
  Marker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  Box,
  Typography,
  Button,
  useTheme,
} from "@mui/material";

const MapWithInteractiveMarker = ({
  openLocation,
  id,
  data,
  selectedMarker,
  setSelectedMarker,
  setSelectedLocation,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const map = useMap();

  const { icon, coords: markerPosition, title, type, image: img2, date } = data;
  const [hoverMarker, setHoverMarker] = useState(false);
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    if (hoverMarker) {
      setIconUrl(img2);
    } else {
      setIconUrl(
        "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
              <circle cx="24" cy="24" r="24" 
              fill="${
                isDarkMode ? "#00000022" : "#ffffff"
              }"
              stroke="${
                isDarkMode ? "#ffffff33" : 
                type === "Fire Recovery" 
                ? "#FF0000" 
                : "#0000FF"}"
              stroke-width="3"/>
              <text 
                x="${type === "Fire Recovery" ? "8" : "5"}"
                y="34" font-size="30"
              >
                ${icon}
              </text>
            </svg>
          `)
      );
    }
  }, [hoverMarker, icon, img2, type, isDarkMode]);

  useEffect(() => {
    const existing = document.getElementById("custom-infowindow-style");
    if (existing) existing.remove();

    const style = document.createElement("style");
    style.id = "custom-infowindow-style";
    style.innerHTML = `
      .gm-style-iw {
        background-color: ${isDarkMode ? "#1e1e1e" : "#ffffff"} !important;
        color: ${isDarkMode ? "#ffffff" : "#000000"} !important;
        border-radius: 8px !important;
        padding: 0 !important;
      }

      .gm-style-iw-c {
        // box-shadow: none !important;
      }
      .gm-style-iw-ch{
        padding-left: 16px !important;
      }

      .gm-style-iw-d {
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .gm-ui-hover-effect {
        filter: ${isDarkMode ? "invert(1)" : "none"};
        top: 4px !important;
        right: 4px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [isDarkMode]);

  return (
    <>
      <Marker
        position={markerPosition}
        icon={{
          url: iconUrl,
          scaledSize: new window.google.maps.Size(
            hoverMarker ? 60 : 30,
            hoverMarker ? 60 : 30
          ),
        }}
        onMouseOver={() => setHoverMarker(true)}
        onMouseOut={() => setHoverMarker(false)}
        onClick={() => setSelectedMarker(id)}
      />

      {selectedMarker === id && (
        <InfoWindow
          position={markerPosition}
          pixelOffset={[0, -36]}
          onCloseClick={() => setSelectedMarker(null)}
          headerContent={
            <Typography variant="h6" fontWeight="bold" fontSize="1.2em">
              {title}
            </Typography>
          }
        >
          <Box
            sx={{
              maxWidth: 280,
              width: "100%",
              bgcolor: isDarkMode
                ? theme.palette.grey[900]
                : theme.palette.background.paper,
              color: isDarkMode
                ? theme.palette.common.white
                : theme.palette.text.primary,
              // borderRadius: .2,
              // overflow: "hidden",
              m: 0,
              p: .5,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 150, 
                backgroundImage: `url(${img2})`,
                borderRadius: .3,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box sx={{ px: 1, py: 1.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
              >
                posted: {date} <br />
                7 comments <br />
                28 likes
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  openLocation(data.id);
                  }
                }
                sx={{ mt: 1.5, textTransform: "none" }}
              >
                View Full Info
              </Button>
            </Box>
          </Box>
        </InfoWindow>
      )}
    </>
  );
};

export default MapWithInteractiveMarker;
