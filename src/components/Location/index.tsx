// /components/LocationModal.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CssBaseline, Container ,Box} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Details from '../details';
export default function LocationModal({ pageData,onClose }) {
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
         
      {/* <Box textAlign="center" mb={6}> */}
       
      <Details pageData = {pageData} onClose={onClose} />
       
      {/* </Box> */} 
    </div>
  );
}
