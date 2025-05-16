'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  IconButton,
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
     Menu,
    MenuItem,
    Divider,
    Link,
      useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import NewPostButton from '@/components/NewPost';

import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import {
    format,
    parse,
    startOfWeek,
    getDay,
} from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useThemeContext } from '@/context/ThemeContext';
import posts from '@/data/communityPosts.json'; // Assuming you have a JSON file with posts data

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Post from '@/components/PostItem';
import dayjs from 'dayjs';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const placeholderEvents = [
  {
    id: 1,
    title: "Community Kickoff",
    category: "Social",
    author: "Jenna Morales",
    date: "2025-07-12",
    comments: 0,
    type: "event",
    excerpt: "Join us for the community kickoff event to celebrate the start of new initiatives and reconnect with neighbors.",
    location: null,
    eventDate: "2025-07-12T00:00:00"
  },
  {
    id: 2,
    title: "Planning Meeting",
    category: "Meeting",
    author: "David Tran",
    date: "2025-05-14",
    comments: 0,
    type: "event",
    excerpt: "Monthly planning meeting to discuss upcoming community projects and logistics.",
    location: null,
    eventDate: "2025-05-14T00:00:00"
  },
  {
    id: 3,
    title: "Cleanup Day",
    category: "Volunteer",
    author: "Kim Patel",
    date: "2025-05-26",
    comments: 2,
    type: "event",
    excerpt: "Pitch in to help clean up the neighborhood park and walkways. Gloves and bags will be provided.",
    location: null,
    eventDate: "2025-05-26T00:00:00"
  },
  {
    id: 4,
    title: "Graffiti Removal",
    category: "Volunteer",
    author: "Elijah Brooks",
    date: "2025-06-01",
    comments: 1,
    type: "event",
    excerpt: "Help us restore community spaces by removing graffiti from public walls and signage.",
    location: null,
    eventDate: "2025-05-26T00:00:00"
  },
  {
    id: 5,
    title: "Workshop: Fire Safety",
    category: "Education",
    author: "Amanda Reyes",
    date: "2025-06-08",
    comments: 3,
    type: "event",
    excerpt: "Hands-on workshop covering key fire safety tips and household readiness strategies.",
    location: null,
    eventDate: "2025-06-08T00:00:00"
  },
  {
    id: 6,
    title: "Board Meeting",
    category: "Meeting",
    author: "Tyler Jennings",
    date: "2025-06-03",
    comments: 0,
    type: "event",
    excerpt: "Board members meet to discuss current developments and address open items from the last session.",
    location: null,
    eventDate: "2025-06-03T00:00:00"
  },
  {
    id: 7,
    title: "Youth Group",
    category: "Social",
    author: "Natalie Chu",
    date: "2025-06-07",
    comments: 2,
    type: "event",
    excerpt: "Weekly meetup for teens and youth to connect, play games, and discuss life topics in a supportive space.",
    location: null,
    eventDate: "2025-06-07T00:00:00"
  },
  {
    id: 8,
    title: "Fundraiser Prep",
    category: "Meeting",
    author: "Carlos Mendez",
    date: "2025-06-12",
    comments: 1,
    type: "event",
    excerpt: "Team gathering to finalize plans and materials for the upcoming community fundraiser.",
    location: null,
    eventDate: "2025-06-12T00:00:00"
  },
  {
    id: 9,
    title: "Park Picnic",
    category: "Social",
    author: "Lara Whitman",
    date: "2025-05-16",
    comments: 4,
    type: "event",
    excerpt: "Pack your blankets and snacks! Join neighbors for a relaxing afternoon picnic at the central park.",
    location: null,
    eventDate: "2025-05-17T00:00:00"
  },
  {
    id: 10,
    title: "Evening Movie Night",
    category: "Social",
    author: "Jordan Kim",
    date: "2025-05-20",
    comments: 3,
    type: "event",
    excerpt: "Bring a chair and enjoy a community outdoor movie screening under the stars.",
    location: null,
    eventDate: "2025-05-20T00:00:00"
  },
  {
    id: 11,
    title: "Recycling Education",
    category: "Education",
    author: "Sophia Lin",
    date: "2025-07-04",
    comments: 1,
    type: "event",
    excerpt: "Learn how to reduce waste and recycle effectively in this informative session.",
    location: null,
    eventDate: "2025-07-04T00:00:00"
  },
  {
    id: 12,
    title: "Sustainability Talk",
    category: "Education",
    author: "Bryan Ortega",
    date: "2025-05-18",
    comments: 2,
    type: "event",
    excerpt: "Guest speaker discusses sustainable practices that can be adopted locally and at home.",
    location: null,
    eventDate: "2025-05-18T00:00:00"
  },
  {
    id: 13,
    title: "Book Club",
    category: "Social",
    author: "Dana Sullivan",
    date: "2025-07-06",
    comments: 5,
    type: "event",
    excerpt: "Monthly book club meeting. This month’s read: *The Overstory* by Richard Powers.",
    location: null,
    eventDate: "2025-05-17T00:00:00"
  },
  {
    id: 14,
    title: "Board Meeting",
    category: "Meeting",
    author: "Tyler Jennings",
    date: "2025-05-19",
    comments: 0,
    type: "event",
    excerpt: "Second board session this month to cover new urgent agenda items.",
    location: null,
    eventDate: "2025-05-19T00:00:00"
  },
  {
    id: 15,
    title: "Volunteer Coordination",
    category: "Volunteer",
    author: "Melina Garcia",
    date: "2025-06-17",
    comments: 0,
    type: "event",
    excerpt: "Meeting for volunteer team leads to align efforts for the coming month.",
    location: null,
    eventDate: "2025-06-17T00:00:00"
  },
  {
    id: 16,
    title: "Emergency Drill",
    category: "Education",
    author: "Luis Hernandez",
    date: "2025-06-14",
    comments: 2,
    type: "event",
    excerpt: "Community-wide emergency drill to practice evacuation and response protocols.",
    location: null,
    eventDate: "2025-06-14T00:00:00"
  },
  {
    id: 17,
    title: "Town Hall",
    category: "Meeting",
    author: "Angela Price",
    date: "2025-05-23",
    comments: 4,
    type: "event",
    excerpt: "Share your thoughts at the open forum town hall. Everyone’s voice matters.",
    location: null,
    eventDate: "2025-05-23T00:00:00"
  },
  {
    id: 18,
    title: "Bike Repair Day",
    category: "Volunteer",
    author: "Derek Thompson",
    date: "2025-07-01",
    comments: 1,
    type: "event",
    excerpt: "Bring your bike for free repairs or learn how to fix it yourself!",
    location: null,
    eventDate: "2025-07-01T00:00:00"
  }
].map((event) => ({
        ...event,
        imageUrl:'/placeholder.png',
        start: new Date(event.eventDate),
        end: new Date(new Date(event.eventDate).getTime() + 2 * 60 * 60 * 1000), // Assuming each event lasts 2 hours
      }));


