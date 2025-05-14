'use client';
import { useState } from 'react';
import { Box,Button, Tabs, Tab, Typography, Paper } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
// import AdminToggle from '@/components/AdminToggle';


const AdminToggle = () => {
    const { toggleAdminMode, isAdminDevMode } = useAuth();
  
    return (
      <Button 
        variant="outlined" 
        size="small" 
        onClick={toggleAdminMode}
        sx={{ ml: 2 }}
      >
        {isAdminDevMode ? 'Disable Admin Mode' : 'Enable Admin Mode'}
      </Button>
    );
  };

const DashboardPage = () => {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState(0);

  const handleChange = (_, newValue) => setTab(newValue);

  const userTabs = [
    { label: 'Activity Feed', content: <ActivityFeed /> },
    { label: 'Saved Locations', content: <SavedLocations /> },
    { label: 'Account Settings', content: <AccountSettings /> },
  ];

  const adminTabs = [
    { label: 'User Management', content: <UserManagement /> },
    { label: 'Event Editor', content: <EventEditor /> },
  ];

  const allTabs = isAdmin ? [...userTabs, ...adminTabs] : userTabs;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Paper elevation={3} sx={{ width: 240, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Dashboard
        </Typography>
        <Tabs
          orientation="vertical"
          value={tab}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          {allTabs.map((t, index) => (
            <Tab key={index} label={t.label} />
          ))}
        </Tabs>
        <Box mt={2}>
          <AdminToggle />
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {allTabs[tab]?.content || (
          <Typography variant="body1">Select a tab.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;

// ---------------------
// Inline Tab Components
// ---------------------

const ActivityFeed = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Activity Feed</Typography>
    <Typography>Here you’ll see recent activity, updates, and saved locations.</Typography>
  </Box>
);

const SavedLocations = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Saved Locations</Typography>
    <Typography>These are your saved map points and recovery spots.</Typography>
  </Box>
);

const AccountSettings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Account Settings</Typography>
    <Typography>Update your name, email, and preferences here.</Typography>
  </Box>
);

const UserManagement = () => (
  <Box>
    <Typography variant="h5" gutterBottom>User Management (Admin)</Typography>
    <Typography>View/search users and manage access or roles.</Typography>
  </Box>
);

const EventEditor = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Event Editor (Admin)</Typography>
    <Typography>Create and edit map events or recovery dates.</Typography>
  </Box>
);
