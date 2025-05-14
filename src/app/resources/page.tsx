"use client";
import React, { useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
  TextField,
  Container,
  Grid,
  Link,
  Box,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,Button,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import MentalHealthIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import ResourceSearch from '@/components/ResourceSearch';
import PowerIcon from '@mui/icons-material/Power';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import PetsIcon from '@mui/icons-material/Pets';
import resources from '@/data/resources.json';
const categoryIcons = {
  'Fire Recovery Assistance': <LocalFireDepartmentIcon color="error" sx={{ mr: 1 }} />,
  'Rebuilding & Permits': <EngineeringIcon color="primary" sx={{ mr: 1 }} />,
  'Mental Health Support': <MentalHealthIcon color="secondary" sx={{ mr: 1 }} />,
  'Legal & Financial Aid': <GavelIcon color="action" sx={{ mr: 1 }} />,
  'Emergency Preparedness': <WarningIcon color="warning" sx={{ mr: 1 }} />,
  'Community & Volunteer Opportunities': <VolunteerActivismIcon color="success" sx={{ mr: 1 }} />,
  'Animal & Pet Services': <PetsIcon color="info" sx={{ mr: 1 }} />,
  'Utility Relief & Restoration': <PowerIcon color="primary" sx={{ mr: 1 }} />,
  'Food & Basic Needs': <FastfoodIcon color="secondary" sx={{ mr: 1 }} />,
  'Cleanup & Environmental Safety': <CleanHandsIcon color="error" sx={{ mr: 1 }} />
};
const featuredResources = [
  'California Wildfire Recovery Portal',
  'Ready for Wildfire (CAL FIRE)',
  'CalHOPE Support Line',
  'State Bar of California – Legal Help After a Disaster',
];
const MyComponent = () => {
  const textRef = useRef(null); // Reference for the text box
  const cloneRef = useRef(null); // Reference for the phantom clone
  const [imageHeight, setImageHeight] = useState(0); // State to store the height of the image
 const [isSmallScreen, setIsSmallScreen] = useState(false); // State to track if screen is small
  // Dynamically set the height of the image based on the text height
  // Dynamically set the height of the image based on the text height
  useEffect(() => {
    // Check the window size and set the small screen state
    const updateScreenSize = () => {
      if (window.innerWidth < 600) {
        setIsSmallScreen(true); // Mark as small screen if width is less than 600px
      } else {
        setIsSmallScreen(false); // Mark as large screen
      }
    };
    const updateImageHeight = () => {
      // Check if cloneRef is valid and get the height of the phantom clone
      if (cloneRef.current) {
        const textHeight = cloneRef.current.offsetHeight; // Get the height of the clone
        setImageHeight(textHeight); // Set the image height to match the phantom clone height
      }
    };
    // Initial calculation of image height based on text clone
    updateImageHeight();
    // Set up ResizeObserver to handle container resizing
    const resizeObserver = new ResizeObserver(updateImageHeight);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }
    // Clean up observer on component unmount
    return () => resizeObserver.disconnect();
  }, []);
  return (<div style = {{position: 'relative'}}>
    {/* Main container for the image and text */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', // Ensure both items stretch to the same height
        justifyContent: 'space-between',
        width: '100%',
        flexDirection:  { xs: 'column', sm: 'row' }
      }}
    >
      {/* Image container on the left */}
      <Box
        sx={{
           width: { xs: '100%', sm: '225px' },
          // width: '280px',
          height: imageHeight, // Dynamically set the height based on the phantom clone
          backgroundImage: 'url(/resources.png)', // Replace with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          maxHeight: '190px', // Set a max height to prevent overflow
          justifyContent: 'center',
          marginBottom: { xs: 2, sm: 0 }, // Add margin at the bottom for mobile
        }}
      >
      </Box>
      {/* Text on the right */}
      <Box
        ref={textRef} // Attach the textRef here to track the size
        sx={{
          flex: 1,
          paddingLeft: { sm: 3, xs: 0 }, // Adjust padding on small screens
          display: 'flex',
          alignItems: 'center',
          marginBottom: { xs: 2, sm: 0 }, // Add margin at the bottom for mobile
        }}
      >
        <Typography variant="body1" color="text.secondary" paragraph mb={0}> 


          {'  '}This page offers a curated collection of external links to reliable tools, guides, and services to help you navigate wildfire recovery. Use the search bar or explore by category to find what you need—whether you're working through insurance claims, planning repairs, or preparing for future risks. 
          <br/>
          <div style = {{
            height:"10px",
          }}
          />
          {'  '}For local fire damage data, community updates, upcoming events, and ways to connect with nearby volunteers and residents, visit the <Link color = "secondary" href="/map" underline="always">Map</Link> and{' '}
        <Link color = "secondary" href="/community" underline="always">Community</Link> pages.
          

        </Typography>
      </Box>
    </Box>
    {/* Phantom Clone of the Text for Calculation */}
      {!isSmallScreen &&   <Box style = {{
          visibility: 'hidden', // Hide the clone from view
          position: 'absolute', // Position it outside the layout flow
          zIndex: -1, // Ensure it doesn't affect layout
      }}
      sx={{
           display: 'flex',
        alignItems: 'stretch', // Ensure both items stretch to the same height
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
      }}
      >
      <div
        style={{
          flexShrink: 0,
          backgroundImage: 'url(/resources.png)', // Same image as above
          width: '280px', // Same width as the image
        }}
      >
      </div>
        <Typography sx = {{
          flex: 1,
          paddingLeft: 3,
        }}
        ref={cloneRef} variant="body1" color="text.secondary" paragraph>
          This page offers a curated collection of reliable tools, guides, and services to help you navigate wildfire recovery, rebuilding, mental health support, and emergency preparedness. Use the search bar or explore by category to find what you need—whether you're working through insurance claims, planning repairs, or preparing for future risks. Every resource here has been reviewed for accuracy and relevance. You're not navigating this alone.
        </Typography>
      </Box>}
      </div>
  );
};
export default function ResourcesPage() {
  const theme = useTheme();
  const isMobile = true//useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div  style={{
      marginTop: '48px',
    }}>
      {/* <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Resources
      </Typography> */}
