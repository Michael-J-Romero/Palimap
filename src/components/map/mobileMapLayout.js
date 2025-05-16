import React, { useState, useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const DEFAULT_HEIGHT = 130;
const MAX_HEIGHT = window.innerHeight * 0.98;
const MID_HEIGHT = window.innerHeight * 0.55;

export default function MobileVerticalContainer({
  Map,
  Details,
  Footer,
  List,
  selectedLocation,
  open,
  setOpen,slug,
}) {
  const scrollRef = useRef(null);
  const theme = useTheme();
  const [mapRef, setMapRef] = useState(null);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [previousHeight, setPreviousHeight] = useState(DEFAULT_HEIGHT);
  const isProgrammaticallyOpen = useRef(false);

  const [{ y }, api] = useSpring(() => ({
    y: window.innerHeight - DEFAULT_HEIGHT,
  }));

  const dragFn = (state) => {
        
    let {event, first,last, movement: [, my], memo = y.get() } = state;
   
    if (first && event?.target) {
      const scrollableEl = event.target.closest(".simplebar-content-wrapper");
      if (scrollableEl) {
        const atTop = scrollableEl.scrollTop <= 0;
        const atBottom =
          scrollableEl.scrollTop + scrollableEl.clientHeight >= scrollableEl.scrollHeight;

        const pullingDown = my > 0;
        const pullingUp = my < 0;

        const allowDrag =
          (pullingDown && atTop) || (pullingUp && atBottom);

        if (!allowDrag) {
          state.cancel(); // cancel drag, allow scroll
          return;
        }
      }
    }
    
    
    
     
       // Check scroll edge on first drag
    if (first && scrollRef.current) {
      const el = scrollRef.current;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

      // Prevent drag unless at top and pulling down, or at bottom and pulling up
      if ((my < 0 && !atBottom) || (my > 0 && !atTop)) {
        state.cancel(); // cancel the drag gesture
        return;
      }
    }



    const newY = memo + my;

    // Clamp within bounds
    const clampedY = Math.max(
      window.innerHeight - MAX_HEIGHT,
      Math.min(window.innerHeight - DEFAULT_HEIGHT, newY)
    );

    if (last) {
      const currentOffset = window.innerHeight - clampedY;

      // Snap to nearest of 3 heights
      const snapPoints = [DEFAULT_HEIGHT, MID_HEIGHT, MAX_HEIGHT];
      const closest = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - currentOffset) < Math.abs(prev - currentOffset)
          ? curr
          : prev
      );

      setHeight(closest);
      api.start({ y: window.innerHeight - closest });

      // If not fully open anymore, mark as closed
      if (closest < MAX_HEIGHT) {
        setOpen(false);
        isProgrammaticallyOpen.current = false;
      }
    } else {
      api.start({ y: clampedY, immediate: true });
    }

    return memo;
  };

  const bind = useDrag(dragFn, {
    axis: "y",
    pointer: { touch: true },
  });

  useEffect(() => {
    // Set initial height based on open prop
    if (slug===null) {
        setOpen(false);
    }
}, [slug]);
  // Handle open prop changes
  useEffect(() => {
    if (open) {
      if (height < MAX_HEIGHT) {
        setPreviousHeight(height);
      }
      setHeight(MAX_HEIGHT);
      api.start({ y: window.innerHeight - MAX_HEIGHT });
      isProgrammaticallyOpen.current = true;
    //   setTimeout(() => {
    //     setOpen(false);
    //   }, 1000); // Delay to allow for animation
    } else if (isProgrammaticallyOpen.current) {
      // Only revert if we were forced open
      setHeight(previousHeight);
      api.start({ y: window.innerHeight - previousHeight });
      isProgrammaticallyOpen.current = false;
    }
  }, [open]);

  // Optional: fix map rendering on resize
  useEffect(() => {
    if (mapRef?.invalidateSize) {
      mapRef.invalidateSize();
    }
  }, [height, mapRef]);

  return (
    <Box className="mobileMapLayout"
    sx={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Map Section */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {React.cloneElement(Map, { setMapRef })}
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

      {/* Draggable Bottom Panel */}
      <animated.div
        {...bind()}
        style={{
          position: "absolute",
          top: y,
          left: 0,
          width: "100%",
          height: window.innerHeight,
        //   background: "#222",
          color: theme.palette.text.primary,
          zIndex: 20,
          touchAction: "none",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          boxShadow: "0 -2px 11px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag Handle */}
        <Box
          sx={{
            flexShrink: 0,

            height: 25,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "grab",
            // background: theme.palette.background.paper, //needs more contrast, 
            background: theme.palette.mode === "dark" ? "#000" : "#fff",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Box sx={{ width: 60, height: 4, borderRadius: 2, background: theme.palette.text.secondary }} />
        </Box>

        {/* Content */}
        <Box ref={scrollRef} 
         sx={{ flexGrow: 1, overflowY: "auto"}}>
          {List}
        {Footer && <Box>{Footer}</Box>}
        </Box>

      </animated.div>
    </Box>
  );
}
