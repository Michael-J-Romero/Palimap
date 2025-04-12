"use client";

import React from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { motion } from "framer-motion";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ImageCarousel from "./ImageCarousel";
import Comments from "./Comments";
import getData from "./map/data.js";
import {settings as allSettings} from '@/data/builtIn'
const settings=allSettings
let placeholder = `This location serves as a point of interest, offering a space for updates, contributions, and activity. Whether for informational purposes, ongoing developments, or general engagement, this entry provides relevant details for those interested.

Changes and updates may occur over time as new information becomes available. Various efforts, contributions, or modifications may shape how this location is utilized or perceived. Those involved can provide insights, share updates, or track progress as needed.

Visitors can find relevant details here and engage with any available content. Whether it’s general information, ongoing activity, or potential interactions, this entry is designed to provide a space for viewing and contributing updates.

Further details may be added as the situation evolves. Any participation, feedback, or contributions can help shape the direction of this location’s content and purpose over time.
`

 
export default function Details({ slug, onClose }) {
  const allData = getData();
  const data = allData.find((item) => 
    item.id == slug
);
  console.log("allData", allData,slug,data);
  if (!data) return null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const radius = .3;
  const spacing = 2;

  const pp = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-1200x675.webp";
  const images = [data.image, pp, data.image, pp];

  return (
    <ScrollSync>
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row",  overflow: "hidden" ,
// backgroundColor: 'green',
 height: "100%",
      }}>
        {/* Sidebar */}
        <ScrollSyncPane>
          <Box
            component={motion.div}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            sx={{
              width: { xs: "100%", md: 440 },
              maxWidth: { xs: "100%", md: "40%" },
              // borderRight: isMobile ? "none" : `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SimpleBar style={{ height: "100%" }}>
              {/* Top bar */}
              <Box
                sx={{
                  // boxShadow: "1px 2px 4px rgba(0,0,0,0.28)",
                  pr: spacing,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  // pb: 1,
                  // pt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  position: "sticky",
                  top: 0,
                  marginLeft: -2,

                  zIndex: settings.zIndex.locationModal,
                }}
              >
                <Tooltip title="Back to map" >

                <Button onClick={onClose} size="small"
                variant="text" 
                sx={{
                  borderRadius: 0,

                }}
                >
                  <ArrowBackIcon fontSize="large" size="large" 
                  sx={{ color: theme.palette.text.primary,
                    fontSize: 30,
                   }}
                  />
                </Button>
                </Tooltip>
                <Typography variant="h6" fontWeight={600}>
                  {data.title}
                </Typography>
              </Box>

              <Box sx={{ p: spacing }}>
                

                {/* <Paper elevation={3} sx={{ p: spacing, borderRadius: radius }}>
                  <Typography variant="h6" gutterBottom>
                    Comments
                  </Typography>

                  <Stack direction="row" spacing={2} mb={2}>
                    <Avatar src="/avatar-placeholder.png" />
                    <TextField fullWidth multiline minRows={2} placeholder="Leave a comment..." />
                  </Stack>

                  <Button variant="contained" fullWidth sx={{ mb: 2 }}>
                    Post Comment
                  </Button>

                  <Divider sx={{ mb: 2 }} /> */}

                  < Comments />
                {/* </Paper> */}
              </Box>
            </SimpleBar>
          </Box>
        </ScrollSyncPane>

        {/* Main content */}
        <ScrollSyncPane>
          <Box
            component={motion.div}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            sx={{
              flex: 1,
              backgroundColor: theme.palette.background.paper,
              overflow: "hidden",
            }}
          >
            <SimpleBar style={{ height: "100%" }}>
              <Box sx={{ px: 2 }}>
                <Box sx={{    mb: 3 }}>
                  <ImageCarousel images={images} height={350} />
                </Box>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Stack direction="column" spacing={1} flexGrow={1}>
                  <Typography variant="h5" fontWeight={400} gutterBottom>
                    {data.title}
                  </Typography>
                  {/* <Box   display="inline-block" mr={1} mb={1}>
              <Button variant="outlined" size="small" startIcon={data.icon} sx={{ borderRadius: 20 }}>
                {data.type}  ({data.count})
              </Button>
            </Box> */}
                   </Stack>
                    {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Posted {data.date}:
                     </Typography> */}

                  <Stack direction="row" spacing={2} alignItems="center"  >
                    <Box>
                      <Typography textAlign="right" 
                      variant="body2" color="text.secondary" >
                        Posted {data.date}
                      </Typography>
                      <Typography fontWeight={400}>By 
                        {/* //clickable link to profile */}
                        {" "}
                        < a href="#user" target="_blank" rel="noopener noreferrer">
                        Michael Romero
                        </a>
                        </Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                        {data.date}
                      </Typography> */}
                    </Box>
                    <Avatar src="/avatar-placeholder.png" />
                  </Stack>
                </Box>
                < Divider sx={{ my: 1 }} />
                {/* <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  <Chip label={data.type} color="primary" />
                  {(data.tags || []).map((tag, i) => (
                    <Chip key={i} label={tag} variant="outlined" />
                  ))}
                  <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
                    {data.date}
                  </Typography>
                </Stack> */}

                <Typography variant="body1" paragraph sx={{ 
                  whiteSpace: 'pre-line',

                  lineHeight: 1.8 }}>
                    {data.body}
                  {placeholder}
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* < Comments />
                <Divider sx={{ my: 4 }} /> */}

<Paper elevation={3} sx={{ p: spacing, borderRadius: radius, mb: 3,  }}>
                  {/* <Typography variant="subtitle2">Posted by</Typography> */}
                  

                  <Typography variant="subtitle2" gutterBottom>
                    Address: 1234 Main St, Los Angeles, CA
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary" paragraph>
                    {data.address || "Unknown address"}
                  </Typography> */}

                    {/* MAP */}
                  <Box sx={{ height: 280, borderRadius: 2, overflow: "hidden" }}>
                    <iframe
                      title="map"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${data.coords.lat},${data.coords.lng}&hl=es;z=14&output=embed`}
                    />
                  </Box>
                </Paper>

                <Typography variant="body2" color="text.secondary">
                  Latitude: {data.coords.lat} | Longitude: {data.coords.lng}
                </Typography>
              </Box>
            </SimpleBar>
          </Box>
        </ScrollSyncPane>
      </Box>
    </ScrollSync>
  );
}
