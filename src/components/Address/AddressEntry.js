"use client";
import {
    Box, Typography, CardContent, CircularProgress
} from "@mui/material";
import PhotoGallery from "../PhotoGallery/index";
export default function AddressEntry({ entryData, fireData, loadingPhotos }) {
    return (
        <Box sx={{
            
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 0,
            flexShrink: 1,
        }}>
            <AddressDetails loadingPhotos={loadingPhotos} entryData={entryData} fireData={fireData} />
        </Box>
    );
}
const AddressDetails = ({ loadingPhotos, entryData, fireData }) => {
    if (!entryData) return null;
    const data = entryData;
    console.log("AddressDetails data", data, fireData);
    let sructureStatus = loadingPhotos ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <CircularProgress />
        </Box>
    )
        :
        (!fireData || fireData.length === 0) ? (
            <Typography variant="body1">No damage shown for this address.</Typography>
        )
            : <Box sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}>
                <PhotoGallery fireData={fireData} />

            </Box>
    return !entryData.geometry ? (
        <Typography variant="body1">No data available for this address.</Typography>
    ) : (
        <Box sx={{
            color: "text.primary",
            px: 0,
            pb: 0,
            py: .5,
        }}>
            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: "left", fontWeight: "bold" }}>
            </Typography>
            {sructureStatus}
        </Box>
    )
}
