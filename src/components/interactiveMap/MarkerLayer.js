import { useEffect, useRef, useContext } from "react";
import L from "leaflet";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import LocationMarker from "./LocationMarker";
import { useThemeContext } from "@/context/ThemeContext";
import { AppContext } from '@/context/AppContext';

export default function MarkerLayer({open,setOpen, map,mapMode , itemData, selectedMarker, setSelectedMarker, setSelectedLocation, openLocation }) {
  const { theme: muiTheme } = useThemeContext();
  const { appState } = useContext(AppContext);
  const { highlightedApn, highlightedLocation } = appState;
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
   const apnMap = new Map();
const multiples = [];

itemData.forEach((item) => {
  const list = apnMap.get(item.apn) || [];
  list.push(item);
  apnMap.set(item.apn, list);
});

// Mark duplicates and prepare synthetic "multiple" markers
apnMap.forEach((itemsWithSameApn) => {
  if (itemsWithSameApn.length > 1) {
    // Mark all real duplicates as extras
    itemsWithSameApn.forEach((entry) => {
      entry.isExtra = true;
    });

    // Add one synthetic marker with `multiple` and `extras`
    const clone = {
      ...itemsWithSameApn[0],
      id: itemsWithSameApn[0].id + "_multiple",
      isExtra: false,
      multiple: true,
      extras: [...itemsWithSameApn],
    };
    multiples.push(clone);
  }
});

const itemData2 = [...multiples, ...itemData];

    console.log("itemDataa", itemData2);
    itemData2.forEach((item) => {
      if (item.isExtra) return;
      const id = 1 + item.id;
      let multiple = false;

      if(item.multiple){
    console.log("itemDataa2", item);

        multiple = item.extras.length  
      } 
      if (!markerRefs.current.has(id)) {
        const container = document.createElement("div");
        const root = ReactDOM.createRoot(container);


        // Render ONCE
        root.render(
          <StyledThemeProvider theme={muiTheme}>
            <ThemeProvider theme={muiTheme}>
              <LocationMarker
              highlightedApn={highlightedApn}
              highlightedLocation={highlightedLocation}
                map={map}
              theme={muiTheme}
              multiple={multiple}
                id={id}
                data={item}
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

        const leafletMarker = L.marker([item.coords.lat, item.coords.lng], {
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
    const currentIds = new Set(itemData2.map((d) => 1 + d.id));
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
        highlightedApn,
        highlightedLocation,
      });
    });
  }, [selectedMarker,muiTheme, highlightedApn, highlightedLocation]);
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
