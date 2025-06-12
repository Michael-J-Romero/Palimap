import {
  Box, Typography, Divider,
  Button,
  Paper,
Tooltip,
IconButton,

} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationDisplay from "../LocationDisplay";
import AddressEntry from "./AddressEntry";
import LocationListItem from "@/components/cards/LocationListItem";
import { useTheme } from "@mui/material/styles";
import styled from '@emotion/styled';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import NewPostButton from "@/components/NewPost";

const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontFamily: 'system-ui, sans-serif',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
    color: theme.palette.secondary.dark,
  },
}));

function AddPost () 
{
  return(
    <NewPostButton
    text="POST ABOUT THIS LOCATION"
    />
    // <Button
    //   variant="contained"
    //   color="primary"
    //   size="small"
    //   onClick={() => {
    //     // Handle adding a post or photo
    //     console.log("Add a post or photo clicked");
    //     // You can implement the logic to open a modal or redirect to a form here
    //   }}
    //   sx={{ 
    //     // width: '100%',
    //     // flexGrow: 1,
    //     // maxWidth: 200,
    //     // mt: 2 
    //   }}
    // >
    //   + POST ABOUT THIS LOCATION
    // </Button>
  );
}

function LocationInfo({ parcelData, postCount }) {
  const { SitusAddress, SitusCity, SitusState, SitusZIP, SitusStreet, SitusHouseNo }
    = parcelData.properties || {};
  let regularCapitalize = (str) => {
    // Lowercase all other words
    str = str.toLowerCase();
    return str.split(" ")
      .map((word) => {
        if (word.length > 2) {
          return capitalizeFirstLetter(word);
        } else {
          return word.toLowerCase();
        }
      })
      .join(" ");
  };
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
    const theme = useTheme();
  function norm(s){
    if (s === null || s === undefined) return false;
    let ss= s.toString().trim() 
    if (ss.length === 0) return false;
    if (ss === 'null') return false;
    if (ss === '0') return false;
    return ss;

  }
  // let formattedAddress = regularCapitalize(`${SitusHouseNo || ""} ${SitusStreet || ""}, ${SitusCity || ""}, ${SitusState || ""} ${SitusZIP?.slice(0, 5) || ""}`);
  let formattedStAddress = regularCapitalize(`${norm(SitusHouseNo) || "12345"} ${norm(SitusStreet) || "street St"},`); 
  let cityStateZip = regularCapitalize(` ${norm(SitusCity) || "Los Angeles"}, ${norm(SitusState) || "CA"} ${norm(SitusZIP)?.slice?.(0, 5) || "90065"}`);
  let viewOnGoogleMapsUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${parcelData.properties.CENTER_LAT},${parcelData.properties.CENTER_LON}`;
  let viewOnGoogleMaps = (
    <StyledLink
      variant="text"
      color="primary"
      size="small"
      href={viewOnGoogleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        marginBottom: '8px',
      }}
      //   color: theme.palette.primary.main,
      //   textDecoration: 'none', 
      //   // hover

      // }}
      // sx={{ mt: 2 }}
    >
      View on Google Maps
      {/* <MapIcon sx={{ ml: 1 }} /> */}
    </StyledLink>
  );
  let addressText = (
    <Box sx={{ display: 'flex', flexDirection: 'row',  alignItems: 'space-between', gap: 1, width: '100%' }}>
    <Typography variant="body1" sx={{   fontSize: '1rem', fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
      {/* {formattedAddress} */}
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap',  alignItems: 'center',marginRight: '-8px',  }}>
      <div
      style={{
        marginRight: '8px',
      }} >
        {formattedStAddress}{" "}
      </div>
      <div>
        {" "}{cityStateZip}
      </div>
      </Box>

    </Typography>
    <Tooltip title="Center map">
      <Box onClick={() => {
        alert('not functional yet');
      }}
        sx={{
          ml:.5,
          px: 1,
          display: 'flex',
          alignItems: 'center',
          fontSize: '.8rem',
        }}
        size="small"
        >

        <MyLocationIcon sx={{
          color: 'secondary.main',
          fontSize: '1.2rem',
        }}/>
      </Box>
    </Tooltip>
    </Box>
  );

  return (
    <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column',   color: 'text.primary' ,
justifyContent: 'flex-start', alignItems: 'flex-start' , 
      // backgroundColor: 'background.paper',
      // borderRadius: 1,
      // boxShadow: 3,
      // border: '1px solid',
      // borderColor: 'background.standout',

    }}>
      {addressText}
      
      {viewOnGoogleMaps}
      {postCount >=0 && 
      <Box sx={{
         width: '100%',display: 'flex', flexDirection: 'column', gap: .5,alignItems: 'flex-start', justifyContent: 'flex-start',
         pt:2
      }}>
        <Typography variant="body1" sx={{   }}>
          Have something to share?
        </Typography>
        <AddPost />
        {/* <Typography variant="body2" sx={{   }}>
          Community guidelines

        </Typography> */}
      </Box>
      }


      {/* Add more post details here */}
    </Box>
  );
}
export default function App({ pageData,posts = [], parcelData, fireData, loadingPhotos, onClose }) {

  const noPosts = <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    mb: 2,
  }}>
    <Typography variant="h6" sx={{ mt: 2, textAlign: 'center', color: 'text.primary', fontSize: '1.2rem', fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
      No posts yet
    </Typography>
    <Typography variant="body1" sx={{ textAlign: 'center' }}>
      Be the first to share something about this location!
    </Typography>
    <AddPost />
    <Divider sx={{ my: 1 }} />
  </Box>
  const topPost = (posts.length >0) && <LocationDisplay
        mini
        pageData={{...pageData, slug: posts[0].id }}
        onClose={() => { }}
      />
  const fireDamage = <Box sx={{ mb: 3 }}>
    <Typography
      variant="h6"
      sx={{
        // pt: 1,
        // textAlign: 'center',
        color: 'text.primary',
        fontSize: '1.2rem',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 400,
      }}
    >
      {/* X Damaged Structures Reported*/}
      {loadingPhotos ?
        ''
        : fireData && fireData.length > 0 ?
          `${fireData.length} Damage Report${fireData.length > 1 ? 's' : ''} ` : "No Damaged Structures Reported"}
    </Typography>
    <Typography variant="body2">
      <AddressEntry loadingPhotos={loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} />
    </Typography>
    <Typography variant="body2"
      // color="primary.main"
      sx={{
        textAlign: 'center',
        color: 'secondary.main',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
      <a
        href="https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/ArcGIS/rest/services/DINS_2025_Palisades_Public_View/FeatureServer"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center' }}
      >
        Damage Inspection (DINS) data by CAL FIRE.
        <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
      </a>
    </Typography>
  </Box>
  const postsList = posts.slice(1).
    map((post, i) => (<>
      <Box key={post.id} sx={{
      }}>
        <LocationListItem
          noAddress
          isLast={i === posts.length - 2}
          location={post}
          isSelected={false}
          openLocation={pageData.openLocation}
          setSelectedMarker={() => { }}
        />
      </Box>
    </>
    ))
  const postCount=posts.length-1;


  return (
    <Box sx={{ px: 0, py: 0, color: 'text.primary' }}>
      <div
      onClick={(e) => {
        e.stopPropagation();
        let location = posts[0];
        pageData.openLocation(location.id)
      }}
      >
        
      {posts.length > 0 &&<Paper
      elevation={0}
      square
      sx={{ 
        // borderBottom: '1px solid',
        //  borderColor: 'background.standout',
          px: 2, py: 2,pb:4,
        //  backgroundColor: 'background.paper' 
        //shadow
        // ,boxShadow: 3
       }}>
        { topPost}
      </Paper  >}

      </div>
      {/* {location Info} */}
      <Box sx={{ 
        // boxShadow: 3, 
        borderColor: 'background.standout',  px: 0, py: 1,pt:2, backgroundColor: 'background.subtle' }}>
        {posts.length === 0?
          noPosts
        :''
      }
      <LocationInfo
        postCount={postCount}
        parcelData={parcelData}
      />
      </Box>

      {/* {xtra Posts} */}
      {posts.length > 1 ? 
      <Box sx={{ borderColor: 'background.standout', 
        px: 1, py: 1, backgroundColor: 'background.subtle' }}>
        <>
          <Box sx={{ display: 'flex', 
          mb: .5,
          ml: 1,
            justifyContent: 'flex-start',
            alignItems: 'center', 
            flexDirection: 'row', gap: 1,  }}>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'system-ui, sans-serif', fontWeight: 400 }}>
            {postCount} older post{postCount > 1 ? 's' : ''}  
            </Typography>
            {/* <AddPost /> */}
          </Box>
          {postsList}
        </>
        
      </Box>
        :''}
      {
        postCount ==0&&
        <Divider sx={{ my: 1,backgroundColor: 'background.default' }} />
      }
      <Box sx={{
        borderBottom: '1px solid', borderColor: 'background.standout', 
         px: 2, py: 1, backgroundColor: 'background.subtle' }}>
        {fireDamage}
      </Box>
    </Box>
  );
}




