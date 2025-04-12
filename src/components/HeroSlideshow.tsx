'use client';


import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {settings as allSettings} from '@/data/builtIn'

const settings=allSettings.HeroSlideshow
const images = settings.images;
// 'Hope After the Fire',

export default function CrossfadeBanner() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((index + 1) % images.length);
    }, settings.duration);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* New (current) image: Pans up */}
      <motion.img
      src={images[index]}
        key={`current-${index}`}
        initial={{ y: settings.startY, scale: settings.scale }}
        animate={{ y: settings.endY, scale: settings.scale*1.05 }}
        transition={{ duration: settings.duration / 1000, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      {/* Previous image: Fades out, fixed pan position */}
      {prevIndex !== null && (
        <motion.img
            src={images[prevIndex]}
          key={`previous-${prevIndex}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: settings.fadeDuration / 1000 }}
          style={{
            position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
            transform: `translateY(${settings.endY}) scale(${settings.scale * 1.05})`,
            zIndex: 2,
          }}
        />
      )}

      {/* Text readability gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: settings.overlayGradient,
          zIndex: 3,
        }}
      />

      {/* Centered Text */}
      {/* <Box
        sx={{
          position: 'relative',
          zIndex: 4,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          px: 2,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2 }}
          >
            <Typography variant="h4" fontWeight="bold">
              {texts[index]}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box> */}
    </Box>
  );
}
