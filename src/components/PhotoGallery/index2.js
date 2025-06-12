// PhotoGallery.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Modal,
  Typography,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function PhotoGallery({ fireData, initialVisibleGroups = 3 }) {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleOpen = (entry, index = 0) => {
    setSelectedGroup(entry);
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedGroup(null);
    setSelectedImageIndex(0);
  };

  const visibleGroups = expanded ? fireData : fireData.slice(0, initialVisibleGroups);

  return (
    <>
      <Box>
        {visibleGroups.map((entry) => {
          const photos = entry.photos || [];
          if (!photos.length) return null;
          const { STRUCTURETYPE, DAMAGE } = entry.attributes || {};

          return (
            <Box key={entry.attributes.OBJECTID} sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: 2,
                    mb: 2,

                  }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1, fontWeight: 500 }}
              >
                {STRUCTURETYPE || "Unknown Structure Type"} 
                <br />
                {DAMAGE || "No Damage"}
              </Typography>
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
              }}>
                {photos.map((url, idx) => (
                    <Box
                      onClick={() => handleOpen(entry, idx)}
                      sx={{
                        // width: "100%",
                        width: 120,
                        height: 80,
                        backgroundImage: `url(${url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                    />
                ))}
              </Box>
            </Box>
          );
        })}

        {!expanded && fireData.length > initialVisibleGroups && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="outlined" onClick={() => setExpanded(true)}>
              View More
            </Button>
          </Box>
        )}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            maxWidth: 1200,
            width: "95%",
            height: "90vh",
            overflow: "hidden",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Photo Gallery</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexGrow: 1, gap: 3, overflow: "hidden" }}>
            {/* Large Image Display */}
            <Box
              sx={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedGroup?.photos?.[selectedImageIndex] && (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      height: 450,
                      backgroundImage: `url(${selectedGroup.photos[selectedImageIndex]})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      borderRadius: 1,
                    }}
                  />
                  <Typography mt={2} variant="body2" color="text.secondary">
                    {selectedGroup.attributes?.STRUCTURETYPE || "Unknown Structure Type"} (
                    {selectedGroup.attributes?.DAMAGE || "No Damage"})
                  </Typography>
                </>
              )}
            </Box>

            {/* Thumbnail Panel */}
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
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      {STRUCTURETYPE || "Unknown Structure Type"} ({DAMAGE || "No Damage"})
                    </Typography>
                    <Grid container spacing={1}>
                      {photos.map((url, idx) => (
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
                              border:
                                selectedGroup?.attributes?.OBJECTID === entry.attributes.OBJECTID &&
                                selectedImageIndex === idx
                                  ? `2px solid ${theme.palette.primary.main}`
                                  : "2px solid transparent",
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default PhotoGallery;
