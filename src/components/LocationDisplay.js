"use client";

import {
  Box,
  Typography,
  Divider, Avatar,
  Stack,
  useMediaQuery, Link as MuiLink
} from "@mui/material";

import NextLink from 'next/link';

import { useTheme } from "@mui/material/styles";
import "simplebar-react/dist/simplebar.min.css";
import getData from "./map/data.js";
import { settings as allSettings } from "@/data/builtIn";
import CommentIcon from "@mui/icons-material/Comment";


import LocationLayout from "./SidebarLayout";

const settings = allSettings;

const placeholder = `This location serves as a point of interest, offering a space for updates, contributions, and activity...`;



function LocationDisplay({ pageData, onClose,mini }) {
  const { slug } = pageData;
  const allData = getData();
  const data = allData.find((item) => item.id == slug);
  if (!data) return null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const images = [data.image, data.image];

  const bodyContent = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: mini?"row":"column",
          alignItems: "flex-start",
          mb: 1,
        }}
        px={0}
      >
        <Typography
          color="text.primary"
          gutterBottom
          fontSize=".9em"
          // fontWeight={600}
          textAlign="right"
          sx={{ opacity: 0.7 }}
        >
{!mini&& <MuiLink
            href={`https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`}
  component={NextLink}
            target="_blank"
            underline="hover"
            color={theme.palette.text.primary.main}
            sx={{
              ml: .5,
              textDecoration: "underline",
              cursor: "pointer",
              // fontWeight: 500,
              color: theme.palette.secondary.main,
            }}

          >
          12345 Main St, Los Angeles, CA 90001
          </MuiLink>}
          {/* //open in new tab icon */}
            {/* <Tooltip title="Open in Google Maps" arrow>
              <IconButton
                size="small"
                sx={{
                  ml: 1,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`,
                    "_blank"
                  );
                }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}


        
        </Typography>

        <Stack
          sx={{ flexGrow: 1 }}
          width="100%"
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar src="/avatar-placeholder.png" sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {data.date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
             By {' '}{mini}
              <span
                className="link"
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: 500,
                  color: theme.palette.secondary.main,
                }}
              >
                Michael Romero
              </span>
            </Typography>
          </Box>
          {<Box  sx={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            ml: "auto" ,textAlign:"right",flexGrow:1}}>
            {/* comment icon */}
            <CommentIcon fontSize="small" sx={{mr: 1,color: theme.palette.text.secondary}} />
            <Typography variant="body2" color="text.secondary">
              4
            </Typography>
            

          </Box>}
        </Stack>
      </Box>

      <Divider sx={{ my: .5 }} />

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
    </>
  );

  return (
    <LocationLayout
      locationId={data.id}
      mini={mini}
      title={data.title}
      images={images}
      body={bodyContent}
      onClose={onClose}
    />
  );
}
export default LocationDisplay;