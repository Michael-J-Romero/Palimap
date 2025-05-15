'use client';
const users1 =   [
  // Residents
  {
    id: '1',
    name: 'Emily Carter',
    role: 'Resident',
    avatar: '/avatars/resident1.png',
    shortBio: 'Local artist and community advocate.',
    fullBio: 'Emily has lived in the Palisades for 12 years and volunteers at local art events.',
    contactInfo: 'emily.carter@example.com',
    memberSince: 'March 2020',
    posts: [{ title: 'Neighborhood Art Walk' }]
  },
  {
    id: '2',
    name: 'Liam Nguyen',
    role: 'Resident',
    avatar: '/avatars/resident2.png',
    shortBio: 'Tech worker rebuilding after fire.',
    fullBio: 'Liam returned to the neighborhood after losing his home in the 2021 wildfire.',
    contactInfo: 'liam.nguyen@example.com',
    memberSince: 'July 2021',
    posts: [{ title: 'Evacuation Prep Tips' }]
  },
  {
    id: '3',
    name: 'Sofia Patel',
    role: 'Resident',
    avatar: '/avatars/resident3.png',
    shortBio: 'Mother of three, active in local PTA.',
    fullBio: 'Sofia coordinates school events and safety meetings in her neighborhood.',
    contactInfo: 'sofia.patel@example.com',
    memberSince: 'January 2019',
    posts: []
  },
  {
    id: '4',
    name: 'Noah Kim',
    role: 'Resident',
    avatar: '/avatars/resident4.png',
    shortBio: 'Musician and longtime local.',
    fullBio: 'Noah hosts music therapy workshops and plays at community events.',
    contactInfo: 'noah.kim@example.com',
    memberSince: 'June 2018',
    posts: [{ title: 'Fire Recovery Jam Night' }]
  },
  {
    id: '5',
    name: 'Isabella Ruiz',
    role: 'Resident',
    avatar: '/avatars/resident5.png',
    shortBio: 'Retired teacher enjoying her garden.',
    fullBio: 'Isabella runs a neighborhood compost co-op and teaches gardening to kids.',
    contactInfo: 'isabella.ruiz@example.com',
    memberSince: 'August 2017',
    posts: [{ title: 'Composting Basics' }]
  },

  // Business Owners
  {
    id: '6',
    name: 'David Chen',
    role: 'Business Owner',
    avatar: '/avatars/owner1.png',
    shortBio: 'Cafe owner supporting fire relief.',
    fullBio: 'David’s café serves as a community hub and offers discounts to affected residents.',
    contactInfo: 'david.chen@example.com',
    memberSince: 'May 2016',
    posts: [{ title: 'Free Coffee for Firefighters' }]
  },
  {
    id: '7',
    name: 'Grace Mitchell',
    role: 'Business Owner',
    avatar: '/avatars/owner2.png',
    shortBio: 'Salon owner and stylist.',
    fullBio: 'Grace employs fire survivors and hosts self-care workshops for residents.',
    contactInfo: 'grace.mitchell@example.com',
    memberSince: 'September 2018',
    posts: []
  },
  {
    id: '8',
    name: 'Javier Torres',
    role: 'Business Owner',
    avatar: '/avatars/owner3.png',
    shortBio: 'Runs local grocery store.',
    fullBio: 'Javier helps keep prices low and donates to local food recovery programs.',
    contactInfo: 'javier.torres@example.com',
    memberSince: 'February 2020',
    posts: [{ title: 'Fresh Produce Donations' }]
  },
  {
    id: '9',
    name: 'Mei Tanaka',
    role: 'Business Owner',
    avatar: '/avatars/owner4.png',
    shortBio: 'Handmade crafts and recovery kits.',
    fullBio: 'Mei sells healing kits and donates 10% to fire victims.',
    contactInfo: 'mei.tanaka@example.com',
    memberSince: 'October 2021',
    posts: [{ title: 'Support Bags for Survivors' }]
  },
  {
    id: '10',
    name: 'Henry Wallace',
    role: 'Business Owner',
    avatar: '/avatars/owner5.png',
    shortBio: 'Hardware store manager.',
    fullBio: 'Henry gives deep discounts on rebuilding supplies to verified locals.',
    contactInfo: 'henry.wallace@example.com',
    memberSince: 'April 2015',
    posts: []
  },

  // Volunteers
  {
    id: '11',
    name: 'Nina Brooks',
    role: 'Volunteer',
    avatar: '/avatars/volunteer1.png',
    shortBio: 'Helps with elderly transportation.',
    fullBio: 'Nina drives residents to appointments and errands after the fire.',
    contactInfo: 'nina.brooks@example.com',
    memberSince: 'December 2022',
    posts: [{ title: 'Transport Network Launched' }]
  },
  {
    id: '12',
    name: 'Omar Ali',
    role: 'Volunteer',
    avatar: '/avatars/volunteer2.png',
    shortBio: 'Skilled in emergency response.',
    fullBio: 'Omar has medical training and volunteers during disasters.',
    contactInfo: 'omar.ali@example.com',
    memberSince: 'June 2023',
    posts: []
  },
  {
    id: '13',
    name: 'Rachel Park',
    role: 'Volunteer',
    avatar: '/avatars/volunteer3.png',
    shortBio: 'Organizes food drives.',
    fullBio: 'Rachel leads monthly donation events and sorts food packs.',
    contactInfo: 'rachel.park@example.com',
    memberSince: 'January 2023',
    posts: [{ title: 'March Food Drive Results' }]
  },
  {
    id: '14',
    name: 'Marcus Green',
    role: 'Volunteer',
    avatar: '/avatars/volunteer4.png',
    shortBio: 'Landscaper and cleanup volunteer.',
    fullBio: 'Marcus donates his time to remove debris and restore lots.',
    contactInfo: 'marcus.green@example.com',
    memberSince: 'February 2023',
    posts: []
  },
  {
    id: '15',
    name: 'Aisha Bello',
    role: 'Volunteer',
    avatar: '/avatars/volunteer5.png',
    shortBio: 'Youth mentor and coordinator.',
    fullBio: 'Aisha runs afterschool programs for kids impacted by the disaster.',
    contactInfo: 'aisha.bello@example.com',
    memberSince: 'March 2024',
    posts: [{ title: 'Spring Youth Workshop' }]
  },

  // Contractors
  {
    id: '16',
    name: 'Daniel Lee',
    role: 'Contractor',
    avatar: '/avatars/contractor1.png',
    shortBio: 'General contractor, licensed and bonded.',
    fullBio: 'Daniel has rebuilt over 20 homes in the Palisades after the fire.',
    contactInfo: 'daniel.lee@example.com',
    memberSince: 'May 2023',
    posts: [{ title: 'New Code Compliance Tips' }]
  },
  {
    id: '17',
    name: 'Ashley Morgan',
    role: 'Contractor',
    avatar: '/avatars/contractor2.png',
    shortBio: 'Roofing specialist.',
    fullBio: 'Ashley offers free inspections and quick repair quotes.',
    contactInfo: 'ashley.morgan@example.com',
    memberSince: 'July 2023',
    posts: []
  },
  {
    id: '18',
    name: 'Tomás Rivera',
    role: 'Contractor',
    avatar: '/avatars/contractor3.png',
    shortBio: 'Foundation and concrete expert.',
    fullBio: 'Tomás handles retrofitting, leveling, and safety foundations.',
    contactInfo: 'tomas.rivera@example.com',
    memberSince: 'March 2023',
    posts: []
  },
  {
    id: '19',
    name: 'Linda Adams',
    role: 'Contractor',
    avatar: '/avatars/contractor4.png',
    shortBio: 'Interior finishing and cabinetry.',
    fullBio: 'Linda provides custom work for homes with a local crafts team.',
    contactInfo: 'linda.adams@example.com',
    memberSince: 'September 2023',
    posts: [{ title: 'Choosing Sustainable Materials' }]
  },
  {
    id: '20',
    name: 'Kevin Zhang',
    role: 'Contractor',
    avatar: '/avatars/contractor5.png',
    shortBio: 'Electrician, solar and grid.',
    fullBio: 'Kevin handles off-grid solar setups and rewiring for rebuilds.',
    contactInfo: 'kevin.zhang@example.com',
    memberSince: 'June 2023',
    posts: []
  },

  // Community Organizers
  {
    id: '21',
    name: 'Maya Robinson',
    role: 'Community Organizer',
    avatar: '/avatars/organizer1.png',
    shortBio: 'Organizer of weekly meetups.',
    fullBio: 'Maya started the Palisades Fire Recovery Circle and hosts events every Friday.',
    contactInfo: 'maya.robinson@example.com',
    memberSince: 'April 2023',
    posts: [{ title: 'Weekly Healing Events' }]
  },
  {
    id: '22',
    name: 'Carlos Duran',
    role: 'Community Organizer',
    avatar: '/avatars/organizer2.png',
    shortBio: 'Coordinates rebuilding resources.',
    fullBio: 'Carlos keeps track of available grants and volunteer programs.',
    contactInfo: 'carlos.duran@example.com',
    memberSince: 'May 2023',
    posts: []
  },
  {
    id: '23',
    name: 'Hannah Fields',
    role: 'Community Organizer',
    avatar: '/avatars/organizer3.png',
    shortBio: 'Hosts emotional support sessions.',
    fullBio: 'Hannah is trained in trauma support and facilitates open talks weekly.',
    contactInfo: 'hannah.fields@example.com',
    memberSince: 'February 2023',
    posts: [{ title: 'Emotional Safety in Recovery' }]
  },
  {
    id: '24',
    name: 'Zaid Hassan',
    role: 'Community Organizer',
    avatar: '/avatars/organizer4.png',
    shortBio: 'Leads bilingual outreach.',
    fullBio: 'Zaid translates all public materials and runs Spanish-language Q&A nights.',
    contactInfo: 'zaid.hassan@example.com',
    memberSince: 'March 2023',
    posts: []
  },
  {
    id: '25',
    name: 'Olivia Bennett',
    role: 'Community Organizer',
    avatar: '/avatars/organizer5.png',
    shortBio: 'Policy liaison and data tracker.',
    fullBio: 'Olivia works with city reps to track rebuilding metrics and equity.',
    contactInfo: 'olivia.bennett@example.com',
    memberSince: 'March 2023',
    posts: [{ title: 'Recovery Funding Summary' }]
  }
];
// app/dashboard/member-directory/page.jsx
 
