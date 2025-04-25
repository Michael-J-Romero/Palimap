import { useEffect, useRef } from "react";
import L from "leaflet";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import LocationMarker from "./LocationMarker";
import { useThemeContext } from "@/context/ThemeContext";

export default function MarkerLayer({open, setOpen, map,mapMode , itemData, selectedMarker, setSelectedMarker, setSelectedLocation, openLocation }) {
  const { theme: muiTheme } = useThemeContext();
  const markerRefs = useRef(new Map());

  if (!map.getPane("markerPane2")) {
      console.log("createdmarker pane", map.getPane("markerPane2"));
    map.createPane("markerPane2");
    map.getPane("markerPane2").style.zIndex = 950;
  }
  else {
    console.log("createdmarker pane already exists", map.getPane("markerPane2"));
  }
  useEffect(() => {
    // if (!map) return;


    itemData.forEach((coord) => {
      const id = 1 + coord.id;
      if (!markerRefs.current.has(id)) {
        const container = document.createElement("div");
        const root = ReactDOM.createRoot(container);


        // Render ONCE
        root.render(
          <StyledThemeProvider theme={muiTheme}>
            <ThemeProvider theme={muiTheme}>
              <LocationMarker
              theme={muiTheme}
                id={id}
                data={coord}
                selectedMarker={selectedMarker}
                setSelectedMarker={setSelectedMarker}
                setSelectedLocation={setSelectedLocation}
                openLocation={openLocation}
                bindTrigger={(fn) => {
                    markerRefs.current.set(id, { marker: leafletMarker, triggerUpdate:fn });
                }}
              />
            </ThemeProvider>
          </StyledThemeProvider>
        );
        root.onUnmount = () => {
           
            console.log("unmounted marker", id);
            root.unmount();
            root.remove();
            container.remove();
            markerRefs.current.delete(id);
        };

        const icon = L.divIcon({
          className: "custom-div-icon",
          html: container,
          iconSize: null,
          iconAnchor: [20, 40],
        });

        const leafletMarker = L.marker([coord.coords.lat, coord.coords.lng], {
          icon,
          pane: "markerPane2",
          preserveOnBasemapSwitch: true, 
        }).addTo(map);
        if (selectedMarker === id) {
            leafletMarker.setZIndexOffset(1000);
          } else {
            leafletMarker.setZIndexOffset(0);
          }
       console.log("added marker", id);
    } else {
        const ref = markerRefs.current.get(id);
        if (selectedMarker === id) {
            ref.marker.setZIndexOffset(1000);
          } else {
            ref.marker.setZIndexOffset(0);
          }
        console.log("marker already exists", id, ref, markerRefs.current);
        ref.triggerUpdate({
          theme: muiTheme,
          selectedMarker,
          setSelectedMarker,
          setSelectedLocation,
        });
      }
    });

    // Cleanup removed markers (optional)
    const currentIds = new Set(itemData.map((d) => 1 + d.id));
    for (const [id, ref] of markerRefs.current.entries()) {
      if (!currentIds.has(id)) {
        console.log("weee 2removing marker", id, ref);
        map.removeLayer(ref.marker);
        ref.marker = null;
        markerRefs.current.delete(id);
      }
    }
  }, [map, itemData,mapMode,muiTheme, selectedMarker]);

  // 🔁 Handle updates (only triggers internal reactivity)
  useEffect(() => {
    markerRefs.current.forEach(({ triggerUpdate }) => {
      triggerUpdate?.({
        theme: muiTheme,
        selectedMarker,
        setSelectedMarker,
        setSelectedLocation,
      });
    });
  }, [selectedMarker,muiTheme]);
 useEffect(() => {
    console.log("weee marker layer cleanup");
    return () => {
        markerRefs.current.forEach((ref,index) => {
            const { marker } = ref;
            if (marker) {
            map.removeLayer(marker);
            ref.marker = null;
            markerRefs.current.delete(index);
            console.log("weee removed marker", index);
            // ref.triggerUpdate = null;
            // markerRefs.current.delete(ref.id);
            // console.log("removed marker", ref.id);
            // marker.remove();

            }
        });
        markerRefs.current.clear();
        }
    // Cleanup removed markers (optional)
    // const currentIds = new Set(itemData.map((d) => 1 + d.id));
 } , []);


  return null;
}
