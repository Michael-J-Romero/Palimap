"use client";
import React, { useEffect, useState } from "react";
import Carousel from "./ImageCarousel";
import {
  Box,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationLayout from "./SidebarLayout";
import getData from "@/components/map/data.js";
import VerticalTimeline from "./VerticalTimeline";



function PostList({ posts }) {
 /*
posts looks like:
{
    "id": 0,
    "image": "./mapImages/1.jfif",
    "icon": "🏗️",
    "coords": {
        "lat": 34.03209912,
        "lng": -118.52085441
    },
    "title": "Donation Drop-Off Here",
    "body": "This location is currently marked as 'Reconstruction'. Donation Drop-Off Here is actively happening here, with ongoing efforts to rebuild and restore the area.",
    "date": "2025-04-28",
    "type": "Reconstruction",
    "apn": "4411-024-036",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    -118.52061,
                    34.03228
                ],
                [
                    -118.52083,
                    34.03233
                ],
                [
                    -118.5212,
                    34.03205
                ],
                [
                    -118.52114,
                    34.03198
                ],
                [
                    -118.52108,
                    34.03192
                ],
                [
                    -118.52103,
                    34.03185
                ],
                [
                    -118.52055,
                    34.03211
                ],
                [
                    -118.52061,
                    34.03228
                ]
            ]
        ]
    },
    "damage": {
        "level": 0,
        "color": "#00cc00"
    }
}

 */

  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="body1">No posts available.</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ padding: 2 }}>
      {posts.map((post) => (!post)?
        <Box sx={{ padding: 2 }}>
          <Typography variant="body1">No posts available.</Typography>
        </Box> 
      :(

        <Card key={post.id} sx={{ marginBottom: 2 }}>
          <CardMedia
            component="img"
            height="140"
            image={post.image}
            alt={post.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.body}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

async function fetchPhotos(objectId) {
  const baseUrl =
    "https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/DINS_2025_Palisades_Public_View/FeatureServer/0";
  try {
    const response = await fetch(
      `${baseUrl}/queryAttachments?f=json&objectIds=${objectId}&returnMetadata=true`
    );
    const data = await response.json();
    if (!data.attachmentGroups || data.attachmentGroups.length === 0) {
      return [];
    }
    const pictureGroups = data.attachmentGroups.map((e, i) => {
      const pics = e.attachmentInfos.map(
        (att) => `${baseUrl}/${objectId}/attachments/${att.id}`
      );
      return pics;
    })
    if (pictureGroups.length > 1) {
      alert("Multiple photos groups found, flattening the array.");
    }
    return pictureGroups.flat();
  } catch (err) {
    return [];
  }
}
async function getBurnDataForParcel(parcelFeature) {
  if (!parcelFeature || !parcelFeature.geometry) {
    throw new Error("Invalid parcel feature");
  }
  const fireEndpoint = "https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/DINS_2025_Palisades_Public_View/FeatureServer/0/query";
  const esriGeometry = convertGeoJsonToEsriPolygon(parcelFeature.geometry);
  const queryParams = new URLSearchParams({
    geometry: JSON.stringify(esriGeometry),
    geometryType: "esriGeometryPolygon",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "*",
    returnGeometry: "true",
    where: "1=1",
    f: "json",
  });
  const response = await fetch(`${fireEndpoint}?${queryParams.toString()}`);
  const data = await response.json();
  return data.features;
}
function convertGeoJsonToEsriPolygon(geoJsonPolygon) {
  if (geoJsonPolygon.type !== "Polygon") {
    throw new Error("Only Polygon type is supported.");
  }
  return {
    rings: geoJsonPolygon.coordinates,
    spatialReference: { wkid: 4326 },
  };
}
function Pics({ photoData }) {
  const hasAnyPhotos = photoData?.some((entry) => entry.photos?.length > 0);
  if (!hasAnyPhotos) {
    return (
      <Box
        sx={{
          height: 200,
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          No Photo Available
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      {photoData.map((entry, i) => (
           
            <Carousel height={200} images={entry.photos} />
      ))}
    </Box>
  );
}


function AddressEntry({ entryData, fireData,loadingPhotos }) {

  return (
    <div style={{ 
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      flexGrow: 0,
      flexShrink: 1,
    }}>
      <AddressDetails loadingPhotos = {loadingPhotos} entryData={entryData} fireData={fireData} />
    </div>
  );
}
 

const AddressDetails = ({loadingPhotos, entryData ,fireData }) => {
  if (!entryData) return null;
  const data = entryData;
  console.log("AddressDetails data", data,fireData);
  let sructureStatus=loadingPhotos ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
      <CircularProgress />
    </Box>
  )
  :
  (!fireData || fireData.length === 0) ? (
    <Typography variant="body1">No damage shown for this address.</Typography>
  ) 
  :fireData.map((entry) => {
        const { STRUCTURETYPE ,DAMAGE} = entry.attributes || {};

    return <div key={entry.attributes.OBJECTID}>
      <Typography variant="body1" component="div" gutterBottom>
        {STRUCTURETYPE || "Unknown Structure Type"}
        ({DAMAGE || "N/A"})
      </Typography> 
      {entry.photos && entry.photos.length > 0 ? (
        <Pics photoData={[entry]} />
      ) : ''
      }
      <Divider sx={{ my: 1 }} />

    </div>
  
  });
  const {
    //only address data (not city, state, zip)
    SitusAddress,
    SitusCity,
    SitusState,
    SitusZIP,
LegalDescLine1,
    SitusFullAddress,
    APN,
    AIN,
    UseType,
    UseDescription,
    YearBuilt1,
    Bedrooms1,
    Bathrooms1,
    SQFTmain1,
    Roll_LandValue,
    Roll_ImpValue,
    Roll_Year,
    LegalDescription,
    LAT_LON,
    Shape_STArea,
    CENTER_LAT,
    CENTER_LON,
  } = data.properties || {};

  // console.log("fdsa AddressDetails data", data, fireData,CENTER_LAT,CENTER_LON);
  const totalValue = (Roll_LandValue || 0) + (Roll_ImpValue || 0);
  const city_s_z = `${SitusCity || ""}, ${SitusState || ""} ${SitusZIP?.slice(0, 5) || ""}`;
return !entryData.geometry ? (
    <Typography variant="body1">No data available for this address.</Typography>
  ) : (
   <CardContent sx={{
    color: "text.primary",
    px: 0,
    pb: 0,
    }}>
   
    <Typography variant="h6" component="div" gutterBottom sx = {{textAlign: "left",fontWeight: "bold"}}>
      {/* Affected Structures: */}
    </Typography>

      {sructureStatus}
    {/* <Divider sx={{ my: 2 }} /> */}
    {/* <a 
      href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${CENTER_LAT},${CENTER_LON}`}

      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Typography variant="body2" color="text.secondary">
        view on google maps
      </Typography>
    </a> */}
    {/* make the Google button look polished with mui */}
     

  </CardContent>
  )
}
export default function Address({ pageData, onClose }) {
  const [postData, setPostData] = useState(null);
  const { slug, getParcelData } = pageData;
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(true);
    const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [photos, setPhotos] = useState(null);
  const [fireData, setFireData] = useState(null);
  useEffect(() => {
    async function fetchFireData() {
      setLoadingPhotos(true);
      setPhotos(null);
      setFireData(null);
      if (!parcelData || !parcelData.geometry) return;
      try {
        const fd = await getBurnDataForParcel(parcelData);
        const photoFetches = fd.map(async (entry) => {
          const { STRUCTURETYPE, OBJECTID } = entry.attributes || {};
          if (!OBJECTID) return null;
          const photos = await fetchPhotos(OBJECTID);
          return { photos, STRUCTURETYPE };
        });
        const photoResults = await Promise.all(photoFetches);
        const mergedData = fd.map((entry, index) => {
          return {
            ...entry,
            photos: photoResults[index]?.photos || [],
          };
        });

        setFireData(mergedData);
        setPhotos(photoResults.filter(Boolean));
      } catch (error) {
      } finally {
        setLoadingPhotos(false);
      }
    }
    fetchFireData();
  }, [parcelData]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const parcelData = await getParcelData(slug);
      
      if (!parcelData) return;
      
      const postData = await getData();
      const p = parcelData.features?.[0]
      let matchedParcels = [];
      postData.forEach((entry) => {
        if (entry.apn === p?.properties?.APN) {
          matchedParcels.push(entry);
        }
      } );
      console.log("postDataaa3", postData, parcelData, matchedParcels);
      setPostData(matchedParcels);
      setLoading(false);
      if (parcelData.features.length > 1) {
        alert("Multiple parcels found, displaying the first one.");
      }
      setParcelData(p);
    };
    fetchData();
  }, [slug]);
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "text.primary",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

    const {
    //only address data (not city, state, zip)
    SitusAddress,
    SitusCity,
    SitusState,
    SitusZIP,
LegalDescLine1,
    SitusFullAddress,
    APN,
    AIN,
    UseType,
    UseDescription,
    YearBuilt1,
    Bedrooms1,
    Bathrooms1,
    SQFTmain1,
    Roll_LandValue,
    Roll_ImpValue,
    Roll_Year,
    LegalDescription,
    LAT_LON,
    Shape_STArea,
    CENTER_LAT,
    CENTER_LON,
  } = parcelData.properties || {};
  let regularCapitalize = (str) => {
    //lowercase all other words
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
  }
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  
  };
   let formattedAddress = regularCapitalize(`${SitusAddress || ""}, ${SitusCity || ""}, ${SitusState || ""} ${SitusZIP?.slice(0, 5) || ""}`);

  let foot= <><Button
        variant="outlined"
        color="primary"
        size="small"
        // href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${CENTER_LAT},${CENTER_LON}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ mt: 2 }}
      >
        View on Google Maps
        <MapIcon sx={{ ml: 1 }} />
      </Button>
    <Divider sx={{ my: 2 }} />
    Have something to share about this location?
    <Button
      variant="outlined"
      color="primary"
      size="small"
      onClick={() => {
        window.open(
          // `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${LAT_LON}`,
          "_blank"
        );
      } }
      >
      Add a post or photo
      </Button>
        </>
  return (
    <LocationLayout 
      // images={photos?photos.map((entry) => entry.photos).flat():null}
      title={ formattedAddress || "No Address Available"}
      smallTitle 

          posts={<VerticalTimeline 
            openLocation={pageData.openLocation}
        parcelData={parcelData} fireData={fireData} posts={postData} 
        // body={<AddressEntry loadingPhotos={loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} posts={postData} />}
        body={<AddressEntry loadingPhotos={loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} />}
        />}
      
      // posts={<PostList posts={postData} />}
      onClose={onClose}
      // body={ <AddressEntry loadingPhotos = {loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} />}
    />
  );
}
