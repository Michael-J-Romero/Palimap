import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const bubbleSize = 35;
const expandedScale = 2;

const NumCircle = styled(Box)(({ theme }) => ({


    position: 'absolute',
    border: '2px solid',
boxShadow:   "2px -1px 4px rgba(0,0,0,0.2)",

  
            backgroundColor: theme?.palette?.text?.primary,
          borderRadius: "50%",
        lineHeight: 1,
          // width: bubbleSize * 0.66,
          // height: bubbleSize * 0.66,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          color: theme?.palette?.background?.paper,
          fontWeight: 600,
          // color: theme?.palette?.text?.primary,

            
            whiteSpace: "pre",
}));

const HoverZone = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: bubbleSize,
  height: bubbleSize,
  top: 0,
  left: 0,
  borderRadius: "50%",
  zIndex: 10,
  cursor: "pointer",
}));
let red = "#ea4335";
const MarkerWrap = styled(Box)(({ theme, $hovered,isSelected, hovered, isWider }) => ({
  position: "relative",
  width: bubbleSize,
  height: bubbleSize,
  borderRadius:  ( hovered) ? "34px" : "20px",
  //   borderBottomLeftRadius: (hovered) ? "0px" : "20px",
  // borderBottomRightRadius:( hovered) ? "0px" : "20px",
  backgroundColor: `${
    // hovered? 
    // theme?.palette?.text?.primary  
    //  :
     isSelected? theme?.palette?.text?.primary
     :theme?.palette?.background?.paper 
  }`, // semi-transparent
  border: 
  isSelected?`3px solid ${theme?.palette?.background?.paper || "#fff7"}`
  :
  hovered
    ? `1.5px solid ${theme?.palette?.background?.paper || "#fff7"}`
    : `2px solid ${theme?.palette?.divider || "#dcd5d5"}`,
  boxShadow: hovered
    ? theme?.shadows?.[6] || "0 4px 8px rgba(0,0,0,0.3)"
    : theme?.shadows?.[3] || "1px 1px 4px 1px rgb(0 0 0 / 58%)",
  display: "flex",
  // overflow:'hidden',
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  transform: hovered ? `scale(${expandedScale})` : "scale(1)",
  transition: "all .6s ease",
  transformOrigin: "bottom center",
  pointerEvents: "none",
}));

const ImageOverlay = styled(Box)(({ $hovered }) => ({
  position: "absolute",
  width: bubbleSize,
  height: bubbleSize,
  // backgroundSize: "cover",
  backgroundPosition: "center",
  //scale bg
  backgroundSize: $hovered ? "170%" : "120%",
  zIndex: 2,
  opacity: $hovered ? 1 : 0,
  // transition: "opacity 0.2s ease",
  transition: "all 0.4s ease",
  pointerEvents: "none",
}));

