// components/LocationListItem.jsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

function LocationListItem({ noAddress,isLast,location, isSelected, openLocation, setSelectedMarker }) {
  const theme = useTheme();
  let clamp = 2;
  if (noAddress) clamp  ++
  return (
    <Box
      key={location.id}
      id={`list-item-${1 + location.id}`}
      onClick={() => openLocation(location.id)}
      onMouseOver={() => setSelectedMarker(1 + location.id)}
      sx={{
        boxShadow: 1,
        borderBottom: isLast?'none'
        :`1px solid ${theme.palette.divider}`,
        display: "flex",
        p: 1,
        // px: 2,
        // py: 1,
        borderRadius: 1,
        transition: "background-color 0.2s ease",
        cursor: "pointer",
        bgcolor: isSelected ? theme.palette.action.selected 
        : theme.palette.background.paper,
        "&:hover": {
          bgcolor: theme.palette.action.hover,
        },
      }}
    >
      <Box
        sx={{
          width: 120,
            height: 120,
          borderRadius: 1,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
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
          // py: 1,
          px: 2,
          // backgroundColor: "background.paper",
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
            sx={{ fontFamily: "system-ui" }}
          >
            {location.title}
          </Typography>
        </Box>

        {(!noAddress)&&<Typography
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
        </Typography>}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ opacity: 0.8, mt: 0.7 }}
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
            WebkitLineClamp: clamp,
            fontSize: "0.875rem",
            lineHeight: 1.4,
          }}
        >
          {location.body}
        </Typography>
      </Box>
    </Box>
  );
}

export default LocationListItem;
