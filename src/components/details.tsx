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
import getData from "./map/data.js";
import { settings as allSettings } from "@/data/builtIn";
import React, { useEffect, useState } from "react";



import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FlagIcon from "@mui/icons-material/Flag";
import ShareIcon from "@mui/icons-material/Share";
import AddressDisplay from "./Address"
import LocationLayout from "./SidebarLayout";

const settings = allSettings;

const placeholder = `This location serves as a point of interest, offering a space for updates, contributions, and activity...`;

function LocationDisplay({ pageData, onClose }) {
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
          flexDirection: "row-reverse",
          mb: 2,
        }}
        px={1}
      >
        <Typography
          color="text.primary"
          gutterBottom
          fontSize=".9em"
          fontWeight={600}
          textAlign="right"
          sx={{ opacity: 0.7 }}
        >
          12345 Main St
          <br />
          Los Angeles CA, 90001
        </Typography>

        <Stack
          sx={{ flexGrow: 1 }}
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar src="/avatar-placeholder.png" sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Posted {data.date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By{' '}
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
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

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
      title={data.title}
      images={images}
      body={bodyContent}
      onClose={onClose}
    />
  );
}


export default function Details({ pageData, onClose }) {
  const { slug, type } = pageData;
  if (type == "apn") {
    return <AddressDisplay {...{ pageData, onClose }} />;
  }
  return <LocationDisplay {...{ pageData, onClose }} />;
}