const Arrow = styled(Box)(({ theme, $hovered,isSelected ,hovered}) => ({
  position: "absolute",
  bottom: -5,
  left: "50%",
  transform: "translateX(-50%)",
  width: 0,
  height: 0,
  borderLeft: "8px solid transparent",
  borderRight: "8px solid transparent",
  borderTop: `8px solid `,
  borderTopColor: theme?.palette?.background?.paper || "#fff",
  zIndex: 1,
  filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.35))`,
  transition: "opacity 0.2s ease",
  // opacity: $hovered ? 0 : 1,
}));

const TextLabel = styled(Box)(({ theme, $hovered , isWider , isSelected}) => ({

  //   color: white;
  // font-weight: bold;
  // text-shadow:
  //   -1px -1px 0 black,
  //    1px -1px 0 black,
  //   -1px  1px 0 black,
  //    1px  1px 0 black;

  // fomtWeight: 'bold',
  pointerEvents: "none",
  textShadow: isSelected?"-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black"
:   "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
//   textShadow: !isSelected?`-1px -1px 0 ${theme?.palette?.text?.primary}, 1px -1px 0 ${theme?.palette?.text?.primary}, -1px 1px 0 ${theme?.palette?.text?.primary}, 1px 1px 0 ${theme?.palette?.text?.primary}`
// :   `-1px -1px 0 ${theme?.palette?.background?.paper}, 1px -1px 0 ${theme?.palette?.background?.paper}, -1px 1px 0 ${theme?.palette?.background?.paper}, 1px 1px 0 ${theme?.palette?.background?.paper}`,
  position: "absolute",
  top: bubbleSize + 0,
  left: "50%",
  transform: "translateX(-50%)",
  // backgroundColor: 
  // $hovered? theme?.palette?.text?.primary
  // :isSelected? 'transparent'
  // :theme.palette.background.paper || "white",
  padding: "4px 8px",
  borderRadius: 6,
  // borderTopLeftRadius: isWider ? 6 : 0,
  // borderTopRightRadius: isWider ? 6 : 0,
  whiteSpace: "nowrap",
  fontSize: 12,
  fontWeight: 600,
  color: !isSelected? '#000' :  "#fff",
  // boxShadow: theme.shadows[2],
  opacity: $hovered||isSelected ? 1 : 0,
  transition: "opacity 0.2s ease",
  zIndex: 3,
}));

export default function Marker(props) {
  const {highlightedLocation,highlightedApn,multiple,theme, data, selectedMarker, setSelectedMarker, setSelectedLocation, openLocation, map, bindTrigger } = props;
  const [hovered, setHovered] = useState(false);
  const [y, setY] = useState(0);
  const [externalState, setExternalState] = useState({
    selectedMarker,
    setSelectedMarker,
    setSelectedLocation,
    highlightedApn,
    highlightedLocation,
  });
  const id = 1 + data.id;
  // const isSelected = externalState.selectedMarker === id; 
  const isSelected = externalState?.highlightedApn === data.apn 
  // const isSelected = externalState.highlightedLocation == id; 
  console.log("isSelectedd",isSelected,externalState.highlightedLocation, id,id);
  const groupIsSelected = multiple
  && data.extras.find((item) => item.id == externalState.highlightedLocation);
  const toSide = //data.isExtra||
  groupIsSelected||externalState?.highlightedApn === data.apn 

  useEffect(() => {
    setTimeout(() => {
      setY(100);
    }, 500+data.id * 50);
  }, []);
  useEffect(() => {
    if (bindTrigger) {
      bindTrigger((incoming) => {
        setExternalState((prev) => ({ ...prev, ...incoming }));
      });
    }
  }, [bindTrigger]);
let mapRef = useRef(null);
mapRef.current = map;
  useEffect(() => {
    // if (isSelected) setHovered(true);
    // else setHovered(false);
    let t=setTimeout(() => {
      if (isSelected) {
        console.log("selectedd", data,map);
        //move map to marker
        if (map) {//leaflet map
          map.invalidateSize()
          mapRef.current.flyTo([data.coords.lat, data.coords.lng], map.getZoom(), 
             {
            animate: true,
            // offset y
            // offset: [0, -300],
            duration: 1,
          });
        }
       }  
    },500);
    return () => {
      clearTimeout(t);
    }
  }, [
    isSelected,
    // externalState.selectedMarker,
    highlightedApn]);

  const handleClick = () => {
    externalState.setSelectedMarker(id);
    console.log("selectedd", openLocation, data);
    if (typeof openLocation === "function") {
      if(true)
        openLocation(data.apn,'apn')
      else
        openLocation(id)
    }
  };
  //is wider = true if the text of the label is wider than the enlarged bubble
 const isWider = (data.title.length * 6) > (bubbleSize * expandedScale);
  return (
    <StyledThemeProvider theme={externalState?.theme||theme}>
            <ThemeProvider theme={externalState?.theme||theme}>
    <Box
    sx={{ 
      display: (data.isExtra && !isSelected)
      ?"none":"block",
      zIndex: isSelected ? 1000 : 1,
      position: "relative", width: bubbleSize, height: bubbleSize
      ,//transform: `translateY(${y}px)`,
      transitionDuration: "0.5s",
      transformOrigin: "bottom center",
      ...(
      //   (toSide)
      //   ?{
      //   transform: `translateX(2px) translateY(6px) rotate(${multiple?'70deg':'70deg'}) translateY(-6px) scale(.8)`,
      //   opacity: 1,
        
      // }
      //   :
        y?{
        opacity: 1,
        transform: `translateY(0px) scale(1)`,
      }:{
        opacity: 0,
        transform: `translateY(${-y}px) scale(.2)`,
      })
    }}
    onMouseDown={(e) => {
      e.stopPropagation();
      e.preventDefault();
      e.currentTarget.dataset.startX = e.clientX;
      e.currentTarget.dataset.startY = e.clientY;
    }}
    // click
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
    onMouseUp={(e) => {
      e.stopPropagation();
      e.preventDefault();
      const startX = parseFloat(e.currentTarget.dataset.startX || "0");
      const startY = parseFloat(e.currentTarget.dataset.startY || "0");
      const dist = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
  
      const DRAG_THRESHOLD = 5; // pixels
      if (dist < DRAG_THRESHOLD) {
        handleClick();
      }
    }}
    >
      <HoverZone
        onMouseEnter={() => {
          // if (!isSelected) {
            setHovered(true);
            // externalState.setSelectedMarker(id);
          // }
        }}
        onMouseLeave={() => {
          // if (isSelected) {
            setHovered(false);
            // externalState.setSelectedMarker(null);
          // }
        }}
      />
      <MarkerWrap $hovered={ isSelected} isWider={isWider}
        {...{hovered:hovered&&!isSelected
          , isSelected}}
      
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: "50%",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}>
         <ImageOverlay
          $hovered={hovered && !isSelected}
          style={{ backgroundImage: `url(${data.image})` }}
          /> 
          </div>
        <Avatar
          sx={{







            position: "relative",
            overflow: "visible",
            margin: 0,
            padding: 0,
            width: bubbleSize * 0.66,
            height: bubbleSize * 0.66,
            fontSize: "1.25rem",
            backgroundColor: "transparent",
            color: isSelected ? externalState?.theme?.palette?.background?.paper
            :externalState?.theme?.palette?.text?.primary,
            zIndex: 1,
            pointerEvents: "none",
            // transform: `rotate(${toSide?multiple?'-70deg':'-70deg':'0deg'})`,
            transition: "transform 0.5s ease",
          }}
        >
          {(multiple )?
          <NumCircle
          style={{
      transform: `translate(14px, -13px) scale(${(hovered && !isSelected)
        ?.5:.8})`,
      transition: "transform 0.4s ease",

            width: bubbleSize * 0.70,
            height: bubbleSize * 0.70, 
          }}
          >{multiple}</NumCircle>
           : ''
        }
        <div style={{
          opacity: (hovered && !isSelected) 
          ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}>
        {data.icon}
        </div>
        </Avatar>
      </MarkerWrap>
        <Arrow $hovered={hovered || isSelected} 
        {...{hovered, isSelected}}
        />
           <TextLabel $hovered={hovered } isWider={isWider} isSelected={isSelected}>
        {data.title}
        {/* <br /> */}
        {/* {data.address}asdf */}
        </TextLabel>
    </Box>
    </ThemeProvider>
    </StyledThemeProvider>
  );
}
