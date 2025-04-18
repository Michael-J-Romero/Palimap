// /components/LocationModal.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CssBaseline, Container ,Box} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Details from '../details';
export default function LocationModal({ slug, onClose }) {
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  let theme = useTheme();

let themeBackground = theme.palette.background.paper;
  return (
    <div style={{
         // Ensure this is above other elements
    //   position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      // padding: '10px',
      background: themeBackground,
      // background: 'green',
    }}>
          <Container maxWidth="lg" 

          sx={{ 
            height: '100%',
            // py: { xs: 4, md: 6 } 
          }}
          >
      {/* <Box textAlign="center" mb={6}> */}
       
      <Details slug={slug} onClose={onClose} />
       
      {/* </Box> */}
</Container>
    </div>
  );
}
