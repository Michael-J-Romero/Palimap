// components/PhotoGallery/ThumbnailGrid.jsx
import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";

function ThumbnailGrid({ fireData, selectedGroup, selectedImageIndex, setSelectedGroup, setSelectedImageIndex }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        pr: 1,
        borderLeft: `1px solid ${theme.palette.divider}`,
      }}
    >
      {fireData.map((entry) => {
        const photos = entry.photos || [];
        if (!photos.length) return null;
        const { STRUCTURETYPE, DAMAGE } = entry.attributes || {};

        return (
          <Box key={entry.attributes.OBJECTID} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {STRUCTURETYPE || "Unknown Structure Type"} ({DAMAGE || "No Damage"})
            </Typography>
            <Grid container spacing={1}>
              {photos.map((url, idx) => {
                const isSelected =
                  selectedGroup?.attributes?.OBJECTID === entry.attributes.OBJECTID &&
                  selectedImageIndex === idx;

                return (
                  <Grid item xs={6} key={idx}>
                    <Box
                      onClick={() => {
                        setSelectedGroup(entry);
                        setSelectedImageIndex(idx);
                      }}
                      sx={{
                        width: "100%",
                        height: 70,
                        backgroundImage: `url(${url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                        borderRadius: 1,
                        border: isSelected
                          ? `2px solid ${theme.palette.primary.main}`
                          : "2px solid transparent",
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}

export default ThumbnailGrid;
