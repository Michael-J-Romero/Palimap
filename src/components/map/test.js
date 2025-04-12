"use client";
// import geoJSON from './fireData.json';
// import './App.css';
import getData from "./data.js";
import CustomMarker from './CustomMarker';
import Details from '../details'; 
import styled from "styled-components";
import { Chip,Dialog, DialogContent, Card, div, CardContent, Typography, Button,Icon,IconButton,Select,MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import Map1 from "./map";
import List  from "./list";
 
function App({allData}) {
if (!allData) {
    allData = getData();
}
  let [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  let [filterBy, setFilterBy] = useState("all");
  let itemData = allData.filter((item) => {
    if (filterBy === "all") return true;
    //broken
    return item.type === filterBy;
  } );
  //get current location hash
  //if hash is empty, simulate back button
  //check this on any change to location
  //like if back button is pressed
  let hash = window.location.hash;
  function simulatePageChange() {
    window.location.hash = ""
    setSelectedLocation(null);
    // window.location.reload();
  }
  let hashLocation = hash.replace("#", "");
  //if hash is not empty, set selectedLocation to hash
  useEffect(() => {
    if (hashLocation !== "") {
      // setSelectedLocation(hashLocation);
    } else {
      simulatePageChange();
      setSelectedLocation(null);
    }
  }, [hashLocation]);
  
  

  useEffect(() => {
    //if selectedLocation changes, set windows location hash to selectedLocation
    if (selectedLocation !== null) {
      window.location.hash = `#${selectedLocation}`;
    } else {
      window.location.hash = "";
    }
  }
  , [selectedLocation]);
  return (
    <Container 
     {...{
      selectedLocation,
       Map:
      <Map1 {...{itemData, setSelectedLocation,selectedMarker, setSelectedMarker }} />,
      List: <List {...{allData,itemData, selectedLocation,setSelectedLocation ,setSelectedMarker,selectedMarker,filterBy, setFilterBy}} />,
      Details: <Details {...{ selectedLocation,setSelectedLocation ,itemData }} />,
 
     }}
    > 
    </Container>
  );
}
function Container({ Map, Details, Footer,List,Header,selectedLocation }) {
  return (
    <StyledContainer> 
      <div className="horizontal-container"  style={{
        //if selectedLocation is not null, set padding to 0
        padding: selectedLocation !== null
        ? "0px" : "20px",
        }}>
        <div className="map-container">
          {Map}
        </div>
        <div className="list-container">
          {List}
        </div>
        
        <div className="overlay" style={{
          display: selectedLocation !== null
          ? "block" : "none",
        }}>
          <div className="details-container">
            {Details}
          </div>
        </div>
      </div>
      {/* <div className="footer-container">
        {Footer}
      </div> */}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  position: relative;
  background-color: #222;
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
    // padding: 20px;
    box-sizing: border-box;
    position: relative;
}
  & .horizontal-container {
    box-sizing: border-box;
    // padding-top: 0;
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
    // padding: 0 12px;
    // margin-left: 20px;
    & .list {
      height: 100%; 
      cursor: pointer;
      color: #fff;
      }
      & .list-item {
        border-bottom: 1px solid #fff2;
      padding: 6px;
      margin: 2px 0;
      // background-color: #333;
      // border-radius: 8px;
      width: 100%;
      cursor: pointer;
      &:hover {
        background-color: #333;
      }
    }
  }
  & .map-container {
    // padding-left: 20px;
    flex: 1.5;
    background-color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  & .overlay {
    // position: absolute;
    // top: 0;
    // left: 0;
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
