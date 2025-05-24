"use client";

import {
  Chip,
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  Avatar, 
  Stack, 
  useMediaQuery, 
  Tooltip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid, 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ImageCarousel from "./ImageCarousel";
import Comments from "./Comments";
import { settings as allSettings } from "@/data/builtIn";
import React , { useState } from "react";



import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FlagIcon from "@mui/icons-material/Flag";
import ShareIcon from "@mui/icons-material/Share";

function LocationMenu() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ ml: "auto" }}>
      <Button
        onClick={handleClick}
        size="small"
        variant="text"
        sx={{ minWidth: 0, p: 0.5 }}
        aria-controls={open ? "location-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MenuIcon sx={{ fontSize: 26, color: theme.palette.text.primary }} />
      </Button>

      <Menu
        id="location-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{
          dense: true,
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            alert("Subscribed!");
          }}
        >
          <NotificationsActiveIcon fontSize="small" sx={{ mr: 1 }} />
          Subscribe to updates
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            alert("Reported.");
          }}
        >
          <FlagIcon fontSize="small" sx={{ mr: 1 }} />
          Report this post
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            alert("Share feature coming soon.");
          }}
        >
          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
          Share this post
        </MenuItem>
      </Menu>
    </Box>
  );
}

// import { useState } from "react"; 
// import LocationMenu from "./LocationMenu";

import Link from "next/link";
 

 



  function LocationLayout({ locationId,mini,smallTitle, title, images, body, posts, height = 500 ,onClose}) {
  const theme = useTheme();

  if (mini) {
    return ( 
        <Link href={`/map?location=${locationId}`} 
        passHref legacyBehavior>
      <Box
        component="a"
        sx={{
          display: 'block',
          textDecoration: 'none', // prevents underlined text
          width: "100%",
          maxWidth: 600,
          mx: "auto",
         
          color: theme.palette.text.primary,
          cursor: 'pointer',
          mb: 5,
          overflow: 'hidden',
          transition: 'transform 0.2s ease',

        }}
      >
        <Box
          sx={{
            
            height,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{
              // px: 2,
              pb: 8, // space for Read More button
            }}
          >
            {/* Top Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                // backgroundColor: theme.palette.background.default,
              }}
            >
              <Typography color="text.primary" variant="h6" fontWeight={400}>
                {title}
              </Typography>
            </Box>
<Box sx={{
   borderRadius: 1,
          bgcolor: theme.palette.background.default,
          border: `1px solid ${theme.palette.text.primary}44`,
          background: theme.palette.background.default,
          boxShadow: theme.shadows[1],
          // overflow: 'hidden',
          '&:hover': {
            // backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.text.primary}55`,
            // transform: 'scale(1.01)',
            boxShadow: theme.shadows[4],
          },
          
}} >
            {images?.length > 0 && (
              <Box sx={{ mt: 0, mb: 0 }}>
                <ImageCarousel images={images} height={225} flatBottom />
              </Box>
            )}

            <Box >{posts}</Box>
            <Box sx={{ px: 2 }}>{body}</Box>

            {/* <Box sx={{ mt: 4 }} /> */}
          {/* Fade-out gradient */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 50,
              // left: 0,
              // right: 0,
              width: '100%',
              height: 80,
              background: `linear-gradient(to bottom, transparent, ${theme.palette.background.default})`,
              pointerEvents: 'none',
              padding: '4px',
              // overflow: 'hidden',
            }}
          />

          {/* Read More Button */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: theme.palette.background.default,
              pt: 1.5,
              textAlign: 'center',
            }}
          >
            <Button  color="secondary" 
            variant="outlined" size="large" fullWidth sx={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}>
              Read More
            </Button>
          </Box>
            </Box>
          </Box>

        </Box>
      </Box>
    </Link>
   );
  }

  // Full version (unchanged except no address requested)
  return (
    <Box
      sx={{
       
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        height: "100%",
        overflow: "auto",
      }}
    >
      <SimpleBar style={{ height: "100%" }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Top Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // gap: 1,
              position: "sticky",
              zIndex: 10,
              top: 0,
              backgroundColor: theme.palette.background.default,
              p: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tooltip title="Back to map">
              <Button
                onClick={onClose}
                size="small"
                variant="text"
                sx={{ minWidth: 0, p: 0.5 }}
              >
                <ArrowBackIcon
                  sx={{ fontSize: 26, color: theme.palette.text.primary }}
                />
              </Button>
            </Tooltip>
              {smallTitle?
          <Typography color="text.primary" variant="body2" fontWeight={400} fontSize={"1rem"}>
            {title}
          </Typography>
              :
            <Typography color="text.primary" variant="h6" fontWeight={400}>
              {title}
            </Typography>
            }
            <LocationMenu />
          </Box>
<Box           sx={{ px: 2, pt: 0, pb: 0 }} >
          {/* Image Carousel */}
          {images && images.length > 0 &&
          <Box sx={{ mt: 0, mb: 0 }}>
            <ImageCarousel images={images} height={280} />
          </Box>}

          {/* Body Content */}
          <Box sx={{ mt: 0}}>{body}</Box>
          <Box sx={{ mt: 0 }}>{posts}</Box>

          {/* Comments */}
          <Box sx={{ mt: 4 }}>
           {images && images.length > 0 &&
            <Comments />
              }
          </Box></Box>
        </Box>
      </SimpleBar>
    </Box>
  );
}



export default LocationLayout;