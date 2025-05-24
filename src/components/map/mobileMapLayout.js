import React, { useState, useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const DEFAULT_HEIGHT = 90;
const MAX_HEIGHT = window.innerHeight
const MID_HEIGHT = window.innerHeight * 0.55;

export default function MobileVerticalContainer({
    Map,
    Details,
    Footer,
    List,
    selectedLocation,
    open,
    setOpen,
    slug,
}) {
    const scrollRef = useRef(null);
    const theme = useTheme();
    const [mapRef, setMapRef] = useState(null);
    const [height, setHeight] = useState(DEFAULT_HEIGHT);
    const [opacity, setOpacity] = useState(1);
    const [previousHeight, setPreviousHeight] = useState(DEFAULT_HEIGHT);
    const isProgrammaticallyOpen = useRef(false);
    const [{ y }, api] = useSpring(() => ({
        y: window.innerHeight - DEFAULT_HEIGHT,
    }));


useEffect(() => {
  let frame;
  const track = () => {
    const val = y.get();
    const currentHeight = window.innerHeight - val;
    let newOpacity = 1;
    if (currentHeight > MID_HEIGHT) {
      newOpacity = 1 - (currentHeight - MID_HEIGHT) / ((MID_HEIGHT +100) - MID_HEIGHT);
    }
    newOpacity = Math.min(Math.max(newOpacity, 0), 1);
    setOpacity(newOpacity);
    frame = requestAnimationFrame(track);
  };

  frame = requestAnimationFrame(track);
  return () => cancelAnimationFrame(frame);
}, [y]);



    const isFullyExpanded = height === MAX_HEIGHT;

    const dragFn = (state) => {
        let { event, first, last, movement: [, my], memo = y.get() } = state;

        if (first && event?.target) {
            const scrollableEl = event.target.closest(".simplebar-content-wrapper");
            if (scrollableEl) {
                const atTop = scrollableEl.scrollTop <= 0;
                const atBottom =
                    scrollableEl.scrollTop + scrollableEl.clientHeight >= scrollableEl.scrollHeight;
                const pullingDown = my > 0;
                const pullingUp = my < 0;
                const allowDrag = (pullingDown && atTop) || (pullingUp && atBottom);
                if (isFullyExpanded && !allowDrag) {
                    state.cancel();
                    return;
                }
            }
        }

        if (!isFullyExpanded) {
            state.event?.preventDefault(); // treat all gestures as drag when not fully expanded
        }

        const newY = memo + my;
        const clampedY = Math.max(
            window.innerHeight - MAX_HEIGHT,
            Math.min(window.innerHeight - DEFAULT_HEIGHT, newY)
        );
        

 
        if (last) {
            const currentOffset = window.innerHeight - clampedY;
            const snapPoints = [DEFAULT_HEIGHT, MID_HEIGHT, MAX_HEIGHT];
            const closest = snapPoints.reduce((prev, curr) =>
                Math.abs(curr - currentOffset) < Math.abs(prev - currentOffset)
                    ? curr
                    : prev
            );
            setHeight(closest);
            api.start({ y: window.innerHeight - closest });
            if (closest < MID_HEIGHT) {
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
        eventOptions: { passive: false },
    });

    useEffect(() => {
        if (slug === null) {
            setOpen(false);
        }
    }, [slug]);

    useEffect(() => {
        if (open) {
            if (height < MID_HEIGHT) {
                setPreviousHeight(height);
            }
            setHeight(MID_HEIGHT);
            api.start({ y: window.innerHeight - MID_HEIGHT });
            isProgrammaticallyOpen.current = true;
        } else if (isProgrammaticallyOpen.current) {
            setHeight(previousHeight);
            api.start({ y: window.innerHeight - previousHeight });
            isProgrammaticallyOpen.current = false;
        }
    }, [open]);

    useEffect(() => {
        if (mapRef?.invalidateSize) {
            mapRef.invalidateSize();
        }
    }, [height, mapRef]);

    let heighty = y.to((y) => {
        const newHeight = window.innerHeight - y;
        return newHeight;
    });
    const animatedOpacity = y.to((val) => {
    const currentHeight = window.innerHeight - val;
    if (currentHeight <= MID_HEIGHT) return 1;
    if (currentHeight >= MAX_HEIGHT) return 0;
    return 1 - (currentHeight - MID_HEIGHT) / (MAX_HEIGHT - MID_HEIGHT);
});
console.log("animatedOpacity", opacity, animatedOpacity);
//set opacity 


    return (
        <Box
            className="mobileMapLayout"
            sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Map Section */}
            <Box
                sx={{
                    position: "relative",
                    inset: 0,
                    zIndex: 1,
                    flexGrow: 1,
                 }}
            >
                {React.cloneElement(Map, { setMapRef ,opacity})}
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
                    position: "relative",
                    width: "100%",
                    height: heighty,
                    color: theme.palette.text.primary,
                    zIndex: 20,
                    touchAction: "none",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    boxShadow: "0 -1px 6px rgba(0,0,0,0.6)",
                    display: "flex",
                    flexDirection: "column",
                    background: theme.palette.background.paper,
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
                        background: theme.palette.mode === "dark" ? "#333" : "#ddd",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                    }}
                >
                    <Box sx={{ width: 60, height: 4, borderRadius: 2, background: theme.palette.divider }} />
                </Box>

                {/* Content */}
                <Box
                    ref={scrollRef}
                    sx={{
                        flexGrow: 1,
                        overflowY: isFullyExpanded ? "auto" : "hidden",
                        touchAction: isFullyExpanded ? "auto" : "none",
                    }}
                >
                    {List}
                    {Footer && <Box>{Footer}</Box>}
                </Box>
            </animated.div>
        </Box>
    );
}