const CommunityCalendar = () => {
    const theme = useTheme();
    const { toggleTheme: setMode, mode } = useThemeContext();

    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const openFilter = Boolean(filterAnchorEl);

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterSelect = (category) => {
        setActiveFilter(category);
        handleFilterClose();
    };


    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());

    const handleViewChange = useCallback((newView) => {
        setView(newView);
    }, []);

    const handleNavigate = useCallback((newDate) => {
        setDate(newDate);
    }, []);

    const eventPropGetter = useCallback(
        (event) => {
            const categoryColors = {
                Meeting: theme.palette.primary.main,
                Volunteer: theme.palette.success.main,
                Education: theme.palette.warning.main,
                Social: theme.palette.secondary.main,
            };

            return {
                style: {
                    backgroundColor: categoryColors[event.category] || theme.palette.info.main,
                    color: theme.palette.getContrastText(
                        categoryColors[event.category] || theme.palette.info.main
                    ),
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: '0.875rem',
                },
            };
        },
        [theme]
    );

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={2} mb={3}>
                    <Typography sx={{
          textAlign: { xs: 'center', md: 'left' },
        }}
         variant="h4" fontWeight={100} fontFamily="system-ui" color="text.primary">
                      Community Calendar
                      </Typography>
                    <Stack spacing={4} mb={3} flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
                      <NewPostButton
                        ButtonComponent={PostBtn}
                      />
                      <Typography color="text.secondary" 
                      sx={{ 
                                  m: '0 !important' ,
                                  mt: { xs: '12px !important', lg: '0 !important' },
                                  }}>
                         Planning an event? Share it with the community!
                         Before posting, please take a moment to read the
                        <Typography component={Link} href="/community/guidelines" color="primary"  >
                          {" "}community guidelines.
                        </Typography>
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider   
                    sx={{ mb: 3 }}
                    variant="middle"
                    light/>
                

    

            <Box
                sx={{
                    height: 600,
                    my: 2,
                    //   '& .rbc-calendar': {
                    //     backgroundColor: theme.palette.background.paper,
                    //     color: theme.palette.text.secondary,
                    //   },
                    "& .rbc-month-view": {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                        border: `1px solid ${theme.palette.divider}`,

                    },
                    "& .rbc-time-content > * + * > *": {
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    },
                    "& .rbc-day-slot .rbc-time-slot": {
                        borderTop: `1px solid ${theme.palette.divider}`,
                    },
                    "& .rbc-timeslot-group": {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    "& .rbc-time-content": {
                        borderTop: `1px solid ${theme.palette.divider}`,
                    },
                    "& .rbc-toolbar button.rbc-active": {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                    },
                    '& .rbc-toolbar-label': {
                        color: theme.palette.text.secondary,
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                    },
                    "& .rbc-toolbar button:hover": {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.text.secondary,
                    },

                    '& .rbc-toolbar': {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                    },
                    '& .rbc-toolbar button': {
                        color: theme.palette.text.secondary,
                        backgroundColor: theme.palette.background.default,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                    '& .rbc-header': {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    },
                    //   '& .rbc-month-view': {
                    //     border: `1px solid ${theme.palette.divider}`,
                    //   },
                    '& .rbc-month-row + .rbc-month-row': {
                        borderTop: `1px solid ${theme.palette.divider}`,
                    },
                    '& .rbc-day-bg + .rbc-day-bg': {
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    },
                    '& .rbc-date-cell': {
                        color: theme.palette.text.secondary,
                    },
                    '& .rbc-today': {
                        backgroundColor: theme.palette.action.selected,
                    },
                    '& .rbc-button-link': {
                        color: theme.palette.text.secondary,
                    },
                    '& .rbc-event': {
                        backgroundColor: `${theme.palette.secondary.main} !important`,
                        color: `${theme.palette.secondary.contrastText} !important`,
                        borderRadius: 2,
                        padding: '2px 5px',
                    },
                    '& .rbc-show-more': {
                        color: theme.palette.secondary.main,
                    },
                    '& .rbc-agenda-view table': {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                    },
                    '& .rbc-agenda-view td': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    '& .rbc-agenda-view th': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    "& .rbc-off-range-bg": {
                        backgroundColor: theme.palette.background.default,
                        opacity: 0.5,
                    },
                    '& .rbc-row-segment': {
                        padding: '1px 2px 1px 2px'
                    }
                }}
            >
                <BigCalendar
                    localizer={localizer}
                    events={placeholderEvents
                        .filter(event =>  (activeFilter === "All" || event.category === activeFilter))

                    }
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    views={['month', 'week', 'day']}
                    onView={handleViewChange}
                    date={date}
                    onNavigate={handleNavigate}
                    onSelectEvent={event => alert(`Go to event page: ${event.title}`)}
                    eventPropGetter={eventPropGetter}
                //   onDrillDown={() => null}
                />
            </Box>
<Divider
                    sx={{ mb: 3 }}
                    variant="middle"
                    light/>
                    
            <Typography variant="h6" gutterBottom textAlign="center">
                Upcoming Events
            </Typography>
            <Posts  activeFilter={activeFilter} />
        </Box>
    );
};

