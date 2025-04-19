"use client";
import React, { useRef, useEffect } from "react";


export default function MapPage() {
    return (
        <div style={{ height: "100vh", width: "100%" }}>
       asdf
        </div>
    );
    }

// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import "leaflet-side-by-side"; // Ensure this is installed via npm
// // import "leaflet-side-by-side/leaflet-side-by-side.css";

// function SplitMapComparison() {
//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     const map = L.map(mapContainerRef.current, {
//       center: [34.05, -118.5], // Pacific Palisades
//       zoom: 13,
//       zoomControl: false,
//     });

//     mapRef.current = map;

//     // Esri Layer (Pre-Fire Imagery)
//     const esriLayer = L.tileLayer(
//       "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//       {
//         attribution: "Tiles &copy; Esri"
//       }
//     );

//     // Google Maps Layer (Post-Fire Imagery)
//     const googleLayer = L.tileLayer(
//         'https://tiles.arcgis.com/tiles/DO4gTjwJVIJ7O9Ca/arcgis/rest/services/World_Imagery_Wayback_2025_02/MapServer/tile/{z}/{y}/{x}',
//         {
//           attribution: 'Esri Wayback Imagery – February 2025'
//         }
//     );

//     esriLayer.addTo(map);
// googleLayer.addTo(map);

// console.log("esriLayer",esriLayer,googleLayer)
//     // Add side-by-side comparison
//     L.control.sideBySide(esriLayer, googleLayer).addTo(map);

//     return () => {
//       map.remove();
//     };
//   }, []);

//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       https://stacindex.org/catalogs/maxar-open-data-catalog-ard-format#/item/3ASjitMxUyc5THh8EmvKnoRZFbf1utN21NbV91oMefNNSnEjwmdXSsi667HzHB/EhasWoEgo6keehwcHhSM8e8DJ1EFG7zXRNE5wLVmPhfkiJrXwMdvaYyBTSqsXcjiWkNYt9VKdkhcLzVNATG9zEDNqKfJDJbAYZwAqxxouEnxE7ZjrBih2KzHaAq/KZHdnKcdvXLPR3bQV2t82VTpkc4VFoYyHuUhR3BRYP2Rhwte8uGf7MUV27iHLL7V4ct3oTvdRZLt9nKvpc24Wktw35upv1cAnvdu2XWWiKvMWBcq?si=2&t=1#19/34.044768/-118.520043
//       <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
//     </div>
//   );
// }

// export default SplitMapComparison;
