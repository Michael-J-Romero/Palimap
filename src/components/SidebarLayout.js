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



function TopbarTabs({ selectedTab, setSelectedTab, onAddPost }) {
  const theme = useTheme();

  const tabs = [
    { label: "Info", value: "info" },
    { label: "Posts", value: "posts" },
    // { label: "Gallery", value: "poests" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        // borderBottom: `1px solid ${theme.palette.divider}`,
        pr: 2,
        // py: 1.5,
        backgroundColor: theme.palette.background.default,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Tabs */}
      <Box sx={{ display: "flex", gap: theme.spacing(1) }}>
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            size="small"
            variant="text"
            onClick={() => setSelectedTab(tab.value)}
            sx={{
              px: 4,
              borderRadius: 0,
              backgroundColor:selectedTab === tab.value
                ? theme.palette.background.paper
                : "transparent",
              borderBottom: selectedTab === tab.value
                ? `1px solid ${theme.palette.primary.main}`
                : "1px solid transparent",
              paddingBottom: theme.spacing(0.5),
              minWidth: "auto",
            }}
          >
            <Typography
              variant="body2"
              color={
                selectedTab === tab.value
                  ? theme.palette.primary.main
                  : theme.palette.text.primary
              }
              sx={{ fontWeight: selectedTab === tab.value ? 600 : 400 }}
            >
              {tab.label}
            </Typography>
          </Button>
        ))}
      </Box>

      {/* Add Post Button */}
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={onAddPost}
        sx={{ 
          my: 1,
          borderRadius: theme.shape.borderRadius, px: 2, py: 0.5 }}
      >
        <Typography variant="body2" fontWeight={500}>
          + Add Post
        </Typography>
      </Button>
    </Box>
  );
}





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
function Buttons() {
  //a bar w 3 buttons: posts, info and +add post
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
      <Button
        size="small"
        variant="text"
        sx={{ minWidth: 0, p: 0.5 }}
        onClick={() => alert("Posts coming soon!")}
      >
        <Typography variant="body2" color={theme.palette.text.primary}>
          Posts
        </Typography>
      </Button>
      <Button
        size="small"
        variant="text"
        sx={{ minWidth: 0, p: 0.5 }}
        onClick={() => alert("Info coming soon!")}
      >
        <Typography variant="body2" color={theme.palette.text.primary}>
          Info
        </Typography>
      </Button>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ minWidth: 0, p: 0.5, ml: 1 }}
        onClick={() => alert("Add post feature coming soon!")}
      >
        <Typography variant="body2">+ Add Post</Typography>
      </Button>
    </Box>
  );
}
// import { useState } from "react"; 
// import LocationMenu from "./LocationMenu";

import Link from "next/link";
 

 



  function LocationLayout({noPadding, openLocation,locationId,mini,smallTitle,subTitle, title, images, body, posts, height = 500 ,onClose}) {
  const theme = useTheme();
            const [selectedTab, setSelectedTab] = useState("posts");

  if (mini) {
    return (  
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
          overflow: 'hidden',
          transition: 'transform 0.2s ease',
        }}      >
            {/* Top Bar */}
            <Paper
            elevation={0}
              sx={{
                // display: "flex",
                // alignItems: "center",
                // gap: .5,
                // py: 2,
                // borderBottom: `1px solid ${theme.palette.divider}`,
                // backgroundColor: theme.palette.background.default,
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
  
                // gap: .5,
              }}
            >
              <Typography color="text.primary" variant="h6" fontWeight={400} sx={{
              }}>
                {title}
              </Typography>
                {subTitle && 
              <Typography color="text.secondary" variant="body2" fontWeight={400} sx={{}}>
                {subTitle}
              </Typography>
                
              }
            </Paper>
 
            {images?.length > 0 && (
              <Box sx={{ mt: 0, mb: 0 }}>
                <ImageCarousel images={[images[0]]} height={225} flatBottom />
              </Box>
            )}

            <Box >{posts}</Box>
            <Box sx={{  }}>{body}</Box>
            <Button
              variant="outlined"
              // color="primary"
              size="large"
              fullWidth sx={{
                  mt: 1,
                }}
              >
              {/* <Link href={`/locations/${locationId}`} style={{ textDecoration: 'none', color: theme.palette.primary.main }}> */}
                <Typography variant="body2" fontWeight={700} color={theme.palette.primary.main} >
                  View Full Post
                </Typography>
              {/* </Link> */}
              </Button>
            {/* <Comments /> */}
      </Box>
   );
  }
let isDarkMode = theme.palette.mode === "dark";
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
          <Paper
            elevation={1}
            square
            variant={isDarkMode?
            "elevation"
            :"outlined"}
            sx={{
              
              display: "flex",
              alignItems: "center",
              // gap: 1,
              position: "sticky",
              zIndex: 10,
              top: 0,
              // backgroundColor: theme.palette.background.default,
              p: 1,
              // borderBottom: `1px solid ${theme.palette.divider}`,
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
          </Paper>
            {/* <Buttons/> */}

{/* <TopbarTabs
  selectedTab={selectedTab}
  setSelectedTab={setSelectedTab}
  onAddPost={() => setShowAddPostDialog(true)}
/> */}
<Box           sx={{
              px:0,
  
   pt: 0, pb: 0 }} >
          {/* Image Carousel */}
          {images && images.length > 0 &&
          <Box sx={{ mt: 0, mb: 0 }}>
            <ImageCarousel allFlat images={images} height={280} />
          </Box>}

          {/* Body Content */}
          <Box sx={{ 
            px:  noPadding ? 0 : 2,
            mt: 0}}>{body}</Box>
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