export default CommunityCalendar;


const Posts = ({ activeFilter }) => {
    const theme = useTheme();
    const isMobileLayout = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const itemsPerPage = isMobileLayout ? 1 : 3;

  useEffect(() => {
    setPage(0);
  }, [activeFilter]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return placeholderEvents
      .map((event) => ({
        ...event,
        title: `${dayjs(event.date).format("MMM D")}: ${event.title}`,
         
      }))
      .filter(
        (event) =>  (activeFilter === "All" || event.category === activeFilter))
      .sort((a, b) => a.start - b.start);
  }, [activeFilter]);

  const paginatedEvents = filteredEvents.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <Box position="relative" width="100%">
      {/* Arrows */}
     <Box
  sx={{
    position: "absolute",
    left: -28,
    top: "150px",
    transform: "translateY(-50%)",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
    onClick={() => page > 0 && setPage((p) => p - 1)}
>
  <IconButton
    disabled={page === 0}
    sx={{
      border: "1px solid",
      backgroundColor: "background.paper",
      boxShadow: 2,
      "&:hover": { backgroundColor: "grey.200" },
    }}
  >
    <ArrowBackIosNewIcon fontSize="small" />
  </IconButton>
  <Box
    component="span"
    sx={{ 
        cursor: page === 0 ? "default" : "pointer",
        userSelect: "none",
        color: page === 0 ? "text.disabled" : "text.secondary",
        fontSize: 12, mt: 0.5 }}
  >
    Previous
  </Box>
</Box>

<Box
  sx={{
    position: "absolute",
    right: -28,
    top: "150px",
    transform: "translateY(-50%)",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
    onClick={() => page + 1 < totalPages && setPage((p) => p + 1)}
>
  <IconButton
    disabled={page + 1 >= totalPages}
    sx={{
      border: "1px solid",
      backgroundColor: "background.paper",
      boxShadow: 2,
      "&:hover": { backgroundColor: "grey.200" },
    }}
  >
    <ArrowForwardIosIcon fontSize="small" />
  </IconButton>
  <Box
    component="span"
    sx={{ fontSize: 12, 
        cursor: page + 1 >= totalPages ? "default" : "pointer",
        userSelect: "none",
        color: page + 1 >= totalPages ? "text.disabled" : "text.secondary",
        mt: 0.5 }}
  >
    Next
  </Box>
</Box>


      {/* Cards */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-start"
        sx={{
          overflow: "hidden",
          px: 4, // padding to make space for arrows
        }}
      >
        {paginatedEvents.map((event) => (
          <Box
            key={event.id}
            sx={{
              flex: "1 1 0",
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 16px)",
                md: "calc(33.33% - 16px)",
                },
              minWidth: 0,
            }}
          >
            <Post overrideOnClick = {(event)=>{
                alert(`Go to event page: ${event.title}`)
            }}
            post={event} forceMobile={true} type = "event"/>
              {/* {event.date && (
      <Box mt={1} textAlign="center">
        <Typography variant="caption" color="text.secondary" 
        fontSize = {15} 
        sx = {{
            display: "block",
            fontWeight: 200,
        }} >
          {dayjs(event.date).format("MM/DD/YYYY")}
        </Typography>
      </Box>
    )} */}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

function PostBtn ({ onClick })  {
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
    Create New Event
  </Button>
}