< MyComponent />

{/* <Grid container spacing={2} sx={{ mb: 4 }}>
  <Grid item xs={12} md={6}>
    <Card>
      <CardContent>
        <Typography variant="h6">🗺️ Explore Recovery Map</Typography>
        <Typography variant="body2">Find local events, damage reports, and support centers.</Typography>
        <Button href="/map" variant="contained" sx={{ mt: 1 }}>Go to Map</Button>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} md={6}>
    <Card>
      <CardContent>
        <Typography variant="h6">🤝 Join the Community</Typography>
        <Typography variant="body2">Connect with neighbors, share tips, and ask questions.</Typography>
        <Button href="/community" variant="contained" sx={{ mt: 1 }}>View Community</Button>
      </CardContent>
    </Card>
  </Grid>
</Grid> */}

    {/* <Typography mt = {2} variant="body1">
        If you’re looking for <strong>fire damage data</strong>, <strong>local updates and events</strong>, or ways to <strong>connect with nearby volunteers and residents</strong>, be sure to check out the{' '}
        <Link color = "secondary" href="/map" underline="always">Map</Link> and{' '}
        <Link color = "secondary" href="/community" underline="always">Community</Link> pages.
      </Typography> */}
      {/* <Typography variant="h6" fontWeight={500} mt={4} mb={2}>Featured Resources</Typography> */}
      {/* <Grid container spacing={2} mb={4}>
        {Object.entries(resources).flatMap(([category, data]) =>
          data.items.filter(res => featuredResources.includes(res.title)).map((res, idx) => (
            <Grid item xs={12} sm={6} key={`featured-${res.title}-${idx}`}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Link href={res.link} target="_blank" rel="noopener" underline="hover" color="primary">
                      {res.title}
                    </Link>
                    <OpenInNewIcon fontSize="small" color="action" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {res.description}
                  </Typography>
                  <Chip label="Featured" color="secondary" size="small" />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>  */}
      {/* //divider */}
        <Divider sx={{ mt: 4 ,mb:2}} />
      <ResourceSearch resources={resources} />
      {Object.entries(resources).map(([category, data]) => (
        <Accordion key={category} sx={{ mb: 2 }} defaultExpanded={!isMobile}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              {categoryIcons[category] || null}
              <Typography variant="h6" fontWeight={500}>{category}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" paragraph>{data.description}</Typography>
            <Grid container spacing={2}>
              {data.items.map((res, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Link href={res.link} target="_blank" rel="noopener" underline="hover" color="primary">
                          {res.title}
                        </Link>
                        <OpenInNewIcon fontSize="small" color="action" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {res.description}
                      </Typography>
                      {/* {featuredResources.includes(res.title) && (
                        <Chip label="Featured" color="secondary" size="small" />
                      )} */}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Typography
  variant="caption"
  color="text.secondary"
  align="center"
  sx={{ mt: 6 ,display:"block"}}
>
  ⚠️ <strong>Disclaimer:</strong>
  <br/> 
  The resources listed on this page are provided for informational purposes only. We are not affiliated with the organizations linked and cannot guarantee the accuracy, completeness, or timeliness of their content. Please use your discretion when accessing external sites or acting on the information provided.
</Typography>
    </div>
  );
}
