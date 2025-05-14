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
    <div >
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
      <Typography variant="h6" component="div" gutterBottom>
        {STRUCTURETYPE || "Unknown Structure Type"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Damage: {DAMAGE || "N/A"}
      </Typography>
      {entry.photos && entry.photos.length > 0 ? (
        <Pics photoData={[entry]} />
      ) : ''
      }
      <Divider sx={{ my: 2 }} />

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

    }}>
  
    {/* <Typography variant="h6" component="div" gutterBottom>
      {city_s_z || "No Address Available"}
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      APN: {APN} | AIN: {AIN}
    </Typography>
    <Divider sx={{ my: 2 }} /> */}
    <Grid container spacing={2}>
        {/* <Typography variant="h6" component="div" gutterBottom>
          {SitusFullAddress || "No Address Available"}
        </Typography>  */}
      {/* <Grid item xs={6}><strong>AIN:</strong> {AIN || "N/A"}</Grid> */}
      <Grid item xs={6}><strong>Type:</strong> {UseType || "N/A"}</Grid>
      <Grid item xs={6}><strong>Use:</strong> {UseDescription || "N/A"}</Grid>
      <Grid item xs={6}><strong>Year Built:</strong> {YearBuilt1 || "N/A"}</Grid>
      <Grid item xs={6}><strong>Bedrooms:</strong> {Bedrooms1 || "N/A"}</Grid>
      <Grid item xs={6}><strong>Bathrooms:</strong> {Bathrooms1 || "N/A"}</Grid>
      <Grid item xs={6}><strong>Sq Ft:</strong> {SQFTmain1 ? `${SQFTmain1} sq ft` : "N/A"}</Grid>
      <Grid item xs={6}><strong>TotalValue ({Roll_Year}):</strong> ${totalValue? totalValue.toLocaleString() : "N/A"}</Grid>
      <Grid item xs={6}><strong>APN:</strong> {APN || "N/A"}</Grid>
      
    </Grid>
    <Divider sx={{ my: 2 }} />
    <Typography variant="h6" component="div" gutterBottom sx = {{textAlign: "center",fontWeight: "bold"}}>
      Affected Structures:
    </Typography>

      {sructureStatus}
    <Divider sx={{ my: 2 }} />
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
      <Button
        variant="outlined"
        color="primary"
        size="small"
        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${CENTER_LAT},${CENTER_LON}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ mt: 2 }}
      >
        View on Google Maps
        <MapIcon sx={{ ml: 1 }} />
      </Button>
    <Divider sx={{ my: 2 }} />
    Is this your property?{" "}
    <Button
      variant="outlined"
      color="primary"
      size="small"
      onClick={() => {
        window.open(
          `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${LAT_LON}`,
          "_blank"
        );
      } }
      >
      Claim it!
      </Button>

  </CardContent>
  )
}
export default function Address({ pageData, onClose }) {
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
      setLoading(false);
      if (parcelData.features.length > 1) {
        alert("Multiple parcels found, displaying the first one.");
      }
      setParcelData(parcelData.features?.[0]);
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
  return (
    <LocationLayout
      // images={photos?photos.map((entry) => entry.photos).flat():null}
      title={ parcelData?.properties?.SitusFullAddress || "No Address Available"}
      onClose={onClose}
      body={ <AddressEntry loadingPhotos = {loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} />}
    />
  );
}
