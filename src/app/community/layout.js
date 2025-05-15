"use client";
import { useState } from 'react';
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


function MobileLayout({ children, tabIndex }) {
    return (
        <Box display="flex" flexDirection="column" sx={{
            height: '100%',
        }}>
            {/* Sidebar */}
            <Box
                width='100%'
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '0',
                    // px: 2,
                    // pr: 0,
                    // py: 3, 
                }}
            >
                <Tabs

                    orientation="horizontal"
                    variant="scrollable"
                    value={tabIndex}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        '& .MuiTabs-flexContainer':{
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            
                        },
                        // mb: 2,
                        width: '100%',
                        overflowX: 'auto',
                        '& .MuiTabs-scroller': {
                            overflowX: 'auto',
                        },
                    }}
                >
                    <StyledTabMobile label="Discussion" component={Link} href="/community/board" />
                    <StyledTabMobile label="Calendar" component={Link} href="/community/events" />
                    <StyledTabMobile label="Directory" component={Link} href="/community/directory" />
                </Tabs>
            </Box>
            {/* Main Content */}
            <Box
                display="flex"
                flexDirection="column"
                flex={1}
                sx={{
                    width: '100%',
                    overflowY: 'auto',
                }}
            >
                <Box flex={1} p={1} sx={{
                    width: '100%',
                }}

                    px={1} py={1} maxWidth="md" mx="auto"
                >
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    );
}
const StyledTabMobile = styled(Tab)`
    &.Mui-selected {
        background-color: rgba(0, 0, 0, 0.08);
    }
    &.MuiButtonBase-root {
        // align-items: flex-start;
        // border-radius: 8px;
        // margin-bottom: 4px;
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