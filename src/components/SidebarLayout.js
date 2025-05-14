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
import React from "react";



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

function LocationLayout({ title, images, body, onClose }) {
  const theme = useTheme();

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
          sx={{ px: 2, pt: 0, pb: 0 }}
        >
          {/* Top Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              position: "sticky",
              top: 0,
              backgroundColor: theme.palette.background.paper,
              zIndex: 10,
              py: 1,
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
            <Typography color="text.primary" variant="h6" fontWeight={400}>
              {title}
            </Typography>
            <LocationMenu />
          </Box>

          {/* Image Carousel */}
          {images && images.length > 0 &&
          <Box sx={{ mt: 0, mb: 0 }}>
            <ImageCarousel images={images} height={280} />
          </Box>}

          {/* Body Content */}
          <Box sx={{ mt: 3 }}>{body}</Box>

          {/* Comments */}
          <Box sx={{ mt: 4 }}>
           {images && images.length > 0 &&
            <Comments />
              }
          </Box>
        </Box>
      </SimpleBar>
    </Box>
  );
}
export default LocationLayout;