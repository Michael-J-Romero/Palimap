import { Box, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function LocationSlider({ images ,height}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        // height: { xs: 240, sm: 360, md: 420 },
        height: { xs: height/3, sm: height/2, md: height },
        borderRadius: 2,
        //no top border radius
        // borderTopLeftRadius: 0,
        // borderTopRightRadius: 0,
        mt: 3,
        overflow: 'hidden',
        boxShadow: 4,
        mb: 3,
      }}
    >
      <Swiper
        // add a caption using the prop: caption
        // caption="Hello"
        
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        effect="slide"// or "slide" or "cube" or "coverflow" or "flip"
        style={{ width: '100%', height: '100%' }}
      >
        {(images || []).map((img, index) => (
          <SwiperSlide key={index}>
            <Box
              component="div"
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${img})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom nav arrows styling */}
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: ${isDark ? '#fff' : '#000'};
          top: 50%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
          backdrop-filter: blur(4px);
        }

        .swiper-pagination-bullet {
          background: ${isDark ? '#aaa' : '#444'};
          opacity: 0.7;
        }

        .swiper-pagination-bullet-active {
          background: ${theme.palette.primary.main};
        }
      `}</style>
    </Box>
  );
}
