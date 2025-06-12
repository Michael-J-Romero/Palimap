"use client";
import dayjs from 'dayjs';
import Footer from '@/components/Footer';
import {
    Box, Tabs,
    Tab,useMediaQuery,
} from '@mui/material';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function CommunityPage({ children }) {
    const [tab, setTab] = useState(0);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const pathname = usePathname();
    const tabIndex = ['/community/board', '/community/events', '/community/directory'].indexOf(pathname);
    const isMobileLayout = useMediaQuery((theme) => theme.breakpoints.down('md'));
     
    if(isMobileLayout){
        return (
            <MobileLayout tabIndex={tabIndex} >
                {children}
            </MobileLayout>
        );
    }
    else{
        return (
            <DesktopLayout tabIndex={tabIndex} >
                {children}
            </DesktopLayout>
        );
    }
}

 function useElementHeight() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect) {
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, height];
}

function useElementHeightById(id) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect) {
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(el);

    // Initialize immediately in case ResizeObserver doesn't fire
    setHeight(el.offsetHeight);

    return () => observer.disconnect();
  }, [id]);

  return height;
}


import { useState, useRef, useEffect } from 'react';
// import useElementHeight from '@/hooks/useElementHeight';
// import clsx from 'clsx';

function MobileLayout({ children, tabIndex }) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef(null);

  const primaryHeight = useElementHeightById('primary-header');
//   const [primaryHeaderRef, primaryHeight] = useElementHeight();
  const [tabsRef, tabsHeight] = useElementHeight();

  // Scroll behavior
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      if (currentScrollY > lastScrollY.current + 10) {
        setShowHeader(false); // down
      } else if (currentScrollY < lastScrollY.current - 10) {
        setShowHeader(true); // up
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
     

      {/* Fixed Tab Bar */}
      <Box
        ref={tabsRef} 
        // className={clsx('mobile-tab-bar', { hidden: !showHeader })}
        className={`mobile-tab-bar ${showHeader ? '' : 'hidden'}`}
        sx={{
        boxShadow: 2,
          position: 'fixed',
          top: `${primaryHeight}px`,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: 'background.paper',
          transition: 'transform 0.3s ease',
        }}
      >
        <Tabs
          orientation="horizontal"
          variant="scrollable"
          value={tabIndex}
          textColor="primary"
          indicatorColor="primary"
          color="primary"
          compact
          sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: 'space-around',
              alignItems: 'center',
            },
            width: '100%',
            overflowX: 'auto',
          }}
        >
          <StyledTabMobile label="Discussion" component={Link} href="/community/board" />
          <StyledTabMobile label="Calendar" component={Link} href="/community/events" />
          <StyledTabMobile label="Directory" component={Link} href="/community/directory" />
        </Tabs>
      </Box>

      {/* Scrollable Content */}
      <Box
        ref={scrollContainerRef}
        display="flex"
        flexDirection="column"
        flex={1}
        sx={{
          width: '100%',
          overflowY: 'auto',
          paddingTop: `${ tabsHeight}px`,
        }}
      >
        <Box flex={1} px={1} py={1} maxWidth="md" mx="auto">
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}


const StyledTabMobile = styled(Tab)`
  text-transform: none !important;

    &.Mui-selected {
        background-color: rgba(0, 0, 0, 0.08);
    } 
    &.MuiButtonBase-root:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }
    &.MuiButtonBase-root:focus {
        background-color: rgba(0, 0, 0, 0.08);
        outline: none;
    }
    &.MuiButtonBase-root:focus-visible {
        background-color: rgba(0, 0, 0, 0.08);
        outline: none;
    }

`


function DesktopLayout({ children, tabIndex }) {
 
    return (
        <Box display="flex" flexDirection=  'row'  sx={{
            height: '100%',
        }}>
            {/* Sidebar */}
            <Box
                width= {280}
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '0',
                    px: 2,
                    pr: 0,
                    py: 3,
                    width: 'max-content',
                }}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabIndex}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        mb: 2,
                        width: 'max-content',
                    }}
                >
                    <StyledTabDesktop label="Discussion Board" component={Link} href="/community/board" />
                    <StyledTabDesktop label="Calendar" component={Link} href="/community/events" />
                    <StyledTabDesktop label="Directory" component={Link} href="/community/directory" />
                </Tabs>

            </Box>
            {/* Main Content */}
            <Box
                display="flex"
                flexDirection="column"
                flex={1}
                sx={{
                    height: '100%',
                    overflowY: 'auto',
                }}
            >
                <Box flex={1} p={3} sx={{
                    width: '100%',
                }}
                    px={2} py={3} maxWidth="md" mx="auto"
                >
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    );
}

const StyledTabDesktop = styled(Tab)`
  text-transform: none !important;
    &.Mui-selected {
        background-color: rgba(0, 0, 0, 0.08);
    }
    &.MuiButtonBase-root {
    align-items: flex-end;
        border-radius: 8px;
        margin-bottom: 4px;
        padding: 8px 16px;
        width: 100%;
        text-align: right;
    }
`