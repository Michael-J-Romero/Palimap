"use client";
import posts from '@/data/communityPosts.json';
import { notFound } from 'next/navigation';
import { Box, Typography, Avatar, Stack, Chip, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CommentIcon from '@mui/icons-material/Comment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';


export default function PostPage({ params }) {
  const { id } = params;
  const post = posts.find((p) => String(p.id) === id);
  const router = useRouter();

  if (!post) return notFound();

  return (
    <Box py={4} px={{ xs: 2, md: 6 }}>
      <Stack spacing={3} justifyContent="flex-start" alignItems="flex-start">
        <Button startIcon={<ArrowBackIcon />} 
        onClick={() => {
          // if (router.back() === '/community/board')
          // router.back()
          // else 
          router.push('/community/board')
        }
}>
          Back to Community Board
        </Button>

        <Typography variant="h4" fontWeight={700}>{post.title}</Typography>

        <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar>{post.author.split(' ').map((n) => n[0]).join('')}</Avatar>
            <Typography>{post.author}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarTodayIcon fontSize="small" />
            <Typography>{dayjs(post.date).format('MMMM D, YYYY')}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CommentIcon fontSize="small" />
            <Typography>{post.comments} comments</Typography>
          </Stack>
          <Chip label={post.category} color="primary" variant="outlined" />
        </Stack>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in semper nulla, vel dapibus mauris. 
          Nulla facilisi. Integer nec semper erat, nec pharetra erat. Suspendisse potenti. Proin sit amet viverra nulla.
        </Typography>
        <h3>
This page is under construction

        </h3>
      </Stack>
    </Box>
  );
}
