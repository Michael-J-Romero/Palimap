"use client";
import getData from "./data.js";
import Details from '../details'; 
import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import Map1 from "./map";
import List  from "./list";

let aa
 
function App({allData,openLocation}) {
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
  return (
    <Container 
     {...{
      selectedLocation,
       Map:
      <Map1 {...{openLocation,itemData, setSelectedLocation,selectedMarker, setSelectedMarker }} />,
      List: <List {...{openLocation,allData,itemData, selectedLocation,setSelectedLocation ,setSelectedMarker,selectedMarker,filterBy, setFilterBy}} />,
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
        padding: selectedLocation !== null
        ? "0px" : "0px",
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
