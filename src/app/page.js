"use client";
let settings = {
  recentActivityRows: 1
}
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider, useMediaQuery, Stack 
} from "@mui/material";
//import donate icon (money)
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

import { useTheme } from "@mui/material/styles";
import MapIcon from "@mui/icons-material/Map";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { types, imageArray } from "@/data/builtIn"
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HeroSlideshow from "@/components/HeroSlideshow";

 
 
 function HeroSection() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const updateButton = (isSm )
  ?  <Button 
  fullWidth
  variant="contained" size="large" startIcon={<AddCircleOutlineIcon />} sx={{ mt: 2 }}>
    Post an Update
  </Button>
  :(
    <Button
      variant="outlined"
      size="large"
      startIcon={<AddCircleOutlineIcon />}
      sx={{
        color: 'white',
        borderColor: 'white',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'white',
        },
        '& .MuiSvgIcon-root': {
          fill: 'white',
        },
      }}
    >
      Post an Update
    </Button>
  );
  const router = useRouter();
  const mapButton = (
    <Button fullWidth={isSm}
    onClick={() => router.push('/map', undefined, { shallow: true })}
    variant="contained" size="large" startIcon={<MapIcon />}>
      View the Map
    </Button>
  );

  const subtitle = (
    <Typography
      variant={isSm ? 'body2' : isMd ? 'body1' : 'h6'}
      color="white"
      maxWidth="md"
      mx="auto"
      bgcolor="#00000030"
      borderRadius={2}
      px={2}
      py={1}
      fontWeight="light"
    >
      {isSm
        ? 'Your hub for fire recovery — see updates and support.'
        : 'Your interactive hub for fire recovery — see updates, share progress, and support your community.'}
    </Typography>
  );

  const title =  (
    <Typography
      variant={isMd ? 'h4' : 'h3'}
      fontWeight="bold"
      gutterBottom
      color="white"
    >
      Rebuilding Together
    </Typography>
  );

  const innerContent = (
    <Box sx={{ position: 'relative', zIndex: 2, p: isSm ? 2 : 4 }}>
      {title}
      {subtitle}
      {!isSm && !isMd && (
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {mapButton}
          {updateButton}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box
        textAlign="center"
        mb={isSm ? 2 : 6}
        sx={{
          // height: isSm ? 200 : 300,
          maxHeight: '50vh',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 2,
        }}
      >
        {/* Background Slideshow */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        >
          <HeroSlideshow />
        </Box>

        {/* Overlay Content */}
        {innerContent}
      </Box>

      {/* Buttons below hero on small screens */}
      {(isSm || isMd) && (
        <Stack spacing={2} 
        direction={isSm ? 'column' : 'row'}
        justifyContent="center"
         alignItems="center">
          {mapButton}
          {updateButton}
        </Stack>
      )}
    </>
  );
}


const imgs = [
  './heroImages/1.webp ',
  './heroImages/2.webp ',
  './heroImages/3.jfif ',
  './heroImages/4.png ',
  './heroImages/5.png ',
  './heroImages/6.jpg ',
  './heroImages/7.png ',
  'https://oregonbusiness.com/wp-content/uploads/2024/10/Lomakatsi-Restoration-Project-2996x1786-1.jpg',
]
const HomepageBody = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="lg" sx={{
      pt: { xs: 2, md: 4 },
      pb: { xs: 2, md: 4 },

    }}>
      {/* Hero Section */}
      <HeroSection
        {...{
          theme,
        }}
      />

      {/* How it works */}

      <Grid container spacing={4} mb={6}>
        {[
          {
            icon: <MapOutlinedIcon fontSize="large" />,
            title: 'Explore the Map',
            desc: 'Track real-time updates from your community — from rebuilding to reopening.',
          },
          {
            icon: <EditLocationAltIcon fontSize="large" />,
            title: 'Share Local Updates',
            desc: 'Post recovery efforts, events, or important info with a simple form.',
          },
          {
            icon: <WifiTetheringIcon fontSize="large" />,
            title: 'Stay Connected',
            desc: 'Follow nearby activity and get involved where it matters most.',
          },
        ].map((step, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  mb: 2,
                  // bgcolor: (theme) => theme.palette.primary.light,
                  // borderRadius: '50%',
                  // width: 64,
                  // height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.icon}
                <Typography variant="h6" fontWeight={600} gutterLeft
                  sx={{ ml: .5, }}>
                  {step.title}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {step.desc}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>




      {/* Live Stats Placeholder */}
      <Box mb={2} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          This Week’s Highlights
        </Typography>
        <Typography variant="body2" color="text.secondary" ml={2}>
          14 new posts • 3 new business reopenings • 1 safety alert
        </Typography>
        <Divider />
      </Box>

      {/* Recent Activity Feed (placeholder) */}
      <Grid container spacing={4} mb={6}>
        {imageArray.slice( 7,10 * settings.recentActivityRows).map((img, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card>
              <CardMedia
                image={img}
                component="div"
                sx={{ height: 160, backgroundColor: theme.palette.grey[300] }}
              >
                {/* Placeholder image */}
              </CardMedia>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  Sample Post Title #{i + 1}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fire Recovery • 2 days ago
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                >
                  Placeholder description text for the post. This should summarize what’s happening and why it matters.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* show categories as chips */}
      <Box mb={6} textAlign="center">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          What are you looking for? 
        </Typography>
        <Divider />
        <Box mt={2}>

          {types.map((type, i) => (
            <Box key={i} display="inline-block" mr={1} mb={1}>
              <Button variant="outlined" size="small" startIcon={type.icon} sx={{ borderRadius: 20 }}>
                {type.type}  ({type.count})
              </Button>
            </Box>
          ))}
        </Box>
      </Box>


      {/* Closing Call to Action */}
      <Box textAlign="center">
        <Typography variant="h6" gutterBottom>
          This map is powered by the community and needs your help!
        </Typography>
        <Button variant="contained" size="large" startIcon={<TrendingUpIcon />}
          sx={{ mt: 2 }}>
          Contribute an Update
        </Button>
        {/* donate */}
        <Button variant="outlined" size="large" startIcon={<AttachMoneyIcon />} color="success"
          sx={{ mt: 2, ml: 2 }}>
          Donate
        </Button>
      </Box>
    </Container>
  );
};
function HeroSectione({
  theme
}) {
  let updateButton = (!isSm )
  ?  <Button variant="contained" size="large" startIcon={<AddCircleOutlineIcon />} sx={{ mt: 2 }}>
    Post an Update
  </Button>
  :<Button
    variant="outlined"
    size="large"
    startIcon={<AddCircleOutlineIcon />}
    sx={{
      color: 'white',
      borderColor: 'white',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'white',
      },
      '& .MuiSvgIcon-root': {
        fill: 'white',
      },
    }}
  >
    Post an Update
  </Button>
  let mapButton = <Button variant="contained" size="large" startIcon={<MapIcon />}>
    View the Map
  </Button>
  let subtitle = <Typography variant="h6" color="white" maxWidth="md" mx="auto" bgcolor="#00000030" borderRadius={10} p={.05}
    fontWeight="light"
  >
    Your interactive hub for fire recovery — see updates, share progress,
    and support your community.
  </Typography>
  let title = <Typography variant="h3" fontWeight="bold" gutterBottom color="white">
    Rebuilding Together
  </Typography>


  return (
    <Box textAlign="center" mb={6}
      borderRadius={1}
      shadow={2}
      sx={{
        overflow: "hidden",
        boxShadow: 2,
        padding: 4,
        color: theme.palette.text.primary,
        borderRadius: 1,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}>
        <HeroSlideshow />
      </Box>
      <Box
        sx={{ position: "relative", zIndex: 2 }}>
        {title}
        {subtitle}
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {mapButton}
          {updateButton}
        </Box>
      </Box>
    </Box>
  );
}
export default HomepageBody;