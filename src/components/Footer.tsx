import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

const FooterContainer = styled(Box)`
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.secondary};
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Typography variant="body2">© {new Date().getFullYear()} Palisades Recovery. All rights reserved.</Typography>
    </FooterContainer>
  );
};

export default Footer;
