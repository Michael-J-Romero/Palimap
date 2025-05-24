'use client';


import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {settings as allSettings} from '@/data/builtIn'

const settings=allSettings.HeroSlideshow
 

export default function CrossfadeBanner({img,height}) {


  return (
          
    <Box className = "hero" sx={{ position: 'relative',    height: height||'80vh', width: '100%', overflow: 'hidden' }}>
        <div style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            // backgroundPosition: 'center',
            height: '100%',
            position: 'absolute',
            width: '100%',
            // top: '-10px',
            // width: '115%',
                // filter: blur(.4px);
            filter: 'blur(.4px)',
        }}/>
    </Box>
  );
}
