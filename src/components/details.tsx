"use client";

import React from "react";
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
   Menu, MenuItem 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ImageCarousel from "./ImageCarousel";
import Comments from "./Comments";
import getData from "./map/data.js";
import { settings as allSettings } from "@/data/builtIn";

const settings = allSettings;

const placeholder = `This location serves as a point of interest, offering a space for updates, contributions, and activity...`;

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
        <MenuIcon 
        sx={{ fontSize: 26 ,color: theme.palette.text.primary}}
        />
      </Button>

      <Menu
        id="location-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{
          dense: true
        }}
      >
        <MenuItem onClick={() => { handleClose(); alert("Subscribed!"); }}>
          <NotificationsActiveIcon fontSize="small" sx={{ mr: 1 }} />
          Subscribe to updates
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); alert("Reported."); }}>
          <FlagIcon fontSize="small" sx={{ mr: 1 }} />
          Report this post
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); alert("Share feature coming soon."); }}>
          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
          Share this post
        </MenuItem>
      </Menu>
    </Box>
  );
}



export default function Details({ slug, onClose }) {
  const allData = getData();
  const data = allData.find((item) => item.id == slug);
  if (!data) return null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const images = [data.image, data.image];

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", height: "100%", overflow: "auto" }}>
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
              zIndex: settings.zIndex.locationModal,
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
        sx={{ fontSize: 26 ,color: theme.palette.text.primary}}
                
                 />
              </Button>
            </Tooltip>
            <Typography color="text.primary" variant="h6" fontWeight={400}>
              {data.title}
            </Typography>
            <LocationMenu/>
          </Box>

          {/* Image Carousel */}
          <Box sx={{ mt: 0, mb: 0 }}>
            <ImageCarousel images={images} height={250} />
          </Box>

          {/* Title & Metadata */}
          <Box sx={{ 
            display: "flex",
            flexDirection: "row-reverse",

            mb: 2 }}
            px={1}
            >
            <Typography color="text.primary"   gutterBottom
             fontSize=".9em"
             fontWeight={600}  
             textAlign="right"
             sx={{
              opacity: 0.7,
             }}
            > 12345 Main St
             <br/>Los Angeles CA, 90001
            </Typography>
             
             <Stack sx={{flexGrow: 1}}
             direction="row" spacing={2} alignItems="center">
              <Avatar src="/avatar-placeholder.png" sx={{ width: 32, height: 32 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Posted {data.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By{" "}
                  <span className="link" style={{ 
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: 500,
                    color: theme.palette.secondary.main 
                  }}
                  href="#user" target="_blank" rel="noopener noreferrer">
                    Michael Romero
                  </span>
                </Typography>
                {/* <Chip
                  label="Volunteer"
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 1 }}
                /> */}
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Body */}
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              color: theme.palette.text.primary,
            }}
          >
            {data.body}
            {placeholder}
            <br />
            <br />

            {placeholder}
            <br />
            <br />
            {data.body}
          </Typography>

          {/* Comments */}
          <Box sx={{ mt: 4 }}>
            <Comments />
          </Box>
        </Box>
      </SimpleBar>
    </Box>
  );
}
