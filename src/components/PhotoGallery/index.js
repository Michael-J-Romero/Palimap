// components/PhotoGallery/index.jsx
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import PhotoGroups from "./PhotoGroups";
import GalleryModal from "./GalleryModal";


function PhotoGallery({ fireData, initialVisibleGroups = 5 }) {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

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
  const totalCount = fireData.length;
  return (
    <>
      <Box  sx={{ width: "100%" }}>
        <PhotoGroups groups={visibleGroups} onClick={handleOpen} 
        {...{expanded, setExpanded, totalCount}}
        />
      </Box>

      <GalleryModal
        open={open}
        onClose={handleClose}
        fireData={fireData}
        selectedGroup={selectedGroup}
        selectedImageIndex={selectedImageIndex}
        setSelectedGroup={setSelectedGroup}
        setSelectedImageIndex={setSelectedImageIndex}
      />
    </>
  );
}

export default PhotoGallery;
