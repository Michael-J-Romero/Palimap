"use client";
import getData from "./data.js";
import Details from '../details'; 
import styled from "styled-components";
import React, { useState, useEffect, useRef,useContext } from "react";
import Map1 from "./map";
import List  from "./list";
import dynamic from "next/dynamic";
import {Tabs, Tab, useMediaQuery,Button, Drawer, IconButton, Box } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from "@mui/material/styles";
import LocationModal from '@/components/Location'; // Your modal
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MobileMapLayout from "./mobileMapLayout";
import { AppContext } from '@/context/AppContext';

const SplitMap = dynamic(() => import("../interactiveMap/index.js"), { ssr: false });

let aa
function getScrollableParent(element) {
  let parent = element.parentElement;
  while (parent) {
    const overflowY = window.getComputedStyle(parent).overflowY;
    const isScrollable = (overflowY === 'auto' || overflowY === 'scroll');
    if (isScrollable && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}
function App({ pageData,showModal,allData}) {

  const { updateAppState } = useContext(AppContext);
  
  const {slug,type }= pageData || {};
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const highlightedApn  = type==="apn" ? slug : null;
  const highlightedLocation = type!=="apn" ? slug : null;
  useEffect(() => {
    updateAppState({highlightedApn, highlightedLocation})
  }  , [highlightedApn, highlightedLocation]);
  let [showFireMap, setShowFireMap] = useState(true);
  useEffect(() => {
    if (slug !== null) {
      setOpen(true);
    }
  }  , [slug]);
  const openLocation = (slug,type) => {
    if(type === "apn") {
      router.push(`/map?apn=${slug}`, undefined, { shallow: true });
    }
    else {
      // else type is a manually submitted location post
      console.log("test3",{type,slug})
    router.push(`/map?location=${slug}`, undefined, { shallow: true });
    
    }
    setOpen(true);
    setTimeout(() => {
      const element = document.getElementsByClassName("swiper")[0];
      console.log("element weee", element);
      if (element) {
        // element.scrollIntoView({ block: "start"  });
        let container = getScrollableParent(element);
        if (!container) {
          container = document.documentElement; // Fallback to the document element
        }
        container.scrollTo({
          top: 0,
          left: 0,
        });
        
      }
    }, 200);
  };
  pageData.openLocation = openLocation; //!bad practice to pass functions like this
  if (!allData) {
    allData = getData();
  }
  let [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  let [filterBy, setFilterBy] = useState("all");
  let itemData = allData.filter((item) => {
    if (filterBy === "all") return true;
    
    return item.type === filterBy;
  } );
  
  
  
  
  let hash = window.location.hash;
  function simulatePageChange() {
    window.location.hash = ""
    setSelectedLocation(null);
    
  }
  let hashLocation = hash.replace("#", "");
  
  useEffect(() => {
    if (hashLocation !== "") {
      
    } else {
      simulatePageChange();
      setSelectedLocation(null);
    }
  }, [hashLocation]);
  
  
  
  useEffect(() => {
    
    if (selectedLocation !== null) {
      window.location.hash = `#${selectedLocation}`;
    } else {
      window.location.hash = "";
    }
  }
  , [selectedLocation]);
  const ContainerComponent = isMobile ? MobileMapLayout : Container;
  return (
    <ContainerComponent 
    {...{
      
      slug,
      forceOpen: setOpen,
      open, setOpen,
      
      showFireMap,
      setShowFireMap,
      selectedLocation,
      Map: showFireMap ?
      <SplitMap {...{isMobile,highlightedApn,open, setOpen,openLocation,itemData, setSelectedLocation,selectedMarker, setSelectedMarker }} />
      :<Map1 {...{openLocation,itemData, setSelectedLocation,selectedMarker, setSelectedMarker }} />,
      List: showModal?
      <LocationModal
      pageData = {pageData}
      onClose={() => {
        // router.push('/map', undefined, { shallow: true }); // Remove query param

        //go back in history
        window.history.back();
      }}
      />
      :<List {...{isMobile,openLocation,allData,itemData, selectedLocation,setSelectedLocation ,setSelectedMarker,selectedMarker,filterBy, setFilterBy}} />,
      Details: <Details {...{ selectedLocation,setSelectedLocation ,itemData ,pageData, setSelectedMarker}} />,
      
    }}
    > 
    </ContainerComponent>
  );
}



 
function Container({ open, setOpen,Map, Details, Footer, List, Header, selectedLocation, showFireMap, setShowFireMap }) {
  const [mapRef, setMapRef] = useState(null); // <-- pass this into Map
const theme = useTheme();
  // Fix Leaflet map sizing when toggling sidebar
  useEffect(() => {
    if (mapRef) {
      // let w=setInterval(() => {
      //   mapRef.invalidateSize();
      // }, 1);
      // let w2=setTimeout(() => {
      //   clearInterval(w);
      // } , 1000);
      // return () => {
      //   clearInterval(w2);
      //   clearInterval(w);
      //   clearTimeout(w2);
      // };
      // use animationFrame
      let w
      let fn = () => {
        if (mapRef) {
          mapRef.invalidateSize();
        }
        w = requestAnimationFrame(fn);
      }
      w = requestAnimationFrame(fn);
      let w2 = setTimeout(() => {
        cancelAnimationFrame(w);
      }, 1000);

      return () => {
        clearTimeout(w2);
        cancelAnimationFrame(w);
      };
    }
  }, [open, mapRef]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Sidebar Panel */}
      <Box
        sx={{
          width: open ? 450 : 10,
          transition: "width 0.3s ease",
          backgroundColor: "#222",
          color: "#fff",
          // overflow: "hidden",
          position: "relative",
        }}
      >
        {  (
          <>
             {List} 
          </>
        )}

        {/* Vertical Toggle Tab (always visible) */}
     
<IconButton
  onClick={() => setOpen(!open)}
  sx={{
    position: "absolute",
    top: "50%",
    right: -24,
    transform: "translateY(-100%)",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    borderLeft: "1px solid "+ theme.palette.divider,
    borderRadius: "0 4px 4px 0",
    width: 28,
    height: 64,
    minWidth: 0,
    padding: 0,
    zIndex: 1000,
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
    }
  }}
>
  {open ? (
    <ChevronLeftIcon   />
  ) : (
    <ChevronRightIcon />
  )}
</IconButton>

      </Box>

      {/* Main Map Area */}
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          backgroundColor: "#333",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Pass mapRef setter to the Map component */}
        {React.cloneElement(Map, { setMapRef })}

        {/* Overlay with Details */}
        {selectedLocation && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#333",
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Details}
          </Box>
        )}
      </Box>
    </Box>
  );
}



const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  // height: calc(100vh - 64px);
  overflow: auto;
  position: relative;
  background-color: ${props => props.theme.palette.background.default};
  color: eee;
  & .details-container {
    overflow: hidden;
    background-color: #333;
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    box-sizing: border-box;
    position: relative;
}
  & .horizontal-container {
    box-sizing: border-box;
    
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: row-reverse;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  & .list-container {
    flex: 1;
    background-color: #222;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    
    
    & .list {
      height: 100%; 
      cursor: pointer;
      color: #fff;
      }
      & .list-item {
        border-bottom: 1px solid #fff2;
      padding: 6px;
      margin: 2px 0;
      
      
      width: 100%;
      cursor: pointer;
      &:hover {
        background-color: #333;
      }
    }
  }
  & .map-container {
    
    flex: 1.5;
    background-color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  & .overlay {
    
    
    
    width: 100%;
    height: 100%;
    background-color:#333;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
`;
 
export default App;