import { useState } from 'react';
import {
  Box, Typography, Grid, Dialog, DialogTitle, DialogContent,
  Avatar, Divider, Button, Pagination, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import UserCard from '@/components/UserCard';

const roles = [
  'Resident',
  'Business Owner',
  'Volunteer',
  'Contractor',
  'Community Organizer'
];

const isVerifiedViewer = false;

const users2 = Array.from({ length: 51 }).map((_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  role: roles[i % roles.length],
  shortBio: `Bio for user ${i + 1}`,
  fullBio: `This is a full detailed bio for user ${i + 1}.`,
  contactInfo: `user${i + 1}@example.com`,
  memberSince: `202${i % 4 + 1}`,
  posts: [{ title: `Post by user ${i + 1}` }]
}));
const users = [...users1, ...users2].map((user, index) => ({
  ...user,
  id: String(index + 1),
  posts: user.posts.map((post, postIndex) => ({
    ...post,
    id: String(postIndex + 1)
  }))
}));

export default function MemberDirectoryPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredRole, setFilteredRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const filteredUsers = filteredRole
    ? users.filter(u => u.role === filteredRole)
    : users;

  const paginatedUsers = filteredRole
    ? filteredUsers.slice((currentPage - 1) * usersPerPage*2, currentPage * usersPerPage*2)
    : [];

  const handleViewMore = (role) => {
    setFilteredRole(role);
    setCurrentPage(1);
  };

  const handleBack = () => {
    setFilteredRole(null);
    setCurrentPage(1);
  };

  const groupedUsers = roles.reduce((acc, role) => {
    acc[role] = users.filter(u => u.role === role).slice(0, 6);
    return acc;
  }, {});

  return (
    <Box p={3}> 
      <Typography sx={{
          textAlign: { xs: 'center', md: 'left' },
        }}
         variant="h4" mb={1} fontWeight={100} fontFamily = {'system-ui'}>
      Verified Members</Typography>
      <Typography variant="body1" mb={3}>
        These are verified members of our community directory. If you'd like to be listed, please create an account.
        <Button variant="contained" sx={{ mt: 1 }} href="/auth/signup">Create Account</Button>
      </Typography>

      {!filteredRole ? (
        roles.map((role) => {
          const pluralRole = `${role}s`;
          const count = users.filter(u => u.role === role).length;
          return (
            <Box key={role} mb={5}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6"
                onClick={() => handleViewMore(role)}
                sx={{ cursor: 'pointer',}}
                >{pluralRole} ({count})</Typography>
                {count > 6 && (
                  <Button color = "secondary" onClick={() => handleViewMore(role)}>View more</Button>
                )}
              </Box>
              <Grid container spacing={2}>
                {groupedUsers[role].map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user.id}>
                    <UserCard user={user} onClick={() => setSelectedUser(user)} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
    <InputLabel>Category</InputLabel>
    <Select
      label="Category"
      value={filteredRole || ''}
      onChange={(e) => {
        const value = e.target.value;
        setFilteredRole(value || null);
        setCurrentPage(1);
      }}
    >
      <MenuItem value="">View All</MenuItem>
      {roles.map(role => (
        <MenuItem key={role} value={role}>
          {role}s ({users.filter(u => u.role === role).length})
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  <Button color = "secondary" onClick={handleBack}>← Back to All</Button>
</Box>

          <Grid container spacing={2}>
            {paginatedUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <UserCard user={user} onClick={() => setSelectedUser(user)} />
              </Grid>
            ))}
          </Grid>
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(filteredUsers.length / (usersPerPage*2))}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="secondary"
            />
          </Box>
        </>
      )}

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} fullWidth maxWidth="sm">
        {selectedUser && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={`https://i.pravatar.cc/150?img=${20+selectedUser.id}`} />
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="subtitle2">{selectedUser.role}</Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ mb: 2 }}>{selectedUser.fullBio}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption">Member since: {selectedUser.memberSince}</Typography>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500}>Contact Info:</Typography>
                {isVerifiedViewer
                  ? (
                    selectedUser.contactInfo || <Typography color="text.secondary">No contact info provided</Typography>
                  )
                  : (
                    <Typography color="text.secondary">
                      🔒 Only verified members can view contact information.
                    </Typography>
                  )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Posts</Typography>
              {selectedUser.posts.length > 0 ? (
                selectedUser.posts.map((post, idx) => (
                  <Typography key={idx} variant="body2">• {post.title}</Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No posts yet.
                </Typography>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
