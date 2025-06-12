// components/PhotoGallery/PhotoGroups.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

function PhotoGroups({ groups = [], onClick, expanded, setExpanded, totalCount }) {
  const visibleCount = groups.length;
  const hiddenCount = totalCount - visibleCount;

  const showExpandTile = !expanded && hiddenCount > 0;

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        {groups.map((entry) => {
          const photos = entry.photos || [];
          if (!photos.length) return null;

          const { STRUCTURETYPE, DAMAGE, OBJECTID } = entry.attributes || {};
          const mainPhoto = photos[0];

          return (
            <Box
              key={OBJECTID}
              onClick={() => onClick(entry, 0)}
              sx={{
                boxShadow: 1,
            borderRadius: 1,
                position: "relative",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <Box
                sx={{
                  
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 3",
                  borderRadius: 1,
                  overflow: "hidden",
                  backgroundImage: `url(${mainPhoto})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: 1,
                }}
              >
                {photos.length > 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      px: 1.2,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <PhotoLibraryIcon sx={{ fontSize: 14 }} /> {photos.length}

                    {/* +{photos.length - 1} <PhotoLibraryIcon sx={{ fontSize: 14 }} /> */}
                  </Box>
                )}
              </Box>

              <Typography
                variant="body2"
                color="white"
                sx={{ mt: 1, fontWeight: 500 ,
fontSize: "0.75rem",
    // bottom: 0;
    // /* display: none; */
    // /* z-index: 222222; */
    // background: #000000a6;
    // padding: 6px;
     borderRadius: 1,
     borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    bottom: 0,
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "6px",
    // textAlign: "center",

                }}
              >
                {STRUCTURETYPE || "Unknown Structure Type"}:
               {" "} {DAMAGE || "No Damage"}
              </Typography>
            </Box>
          );
        })}

        {showExpandTile && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
              textAlign: "center",
              height: "100%",
              minHeight: 160,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              +{hiddenCount}     damaged structures
              {/* <PhotoLibraryIcon sx={{ fontSize: 16, verticalAlign: "middle" }} /> */}
            </Typography>
            <Button size="small" variant="outlined" onClick={() => setExpanded(true)}>
              View All
            </Button>
          </Box>
        )}
      </Box>

      {expanded && visibleCount < totalCount && (
        <Box display="flex" justifyContent="center">
          <Button variant="outlined" onClick={() => setExpanded(false)}>
            View Less
          </Button>
        </Box>
      )}
    </>
  );
}

export default PhotoGroups;
