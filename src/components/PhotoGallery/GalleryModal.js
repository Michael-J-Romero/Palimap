// components/PhotoGallery/GalleryModal.jsx
import React from "react";
import { Box, Modal, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbnailGrid from "./ThumbnailGrid";

function GalleryModal({
  open,
  onClose,
  fireData,
  selectedGroup,
  selectedImageIndex,
  setSelectedGroup,
  setSelectedImageIndex,
}) {
  const theme = useTheme();
  const selectedUrl = selectedGroup?.photos?.[selectedImageIndex];

  return (
    <Modal open={open} onClose={onClose}>
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
          <IconButton onClick={onClose}>
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
            {selectedUrl && (
              <>
                <Box
                  sx={{
                    width: "100%",
                    height: 450,
                    backgroundImage: `url(${selectedUrl})`,
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

          {/* Thumbnails */}
          <ThumbnailGrid
            fireData={fireData}
            selectedGroup={selectedGroup}
            selectedImageIndex={selectedImageIndex}
            setSelectedGroup={setSelectedGroup}
            setSelectedImageIndex={setSelectedImageIndex}
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default GalleryModal;
