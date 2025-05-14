"use client";
import { useState } from 'react';
import dayjs from 'dayjs';
import Footer from '@/components/Footer';
import {
    Box, Tabs,
    Tab
} from '@mui/material';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function CommunityPage({ children }) {
    const [tab, setTab] = useState(0);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const pathname = usePathname();
    const tabIndex = ['/community/board', '/community/events', '/community/directory'].indexOf(pathname);
    return (
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} sx={{
            height: '100%',
        }}>
            {/* Sidebar */}
            <Box
                width={{
                    xs: '100%',
                    md: 280,
                    height: '100%',
                }}
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
                    <StyledTab label="Community Board" component={Link} href="/community/board" />
                    <StyledTab label="Calendar" component={Link} href="/community/events" />
                    <StyledTab label="Directory" component={Link} href="/community/directory" />
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
const StyledTab = styled(Tab)`
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