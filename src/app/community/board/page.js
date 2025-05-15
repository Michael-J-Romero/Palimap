"use client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Pagination,
  Divider,
  Tooltip,
  CardMedia,
  CardActions,
  CardActionArea,

} from '@mui/material';
import NewPostButton from '@/components/NewPost';
import PlaceIcon from '@mui/icons-material/Place';
import MapIcon from '@mui/icons-material/Map';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import posts from '@/data/communityPosts.json'; // Assuming you have a JSON file with posts data
import Post from '@/components/PostItem';
import SearchBar from '@/components/PostSearch';
const categories = [
  'All',
  'Help Wanted',
  'Volunteer Exchange',
  'Recovery Stories',
  'Safety & Alerts',
  'Rebuilding Tips',
  'Community News'
];
const sortOptions = ['Newest First', 'Oldest First', 'Most Comments']
// const SearchBar = ({ }) => {
//   return (
//     <Stack direction="row" spacing={2} alignItems="center">
//       <input
//         type="text"
//         placeholder="Search posts..."
//         style={{
//           padding: '8px',
//           borderRadius: '4px',
//           border: '1px solid #ccc',
//           width: '100%',
//         }}
//       />
//       {/* <Button variant="contained" color="primary" endIcon={<SearchIcon />} sx={{ minWidth: 'max-content' }}
//         >Search</Button> */}
//       <IconButton color="primary"
//       // flush with edge
//       >
//         <SearchIcon sx={{
//           marginLeft: '0px',
//         }} />
//       </IconButton>
//     </Stack>
//   );
// }

export default function CommunityBoardPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const filteredPosts = posts
    .filter((post) => selectedCategory === 'All' || post.category === selectedCategory)
    .sort((a, b) => {
      if (sortOrder === 'Newest First') {
        return new Date(b.date) - new Date(a.date);
      }
      else if (sortOrder === 'Most Comments') {
        return b.comments - a.comments;
      }
      else {
        return new Date(a.date) - new Date(b.date);
      }
    });
  const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);
  const containerRef = useRef();
  useEffect(() => {
    // scroll To top of the page when page changes
    //cancel on initial render
    if (page === 1) {
      return;
    }

    if (containerRef.current) {
      containerRef.current.scrollIntoView({ block: 'start' });
    }

  }
    , [page]);

  return (
    <Box py={3} px={{ xs: 2, md: 3 }} sx={{ backgroundColor: 'background.default' }}>
      <Stack spacing={2} mb={3}>
        <Typography sx={{
          textAlign: { xs: 'center', md: 'left' },
        }}
        variant="h4" fontWeight={100} fontFamily="system-ui" color="text.primary">
          Discussion Board</Typography>
        <Stack spacing={4} mb={3} flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
          <NewPostButton
            ButtonComponent={PostBtn}
          />

          <Typography color="text.secondary" sx={{ 
            m: '0 !important' ,
            mt: { xs: '12px !important', lg: '0 !important' },
            }}>
            Share updates, stories, or requests with your neighbors. Before posting, please take a moment to read the
            <Typography component={Link} href="/community/guidelines" color="primary"  >
              {" "}community guidelines.
            </Typography>
          </Typography>
        </Stack>
      </Stack>
      <Divider ref={containerRef}
        sx={{ mb: 3 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems="center" justifyContent="space-between">
        <Stack direction="row" 
        spacing={2} alignItems="center" flexGrow={1} flexWrap="wrap">
          <FormControl size="small" sx={{ flexGrow:1,flexShrink:1,wrap:'nowrap',minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ flexGrow:1,flexShrink:1,wrap:'nowrap',minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort By"
            >
              {sortOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <SearchBar posts={posts} />
      </Stack>
      <Stack spacing={2} mb={4}>
        {paginatedPosts.map((post, i) => (
          <Post key={post.id} post={post}
          // ref={i === 0 ? containerRef : null} 
          />
        ))}
      </Stack>
      <Box display="flex" justifyContent="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
function determineLength(str) {
  // This function will create a sort of hash from the string
  // and output a number between zero and 100
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return 15 + Math.floor(hash % 30);
}
function lorem(length) {
  const txt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  return txt.split(' ').slice(0, length).join(' ')
}



const PostBtn = ({ onClick }) => {
  return <Button onClick={onClick}
    variant="contained"
    color="primary"
    sx={{
      minWidth: 'max-content',
      px: 2,
      mr: 2,
      marginRight: '12px',
    }} style={{ marginRight: '24px', }}>
    <AddIcon sx={{ mr: 1 }} />
    Create New Post
  </Button>
}



