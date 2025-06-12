"use client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CommentIcon from "@mui/icons-material/Comment";
import Link from "next/link";
import dayjs from "dayjs";

const Span = ({children}) => {
    return <div>{children}</div>
}

const Post = ({ overrideOnClick,post, forceMobile = false,type }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobileLayout = forceMobile || isSmall;

  const isValid = (val) => val && val !== "null";

  const postDate = isValid(post.date) ? dayjs(post.date) : null;
  const eventDate = isValid(post.eventDate) ? dayjs(post.eventDate) : null;
  const location = isValid(post.location) ? post.location : null;
  const imageUrl = isValid(post.imageUrl) ? post.imageUrl : null;

  return (
    <Card
      key={post.id}
      variant="outlined"
      component={Link}
        onClick={overrideOnClick || function(){}}
      href={overrideOnClick?`/map?location=${post.id}`:`/community/board/${post.id}`}
      sx={{
        display: "flex",
        maxWidth: isMobileLayout ? 400: "100%" ,
        transition: "0.2s",
        textDecoration: "none",
        "&:hover": {
          boxShadow: 3,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{
        // padding: isMobileLayout ? 0 : 2,

      }}>
        <Stack spacing={2}>
          {isMobileLayout ? (
            // MOBILE LAYOUT
            <>
              {imageUrl && (
                <Box
                  sx={{
                    borderRadius: 1,
                    width: "100%",
                    height: 150,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}

              <Typography variant={
                isMobileLayout? "subtitle2" :"h6" 
              }
              fontWeight={600}>
                {post.title}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" flexWrap="wrap">
                <Typography variant="body2">{post.author}</Typography>
                {post.date && <Typography variant="body2">| {daysAgo(post.date)} days ago</Typography>}
              </Stack>

              <Typography variant="body2" color="text.primary">
                {post.excerpt?.substr(0, 200) + (post.excerpt?.length > 100 ? "..." : "")}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={post.category || "Post"}
                    variant="soft"
                    size="small"
                    color="default"
                  />
                  {eventDate && type != "event" &&(
                    <Chip
                      label={`Event: ${eventDate.format("MMM D")}`}
                      icon={<CalendarTodayIcon />}
                      size="small"
                      color="secondary"
                    />
                  )}
                  {location && (
                    <Chip
                      label="Has Location"
                      icon={<MapIcon />}
                      size="small"
                      color="secondary"
                    />
                  )}
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CommentIcon fontSize="small" />
                  <Typography variant="body2">{post.comments}</Typography>
                </Stack>
              </Stack>
            </>
          ) : (
            // DESKTOP LAYOUT
            <Stack direction="row" spacing={2} alignItems="flex-start">
              {imageUrl && (
                <Box
                  sx={{
                    borderRadius: 1,
                    width: 150,
                    height: 100,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    flexShrink: 0,
                  }}
                />
              )}

              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {post.title}
                </Typography>

                <Typography variant="body2" color="text.primary">
                  {post.excerpt?.substr(0, 200) + (post.excerpt?.length > 100 ? "..." : "")}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                    <Typography variant="body2">{post.author}</Typography>
                    {post.date && <Typography variant="body2">| {daysAgo(post.date)} days ago</Typography>}
                    <Typography variant="body2">|</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CommentIcon fontSize="small" />
                      <Typography variant="body2">{post.comments}</Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={post.category || "Post"}
                      variant="soft"
                      size="small"
                      color="default"
                    />
                    {eventDate && (
                      <Chip
                        label={`Event: ${eventDate.format("MMM D")}`}
                        icon={<CalendarTodayIcon />}
                        size="small"
                        color="secondary"
                      />
                    )}
                    {location && (
                      <Chip
                        label="Has Location"
                        icon={<MapIcon />}
                        size="small"
                        color="secondary"
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default Post;

function daysAgo(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffTime = Math.abs(now - postDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
