"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider, 
  CircularProgress, 
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationLayout from "../SidebarLayout";
import getData from "@/components/map/data.js";
import VerticalTimeline from "./VerticalTimeline";

 
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
export default function Address({ pageData, onClose }) {
  const [postData, setPostData] = useState(null);
  const { slug, getParcelData } = pageData;
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(true);
    const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [photos, setPhotos] = useState(null);
  const [fireData, setFireData] = useState(null);
  const {openLocation}=pageData
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
   let formattedAddress = regularCapitalize(`${SitusAddress || ""} `)
  //  let formattedAddress = regularCapitalize(`${SitusAddress || ""}, ${SitusCity || ""}, ${SitusState || ""} ${SitusZIP?.slice(0, 5) || ""}`);

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
//  return <VerticalTimeline 
//         openLocation={pageData.openLocation}
//         // parcelData={parcelData} fireData={fireData} posts={postData} 
//         {...{parcelData, fireData,posts: postData, loadingPhotos, onClose}}
//         // body={<AddressEntry loadingPhotos={loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} posts={postData} />}
       
//         />
  return (
    <LocationLayout 
    noPadding
      // images={photos?photos.map((entry) => entry.photos).flat():null}
      title={ formattedAddress || "No Address Available"}
      // smallTitle 

        posts={<VerticalTimeline 
        openLocation={pageData.openLocation}
        // parcelData={parcelData} fireData={fireData} posts={postData} 
        {...{parcelData, fireData,posts: postData, loadingPhotos, onClose,pageData}}
        // body={<AddressEntry loadingPhotos={loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} posts={postData} />}
       
        />}
      
      // posts={<PostList posts={postData} />}
      onClose={onClose}
      // body={ <AddressEntry loadingPhotos = {loadingPhotos} entryData={parcelData} onClose={onClose} fireData={fireData} />}
    />
  );
}
