import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
const darkBg = '#282936'


const FooterContainer = styled(Box)`
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

const Footer = () => {
  return (
    <FooterContainer
    style={{
                backgroundColor: darkBg,
                color: '#ffffff',
                padding: '4px 16px',
                borderTop: '1px solid #444',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '250px',
              // marginTop: '24px',
    
              }}
    >
      <img src="/foot.png" alt="Logo" style={{ width: '100%', height: 'auto'}} />
      {/* <Typography variant="body2">© {new Date().getFullYear()} Palisades Recovery. All rights reserved.</Typography> */}
    </FooterContainer>
  );
};

export default Footer;











// import React from 'react';
// import { Box, Typography, Link, Stack, Divider } from '@mui/material';
// import styled from 'styled-components';

// const FooterContainer = styled(Box)`
//   text-align: center;
//   padding: 2rem 1rem;
//   margin-top: auto;
//   background-color: ${({ theme }) => theme.palette.background.paper};
//   color: ${({ theme }) => theme.palette.text.secondary};
//   border-top: 1px solid ${({ theme }) => theme.palette.divider};
// `;

// const Footer = () => {
//   return (
//     <FooterContainer>
//       <Typography variant="body2" fontWeight={500} gutterBottom>
//         Palisades Recovery
//       </Typography>

//       <Stack
//         direction="row"
//         spacing={2}
//         justifyContent="center"
//         alignItems="center"
//         flexWrap="wrap"
//         sx={{ mb: 1 }}
//       >
//         <Link href="/map" underline="hover" color="inherit">Map</Link>
//         <Link href="/community" underline="hover" color="inherit">Community</Link>
//         <Link href="/resources" underline="hover" color="inherit">Resources</Link>
//         <Link href="/contact" underline="hover" color="inherit">Contact</Link>
//         <Link href="https://github.com/yourproject" target="_blank" rel="noopener" underline="hover" color="inherit">
//           GitHub
//         </Link>
//       </Stack>

//       <Typography variant="body2" sx={{ mt: 1 }}>
//         Supporting fire-impacted communities with shared updates, local knowledge, and recovery tools.
//       </Typography>

//       <Divider sx={{ my: 2, maxWidth: 320, mx: 'auto' }} />

//       <Typography variant="caption" color="text.secondary">
//         © {new Date().getFullYear()} Palisades Recovery. All rights reserved.
//       </Typography>
//     </FooterContainer>
//   );
// };

// export default Footer;
