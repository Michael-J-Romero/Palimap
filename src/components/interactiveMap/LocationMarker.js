import { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const bubbleSize = 35;
const expandedScale = 3.25;

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

const MarkerWrap = styled(Box)(({ theme, $hovered  }) => ({
  position: "relative",
  width: bubbleSize,
  height: bubbleSize,
  borderRadius: $hovered ? "4px" : "20px",
  borderBottomLeftRadius: ($hovered) ? "0px" : "20px",
  borderBottomRightRadius:( $hovered) ? "0px" : "20px",
  backgroundColor: `${theme?.palette?.background?.paper || "#fff"}`, // semi-transparent
  border: $hovered
    ? `1.5px solid ${theme?.palette?.background?.paper || "#fff7"}`
    : `2px solid ${theme?.palette?.divider || "#dcd5d5"}`,
  boxShadow: $hovered
    ? theme?.shadows?.[6] || "0 4px 8px rgba(0,0,0,0.3)"
    : theme?.shadows?.[3] || "1px 1px 4px 1px rgb(0 0 0 / 58%)",
  display: "flex",
  overflow: $hovered ? "hidden" : "visible",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  transform: $hovered ? `scale(${expandedScale})` : "scale(1)",
  transition: "all 0.3s ease",
  transformOrigin: "bottom center",
  pointerEvents: "none",
}));

const ImageOverlay = styled(Box)(({ $hovered }) => ({
  position: "absolute",
  width: bubbleSize,
  height: bubbleSize,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 2,
  opacity: $hovered ? 1 : 0,
  transition: "opacity 0.2s ease",
  pointerEvents: "none",
}));

const Arrow = styled(Box)(({ theme, $hovered }) => ({
  position: "absolute",
  bottom: -7,
  left: "50%",
  transform: "translateX(-50%)",
  width: 0,
  height: 0,
  borderLeft: "8px solid transparent",
  borderRight: "8px solid transparent",
  borderTop: `8px solid ${(theme?.palette?.background?.paper || "#fff")}`, // semi-transparent
  zIndex: 1,
  filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.35))`,
  transition: "opacity 0.2s ease",
  opacity: $hovered ? 0 : 1,
}));

const TextLabel = styled(Box)(({ theme, $hovered , isWider }) => ({
  position: "absolute",
  top: bubbleSize + 0,
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: theme.palette.background.paper || "white",
  padding: "4px 8px",
  borderRadius: 6,
  borderTopLeftRadius: isWider ? 6 : 0,
  borderTopRightRadius: isWider ? 6 : 0,
  whiteSpace: "nowrap",
  fontSize: 12,
  fontWeight: 500,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[2],
  opacity: $hovered ? 1 : 0,
  transition: "opacity 0.2s ease",
  zIndex: 3,
}));

export default function Marker({theme, data, selectedMarker, setSelectedMarker, setSelectedLocation, openLocation, map, bindTrigger }) {
  const [hovered, setHovered] = useState(false);
  const [externalState, setExternalState] = useState({
    selectedMarker,
    setSelectedMarker,
    setSelectedLocation,
  });
  
  const id = 1 + data.id;
  const isSelected = externalState.selectedMarker === id;

  useEffect(() => {
    if (bindTrigger) {
      bindTrigger((incoming) => {
        setExternalState((prev) => ({ ...prev, ...incoming }));
      });
    }
  }, [bindTrigger]);

  useEffect(() => {
    if (isSelected) setHovered(true);
    else setHovered(false);
  }, [isSelected,externalState.selectedMarker]);

  const handleClick = () => {
    externalState.setSelectedMarker(id);
    if (typeof openLocation === "function") openLocation(data.id);
  };
  //is wider = true if the text of the label is wider than the enlarged bubble
 const isWider = (data.title.length * 6) > (bubbleSize * expandedScale);
  return (
    <StyledThemeProvider theme={externalState?.theme||theme}>
            <ThemeProvider theme={externalState?.theme||theme}>
    <Box
    sx={{ 
      zIndex: isSelected ? 1000 : 1,
      position: "relative", width: bubbleSize, height: bubbleSize }}
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
            externalState.setSelectedMarker(id);
          // }
        }}
        onMouseLeave={() => {
          // if (isSelected) {
            setHovered(false);
            externalState.setSelectedMarker(null);
          // }
        }}
      />
      <MarkerWrap $hovered={hovered || isSelected} isWider={isWider}>
        <ImageOverlay
          $hovered={hovered || isSelected}
          style={{ backgroundImage: `url(${data.image})` }}
        />
        <Avatar
          sx={{
            overflow: "visible",
            margin: 0,
            padding: 0,
            width: bubbleSize * 0.66,
            height: bubbleSize * 0.66,
            fontSize: "1.25rem",
            backgroundColor: "transparent",
            color: "inherit",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {data.icon}
        </Avatar>
        <Arrow $hovered={hovered || isSelected} />
      </MarkerWrap>
      <TextLabel $hovered={hovered || isSelected} isWider={isWider}>
        {data.title}
        {/* <br /> */}
        {/* {data.address}asdf */}
        </TextLabel>
    </Box>
    </ThemeProvider>
    </StyledThemeProvider>
  );
}
