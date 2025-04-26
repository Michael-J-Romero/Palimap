// function Comments() {
import {
  Stack,
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
  TextField,
  Button,
  Avatar,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Main() {
  return<Paper elevation={3} sx={{ p: 2, borderRadius: .3 }}>
    <Typography variant="h6" gutterBottom>
      Comments
    </Typography>

    <Stack direction="row" spacing={2} mb={2}>
      <Avatar src="/avatar-placeholder.png" />
      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder="Leave a comment..."
      />
    </Stack>

    <Button variant="contained" color="secondary"
     fullWidth sx={{ mb: 2 }}>
      Post Comment
    </Button>

    <Divider sx={{ mb: 2 }} />

    <Comments />
  </Paper>;
}

function Comments() {
  const mockComments = [
    {
      name: "Emily Carter",
      date: "March 5, 2025",
      body: "This project is really coming together! Excited to see the progress.",
    },
    {
      name: "James Miller",
      date: "March 4, 2025",
      body: "Does anyone know if volunteers are needed here?",
    },
    {
      name: "Sophia Lee",
      date: "March 2, 2025",
      body: "Looking great! Thanks to everyone involved in the restoration.",
    },
    {
      name: "Daniel Smith",
      date: "March 1, 2025",
      body: "I visited yesterday—things are moving fast!",
    },
    {
      name: "Olivia Brown",
      date: "February 28, 2025",
      body: "Can’t wait to see the final result! This place has so much potential.",
    },
    {
      name: "Liam Johnson",
      date: "February 27, 2025",
      body: "Is there a timeline for completion? I’m curious about the next steps.",
    },
    {
      name: "Ava Wilson",
      date: "February 26, 2025",
      body: "Great work everyone! This is going to be a fantastic addition to the area.",
    },
    {
      name: "Noah Davis",
      date: "February 25, 2025",
      body: "I love the design! It’s going to be a beautiful space.",
    },
    {
      name: "Mia Martinez",
      date: "February 24, 2025",
      body: "I heard there are plans for community events here. Exciting!",
    },
    {
      name: "Lucas Garcia",
      date: "February 23, 2025",
      body: "This is a great initiative! Looking forward to seeing it completed.",
    },
    {
      name: "Charlotte Rodriguez",
      date: "February 22, 2025",
      body: "I’m impressed with the progress so far. Keep up the good work!",
    },
  ];
  let theme = useTheme();
  return (
    <Grid
      item
      xs={12}
      md={5}
      lg={6}
      sx={{
        padding: "24px",
        backgroundColor: theme.palette.background.subtle,
        overflowY: "auto",
        height: "100%",
      }}
    >
      {/* <Paper sx={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}> */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Comments
      </Typography>

      {/* Comments List */}
      <List>
        {mockComments.map((comment, index) => (
          <ListItem key={index} alignItems="flex-start">
            <Avatar sx={{ bgcolor: "#1976d2", marginRight: 2 }}>
              {comment.name[0]}
            </Avatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  {comment.name}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="caption" color="text.secondary">
                    {comment.date}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "4px" }}>
                    {comment.body}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      {/* </Paper> */}
    </Grid>
  );
}
