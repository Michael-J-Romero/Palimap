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
  Link as MuiLink ,
  IconButton, 
} from "@mui/material";

import NextLink from 'next/link';

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
import LocationDisplay from "./LocationDisplay";
// import Link from "next/link";

const settings = allSettings;

const placeholder = `This location serves as a point of interest, offering a space for updates, contributions, and activity...`;




export default function Details({ pageData, onClose }) {
  const { slug, type } = pageData;
  if (type == "apn") {
    return <AddressDisplay {...{ pageData, onClose }} />;
  }
  return <LocationDisplay {...{ pageData, onClose }} />;
}
